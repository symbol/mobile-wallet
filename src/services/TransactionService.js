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
} from 'symbol-sdk';
import type { NetworkModel } from '@src/storage/models/NetworkModel';

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
                this._signAndBroadcastTransferTransactionModel(transaction, signer, networkModel);
                break;
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
    static _signAndBroadcastTransferTransactionModel(transaction: TransferTransactionModel, signer: AccountModel, networkModel: NetworkModel) {
        const recipientAddress = Address.createFromRawAddress(transaction.recipientAddress);
        const networkType = networkModel.type === 'testnet' ? NetworkType.TEST_NET : NetworkType.MAIN_NET;
        const mosaics = [
            new Mosaic(
                new MosaicId(transaction.mosaics[0].mosaicId),
                UInt64.fromUint(transaction.mosaics[0].amount * Math.pow(10, transaction.mosaics[0].divisibility))
            ),
        ];
        const message = PlainMessage.create(transaction.messageText);
        const fee = this._resolveFee(transaction.fee);
        const transferTransaction = TransferTransaction.create(Deadline.create(), recipientAddress, mosaics, message, networkType, fee);
        return this._signAndBroadcast(transferTransaction, signer, networkModel);
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
}
