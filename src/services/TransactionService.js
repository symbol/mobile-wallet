import type { AccountModel } from '@src/storage/models/AccountModel';
import type { AggregateTransactionModel, TransactionModel, TransferTransactionModel } from '@src/storage/models/TransactionModel';
import {
    Account,
    Address,
    CosignatureTransaction,
    Deadline,
    Mosaic,
    MosaicId,
    NetworkType,
    PlainMessage,
    Transaction,
    TransactionHttp,
    TransferTransaction,
    UInt64,
    RepositoryFactoryHttp,
    TransactionGroup,
    PublicAccount,
    Message,
    EncryptedMessage,
} from 'symbol-sdk';
import type { NetworkModel } from '@src/storage/models/NetworkModel';
import { TransactionQR } from 'symbol-qr-library';
import NetworkService from '@src/services/NetworkService';

export default class TransactionService {
    /**
     * Signs and broadcasts a transaction model
     * @param transaction
     * @param signer
     * @param networkModel
     * @param extraParams
     */
    static signAndBroadcastTransactionModel(transaction: TransactionModel, signer: AccountModel, networkModel: NetworkModel, ...extraParams) {
        switch (transaction.type) {
            case 'transfer':
                return this._signAndBroadcastTransferTransactionModel(transaction, signer, networkModel);
            default:
                console.error('Not yet implemented');
        }
    }

    /**
     * Signs and broadcasts transfer transaction model
     * @param transaction
     * @param signer
     * @param networkModel
     * @private
     */
    static async _signAndBroadcastTransferTransactionModel(transaction: TransferTransactionModel, signer: AccountModel, networkModel: NetworkModel) {
        const recipientAddress = Address.createFromRawAddress(transaction.recipientAddress);
        const networkType = networkModel.type === 'testnet' ? NetworkType.TEST_NET : NetworkType.MAIN_NET;
        const mosaics = [
            new Mosaic(
                new MosaicId(transaction.mosaics[0].mosaicId),
                UInt64.fromUint(transaction.mosaics[0].amount * Math.pow(10, transaction.mosaics[0].divisibility))
            ),
        ];
        const fee = this._resolveFee(transaction.fee);
        if (!transaction.messageEncrypted) {
            const message = PlainMessage.create(transaction.messageText);
            const transferTransaction = TransferTransaction.create(Deadline.create(), recipientAddress, mosaics, message, networkType, fee);
            return this._signAndBroadcast(transferTransaction, signer, networkModel);
        } else {
            const signerAccount = Account.createFromPrivateKey(signer.privateKey, networkType);
            const repositoryFactory = await new RepositoryFactoryHttp(networkModel.node);
            const accountHttp = repositoryFactory.createAccountRepository();
            try {
                const accountInfo = await accountHttp.getAccountInfo(recipientAddress).toPromise();
                const message = signerAccount.encryptMessage(transaction.messageText, accountInfo);
                const transferTransaction = TransferTransaction.create(Deadline.create(), recipientAddress, mosaics, message, networkType, fee);
                return this._signAndBroadcast(transferTransaction, signer, networkModel);
            } catch (e) {
                throw Error('Recipient address has not a public key');
            }
        }
    }

    /**
     * Sign and broadcast transaction
     * @returns {UInt64}
     * @param transaction
     * @param signer
     * @param network
     */
    static _signAndBroadcast = (transaction: Transaction, signer: AccountModel, network: NetworkModel) => {
        const networkType = network.type === 'testnet' ? NetworkType.TEST_NET : NetworkType.MAIN_NET;
        const signerAccount = Account.createFromPrivateKey(signer.privateKey, networkType);
        const signedTransaction = signerAccount.sign(transaction, network.generationHash);

        const transactionHttp = new TransactionHttp(network.node);
        return transactionHttp.announce(signedTransaction).toPromise();
    };

    /**
     * Cosign and broadcast aggregate transactionModel
     * @param transaction
     * @param signer
     * @param network
     */
    static cosignAndBroadcastAggregateTransactionModel(transaction: AggregateTransactionModel, signer: AccountModel, network: NetworkModel) {
        const cosignatureTransaction = CosignatureTransaction.create(transaction.signTransactionObject);
        const networkType = network.type === 'testnet' ? NetworkType.TEST_NET : NetworkType.MAIN_NET;
        const signerAccount = Account.createFromPrivateKey(signer.privateKey, networkType);
        const signedTransaction = signerAccount.signCosignatureTransaction(cosignatureTransaction);

        const transactionHttp = new TransactionHttp(network.node);
        return transactionHttp.announceAggregateBondedCosignature(signedTransaction).toPromise();
    }

    /**
     * Calculates fee
     * @param unresolvedFee
     * @returns {UInt64}
     */
    static _resolveFee = unresolvedFee => {
        const networkCurrencyDivisibility = 6; // replace
        const k = Math.pow(10, networkCurrencyDivisibility);
        return UInt64.fromUint(unresolvedFee * k);
    };

    /**
     * Receive QR Data
     * @param recipientAddress
     * @param network
     * @param message
     * @returns {Promise<void>}
     */
    static getReceiveSvgQRData = async (recipientAddress, network, message) => {
        const netwrokType = network.type === 'testnet' ? NetworkType.TEST_NET : NetworkType.MAIN_NET;
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress(recipientAddress),
            [new Mosaic(new MosaicId(network.currencyMosaicId), UInt64.fromUint(10 * Math.pow(10, 6)))],
            PlainMessage.create(message),
            netwrokType,
            UInt64.fromUint(2000000)
        );
        const txQR = new TransactionQR(transferTransaction, netwrokType, network.generationHash);
        return txQR.toBase64().toPromise();
    };

    /**
     * Decrypt message
     * @param recipientAccount
     * @param network
     * @param transaction
     * @returns {Promise<void>}
     */
    static decryptMessage = async (recipientAccount: AccountModel, network: NetworkModel, transaction: TransferTransactionModel) => {
        try {
            const networkType = NetworkService.getNetworkTypeFromModel(network);
            const account = Account.createFromPrivateKey(recipientAccount.privateKey, networkType);
            const signerAddress = Address.createFromRawAddress(transaction.signerAddress);
            const repositoryFactory = new RepositoryFactoryHttp(network.node);
            const accountHttp = repositoryFactory.createAccountRepository();
            const transactionHttp = repositoryFactory.createTransactionRepository();
            const accountInfo = await accountHttp.getAccountInfo(signerAddress).toPromise();
            const alicePublicAccount = PublicAccount.createFromPublicKey(accountInfo.publicKey, networkType);
            const transactionHash = transaction.hash;
            const tx = await transactionHttp.getTransaction(transactionHash, TransactionGroup.Confirmed).toPromise();
            if (tx.message.type === 1) {
                return account.decryptMessage(tx.message, alicePublicAccount).payload;
            } else {
                console.log(tx.message);
                return '';
            }
        } catch (e) {
            console.log(e);
            return '';
        }
    };
}
