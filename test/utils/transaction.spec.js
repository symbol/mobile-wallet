import { Account, Address, Mosaic, MosaicId, NamespaceId, PublicAccount, TransactionType, UInt64 } from 'symbol-sdk';
import MosaicService from '@src/services/MosaicService';
import { getPublicKeyFromPrivateKey } from '@src/utils/account';
import {
    getAggregateTransactionInfoPreview,
    getHashLockTransactionInfoPreview,
    getNamespaceTransactionInfoPreview,
    getTransferTransactionInfoPreview,
    isOutgoingTransaction,
    isPostLaunchOptInTransaction,
    transactionAwaitingSignatureByAccount,
} from '@src/utils/transaction';
import { TransactionInfoPreviewValueType } from '@src/storage/models/TransactionInfoPreviewModel';
import { Constants } from '@src/config/constants';
import { getFinanceBotPublicKeys } from '@src/config/environment';
import { network } from '../network.config';

describe('transaction utils tests', () => {
    const currentAccount = new Account.createFromPrivateKey(
        '1111111111111111111111111111111111111111111111111111111111111111',
        network.networkType
    );
    const randomAccountPublicKey = '0000000000000000000000000000000000000000000000000000000000000000';
    const randomAccountAddress = Address.createFromRawAddress('TBYBPULFJVOVTP26D7OAY7IVD7B4HOA6G3GGHRI');

    test('transaction should await signature by current account', async () => {
        const cosignaturePublicKeys = [randomAccountPublicKey];

        const info = {
            transactionType: TransactionType.AGGREGATE_BONDED,
            status: 'unconfirmed',
            signerAddress: randomAccountAddress.pretty(),
            hash: '2BBE2C855D65EAE061CD042A2E38C114B9811A7335C8C489A4B6861F0468E183',
            cosignaturePublicKeys,
            fee: '0.12',
        };

        const formattedTransaction = {
            ...info,
            innerTransactions: [],
        };

        expect(transactionAwaitingSignatureByAccount(formattedTransaction, currentAccount, [])).toBe(true);
    });

    test('transaction should not await signature by current account', async () => {
        const cosignaturePublicKeys = [randomAccountPublicKey, getPublicKeyFromPrivateKey(currentAccount.privateKey)];

        const info = {
            transactionType: TransactionType.AGGREGATE_BONDED,
            status: 'unconfirmed',
            signerAddress: randomAccountAddress.pretty(),
            hash: '2BBE2C855D65EAE061CD042A2E38C114B9811A7335C8C489A4B6861F0468E183',
            cosignaturePublicKeys,
            fee: '0.12',
        };

        const formattedTransaction = {
            ...info,
            innerTransactions: [],
        };

        expect(transactionAwaitingSignatureByAccount(formattedTransaction, currentAccount, [])).toBe(false);
    });

    test('shoud be Post-launch Opt-in transaction', async () => {
        const financeBotPublicKey = getFinanceBotPublicKeys(network.type)[0];
        const cosignaturePublicKeys = [randomAccountPublicKey];

        const info = {
            transactionType: TransactionType.AGGREGATE_BONDED,
            status: 'unconfirmed',
            signerAddress: randomAccountAddress.pretty(),
            hash: '2BBE2C855D65EAE061CD042A2E38C114B9811A7335C8C489A4B6861F0468E183',
            cosignaturePublicKeys,
            signTransactionObject: {
                signer: PublicAccount.createFromPublicKey(financeBotPublicKey),
            },
            fee: '0.12',
        };

        const formattedTransaction = {
            ...info,
            innerTransactions: [],
        };

        expect(isPostLaunchOptInTransaction(formattedTransaction, network)).toBe(true);
    });

    test('shoud not be Post-launch Opt-in transaction', async () => {
        const cosignaturePublicKeys = [randomAccountPublicKey];

        const info = {
            transactionType: TransactionType.AGGREGATE_BONDED,
            status: 'unconfirmed',
            signerAddress: randomAccountAddress.pretty(),
            hash: '2BBE2C855D65EAE061CD042A2E38C114B9811A7335C8C489A4B6861F0468E183',
            cosignaturePublicKeys,
            signTransactionObject: {
                signer: PublicAccount.createFromPublicKey(randomAccountPublicKey),
            },
            fee: '0.12',
        };

        const formattedTransaction = {
            ...info,
            innerTransactions: [],
        };

        expect(isPostLaunchOptInTransaction(formattedTransaction, network)).toBe(false);
    });

    test('shoud be outgoing transaction', async () => {
        const recipientAddress = randomAccountAddress;

        const mosaicId = network.networkCurrency.mosaicId;
        const mosaicDivisibility = network.networkCurrency.divisibility;
        const relativeAmount = 10;

        const mosaic = await MosaicService.getMosaicModelFromMosaicId(
            new Mosaic(new MosaicId(mosaicId), UInt64.fromUint(relativeAmount * Math.pow(10, mosaicDivisibility))),
            network
        );

        const formattedTransaction = {
            transactionType: TransactionType.TRANSFER,
            signerAddress: currentAccount.address.pretty(),
            recipientAddress: recipientAddress.pretty(),
            messageText: 'message',
            mosaics: [mosaic],
        };

        expect(isOutgoingTransaction(formattedTransaction, currentAccount.address.pretty())).toBe(true);
    });

    test('shoud not be outgoing transaction', async () => {
        const mosaicId = network.networkCurrency.mosaicId;
        const mosaicDivisibility = network.networkCurrency.divisibility;
        const relativeAmount = 10;

        const mosaic = await MosaicService.getMosaicModelFromMosaicId(
            new Mosaic(new MosaicId(mosaicId), UInt64.fromUint(relativeAmount * Math.pow(10, mosaicDivisibility))),
            network
        );

        const formattedTransaction = {
            transactionType: TransactionType.TRANSFER,
            signerAddress: randomAccountAddress.pretty(),
            recipientAddress: currentAccount.address.pretty(),
            messageText: 'message',
            mosaics: [mosaic],
        };

        expect(isOutgoingTransaction(formattedTransaction, currentAccount.address.pretty())).toBe(false);
    });

    test('shoud return AggregateComplete transaction preview info', async () => {
        const recipientAddress = randomAccountAddress;

        const mosaicId = network.networkCurrency.mosaicId;
        const mosaicDivisibility = network.networkCurrency.divisibility;
        const relativeAmount = 10;

        const mosaic = await MosaicService.getMosaicModelFromMosaicId(
            new Mosaic(new MosaicId(mosaicId), UInt64.fromUint(relativeAmount * Math.pow(10, mosaicDivisibility))),
            network
        );

        const formattedTransferTransaction = {
            transactionType: TransactionType.TRANSFER,
            signerAddress: currentAccount.address.pretty(),
            recipientAddress: recipientAddress.pretty(),
            messageText: 'message',
            mosaics: [mosaic],
        };

        const namespaceName = 'symbol';

        const formattedNamespaceRegistrationTransaction = {
            transactionType: TransactionType.NAMESPACE_REGISTRATION,
            registrationType: Constants.NamespaceRegistrationType[0],
            namespaceName,
            namespaceId: new NamespaceId(namespaceName).toHex(),
            duration: 1,
        };

        const info = {
            transactionType: TransactionType.AGGREGATE_COMPLETE,
            status: 'confirmed',
            signerAddress: currentAccount.address.pretty(),
            hash: '2BBE2C855D65EAE061CD042A2E38C114B9811A7335C8C489A4B6861F0468E183',
            fee: '0.12',
        };

        const formattedTransaction = {
            ...info,
            innerTransactions: [formattedTransferTransaction, formattedNamespaceRegistrationTransaction],
        };

        expect(getAggregateTransactionInfoPreview(formattedTransaction, currentAccount.address.pretty(), network)).toStrictEqual([
            {
                type: TransactionInfoPreviewValueType.AggregateInner,
                value: {
                    txCount: formattedTransaction.innerTransactions.length,
                    txIcons: [`transaction_${TransactionType.TRANSFER}`, `transaction_${TransactionType.NAMESPACE_REGISTRATION}`],
                },
            },
        ]);
    });

    test('shoud return Transfer transaction preview info', async () => {
        const recipientAddress = randomAccountAddress;

        const mosaicId = network.networkCurrency.mosaicId;
        const mosaicDivisibility = network.networkCurrency.divisibility;
        const relativeAmount = 10;

        const mosaic = await MosaicService.getMosaicModelFromMosaicId(
            new Mosaic(new MosaicId(mosaicId), UInt64.fromUint(relativeAmount * Math.pow(10, mosaicDivisibility))),
            network
        );

        const formattedTransaction = {
            transactionType: TransactionType.TRANSFER,
            signerAddress: currentAccount.address.pretty(),
            recipientAddress: recipientAddress.pretty(),
            messageText: 'message',
            mosaics: [mosaic],
        };

        expect(getTransferTransactionInfoPreview(formattedTransaction, currentAccount.address.pretty(), network)).toStrictEqual([
            {
                type: TransactionInfoPreviewValueType.AmountOutgoing,
                value: relativeAmount,
            },
            {
                type: TransactionInfoPreviewValueType.HasMessage,
            },
        ]);
    });

    test('shoud return NamespaceRegistration transaction preview info', async () => {
        const namespaceName = 'symbol';

        const formattedTransaction = {
            transactionType: TransactionType.NAMESPACE_REGISTRATION,
            registrationType: Constants.NamespaceRegistrationType[0],
            namespaceName,
            namespaceId: new NamespaceId(namespaceName).toHex(),
            duration: 1,
        };

        expect(getNamespaceTransactionInfoPreview(formattedTransaction)).toStrictEqual([
            {
                type: TransactionInfoPreviewValueType.Other,
                value: namespaceName,
            },
        ]);
    });

    test('shoud return HashLock transaction preview info', async () => {
        const mosaicId = network.networkCurrency.mosaicId;
        const mosaicDivisibility = network.networkCurrency.divisibility;
        const relativeAmount = 10;

        const mosaic = await MosaicService.getMosaicModelFromMosaicId(
            new Mosaic(new MosaicId(mosaicId), UInt64.fromUint(relativeAmount * Math.pow(10, mosaicDivisibility))),
            network
        );

        const formattedTransaction = {
            transactionType: TransactionType.HASH_LOCK,
            duration: 1000,
            mosaics: [mosaic],
            hash: '2BBE2C855D65EAE061CD042A2E38C114B9811A7335C8C489A4B6861F0468E183',
        };

        expect(getHashLockTransactionInfoPreview(formattedTransaction, network)).toStrictEqual([
            {
                type: TransactionInfoPreviewValueType.Other,
                value: relativeAmount,
            },
        ]);
    });
});
