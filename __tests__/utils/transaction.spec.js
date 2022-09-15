import { AliasAction, LinkAction, PublicAccount, TransactionType } from 'symbol-sdk';
import {
    getAggregateTransactionInfoPreview,
    getHashLockTransactionInfoPreview,
    getNamespaceTransactionInfoPreview,
    getTransferTransactionInfoPreview,
    isOutgoingTransaction,
    isPostLaunchOptInTransaction,
    isUnlinkActionTransaction,
    transactionAwaitingSignatureByAccount,
} from '@src/utils/transaction';
import { TransactionInfoPreviewValueType } from '@src/storage/models/TransactionInfoPreviewModel';
import { Constants } from '@src/config/constants';
import { getFinanceBotPublicKeys } from '@src/config/environment';
import { account1, account2, currencyMosaicModelAmount10, namespace1, network } from '../../__mocks__';

describe('transaction utils tests', () => {
    const currentAccount = account1;

    const fee = 0.12;
    const statusUnconfirmed = 'unconfirmed';
    const statusConfirmed = 'confirmed';
    const hash = '2BBE2C855D65EAE061CD042A2E38C114B9811A7335C8C489A4B6861F0468E183';
    const messageText = 'message';

    const relativeAmount = 10;
    const mosaic = currencyMosaicModelAmount10;

    test('transaction should await signature by current account', () => {
        const cosignaturePublicKeys = [account2.publicKey];

        const formattedTransaction = {
            transactionType: TransactionType.AGGREGATE_BONDED,
            status: statusUnconfirmed,
            signerAddress: account2.address.plain(),
            hash,
            cosignaturePublicKeys,
            fee,
            innerTransactions: [],
        };

        expect(transactionAwaitingSignatureByAccount(formattedTransaction, currentAccount, [])).toBe(true);
    });

    test('transaction should not await signature by current account', () => {
        const cosignaturePublicKeys = [currentAccount.publicKey, account2.publicKey];

        const formattedTransaction = {
            transactionType: TransactionType.AGGREGATE_BONDED,
            status: statusUnconfirmed,
            signerAddress: account2.address.plain(),
            hash,
            cosignaturePublicKeys,
            fee,
            innerTransactions: [],
        };

        expect(transactionAwaitingSignatureByAccount(formattedTransaction, currentAccount, [])).toBe(false);
    });

    test('shoud be Post-launch Opt-in transaction', () => {
        const financeBotPublicKey = getFinanceBotPublicKeys(network.type)[0];

        const formattedTransaction = {
            transactionType: TransactionType.AGGREGATE_BONDED,
            status: statusUnconfirmed,
            hash,
            cosignaturePublicKeys: [],
            signTransactionObject: {
                signer: PublicAccount.createFromPublicKey(financeBotPublicKey),
            },
            fee,
            innerTransactions: [],
        };

        expect(isPostLaunchOptInTransaction(formattedTransaction, network)).toBe(true);
    });

    test('shoud not be Post-launch Opt-in transaction', () => {
        const formattedTransaction = {
            transactionType: TransactionType.AGGREGATE_BONDED,
            status: statusUnconfirmed,
            hash,
            cosignaturePublicKeys: [],
            signTransactionObject: {
                signer: account2,
            },
            fee,
            innerTransactions: [],
        };

        expect(isPostLaunchOptInTransaction(formattedTransaction, network)).toBe(false);
    });

    test('shoud be outgoing transaction', () => {
        const signerAddress = currentAccount.address.plain();
        const recipientAddress = account2.address.plain();

        const formattedTransaction = {
            transactionType: TransactionType.TRANSFER,
            signerAddress,
            recipientAddress,
            messageText,
            mosaics: [mosaic],
        };

        expect(isOutgoingTransaction(formattedTransaction, currentAccount.address.plain())).toBe(true);
    });

    test('shoud not be outgoing transaction', () => {
        const signerAddress = account2.address.plain();
        const recipientAddress = currentAccount.address.plain();

        const formattedTransaction = {
            transactionType: TransactionType.TRANSFER,
            signerAddress,
            recipientAddress,
            messageText,
            mosaics: [mosaic],
        };

        expect(isOutgoingTransaction(formattedTransaction, currentAccount.address.plain())).toBe(false);
    });

    test('shoud be transaction with unlink LinkAction', () => {
        const formattedTransaction = {
            transactionType: TransactionType.VRF_KEY_LINK,
            signerAddress: currentAccount.address.plain(),
            linkAction: Constants.LinkAction[LinkAction.Unlink],
            linkedPublicKey: account2.publicKey,
            linkedAccountAddress: account2.address.plain(),
        };

        expect(isUnlinkActionTransaction(formattedTransaction)).toBe(true);
    });

    test('shoud be transaction with unlink AliasAction', () => {
        const formattedTransaction = {
            transactionType: TransactionType.ADDRESS_ALIAS,
            signerAddress: currentAccount.address.plain(),
            aliasAction: Constants.AliasAction[AliasAction.Unlink],
            namespaceName: namespace1.name,
            namespaceId: namespace1.namespaceId,
            address: account2.address.plain(),
        };

        expect(isUnlinkActionTransaction(formattedTransaction)).toBe(true);
    });

    test('shoud not be transaction with unlink action', () => {
        const formattedKeyLinkTransaction = {
            transactionType: TransactionType.VRF_KEY_LINK,
            signerAddress: currentAccount.address.plain(),
            linkAction: Constants.LinkAction[LinkAction.Link],
            linkedPublicKey: account2.publicKey,
            linkedAccountAddress: account2.address.plain(),
        };

        const formattedAddressAliasTransaction = {
            transactionType: TransactionType.ADDRESS_ALIAS,
            signerAddress: currentAccount.address.plain(),
            aliasAction: Constants.AliasAction[AliasAction.Link],
            namespaceName: namespace1.name,
            namespaceId: namespace1.namespaceId,
            address: account2.address.plain(),
        };

        const formattedTransferTransaction = {
            transactionType: TransactionType.TRANSFER,
            signerAddress: currentAccount.address.plain(),
            recipientAddress: account2.address.plain(),
            messageText,
            mosaics: [mosaic],
        };

        expect(isUnlinkActionTransaction(formattedKeyLinkTransaction)).toBe(false);
        expect(isUnlinkActionTransaction(formattedAddressAliasTransaction)).toBe(false);
        expect(isUnlinkActionTransaction(formattedTransferTransaction)).toBe(false);
    });

    test('shoud return AggregateComplete transaction preview info', () => {
        const formattedTransferTransaction = {
            transactionType: TransactionType.TRANSFER,
            signerAddress: currentAccount.address.plain(),
            recipientAddress: account2.address.plain(),
            messageText,
            mosaics: [mosaic],
        };

        const formattedNamespaceRegistrationTransaction = {
            transactionType: TransactionType.NAMESPACE_REGISTRATION,
            registrationType: Constants.NamespaceRegistrationType[0],
            namespaceName: namespace1.name,
            namespaceId: namespace1.namespaceId,
            duration: 1,
        };

        const formattedTransaction = {
            transactionType: TransactionType.AGGREGATE_COMPLETE,
            status: statusConfirmed,
            signerAddress: currentAccount.address.plain(),
            hash,
            fee,
            innerTransactions: [formattedTransferTransaction, formattedNamespaceRegistrationTransaction],
        };

        expect(getAggregateTransactionInfoPreview(formattedTransaction, currentAccount.address.plain(), network)).toStrictEqual([
            {
                type: TransactionInfoPreviewValueType.AggregateInner,
                value: {
                    txCount: formattedTransaction.innerTransactions.length,
                    txIcons: [`transaction_${TransactionType.TRANSFER}`, `transaction_${TransactionType.NAMESPACE_REGISTRATION}`],
                },
            },
        ]);
    });

    test('shoud return Transfer transaction preview info', () => {
        const formattedTransaction = {
            transactionType: TransactionType.TRANSFER,
            signerAddress: currentAccount.address.plain(),
            recipientAddress: account2.address.plain(),
            messageText,
            mosaics: [mosaic],
        };

        expect(getTransferTransactionInfoPreview(formattedTransaction, currentAccount.address.plain(), network)).toStrictEqual([
            {
                type: TransactionInfoPreviewValueType.AmountOutgoing,
                value: relativeAmount,
            },
            {
                type: TransactionInfoPreviewValueType.HasMessage,
            },
        ]);
    });

    test('shoud return NamespaceRegistration transaction preview info', () => {
        const formattedTransaction = {
            transactionType: TransactionType.NAMESPACE_REGISTRATION,
            signerAddress: currentAccount.address.plain(),
            registrationType: Constants.NamespaceRegistrationType[0],
            namespaceName: namespace1.name,
            namespaceId: namespace1.namespaceId,
            duration: 1,
        };

        expect(getNamespaceTransactionInfoPreview(formattedTransaction)).toStrictEqual([
            {
                type: TransactionInfoPreviewValueType.Other,
                value: namespace1.name,
            },
        ]);
    });

    test('shoud return HashLock transaction preview info', () => {
        const formattedTransaction = {
            transactionType: TransactionType.HASH_LOCK,
            signerAddress: currentAccount.address.plain(),
            duration: 1000,
            mosaics: [mosaic],
            hash,
        };

        expect(getHashLockTransactionInfoPreview(formattedTransaction, network)).toStrictEqual([
            {
                type: TransactionInfoPreviewValueType.Other,
                value: relativeAmount,
            },
        ]);
    });
});
