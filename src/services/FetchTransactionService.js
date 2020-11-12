import {
    Address,
    TransactionHttp,
    TransactionGroup,
    Transaction,
    TransferTransaction,
    Mosaic,
    MosaicHttp,
    NamespaceHttp,
    LockFundsTransaction,
    AggregateTransaction,
} from 'symbol-sdk';
import type { AccountOriginType } from '@src/storage/models/AccountModel';
import type { NetworkModel } from '@src/storage/models/NetworkModel';
import type { AggregateTransactionModel, TransactionModel, TransferTransactionModel } from '@src/storage/models/TransactionModel';
import { formatTransactionLocalDateTime } from '@src/utils/format';
import type { MosaicModel } from '@src/storage/models/MosaicModel';
import FundsLockTransaction from '@src/components/organisms/transaction/FundsLockTransaction';

export default class FetchTransactionService {
    /**
     * Gets MosaicModel from a Mosaic
     * @param mosaic
     * @param network
     * @return {Promise<{amount: string, mosaicId: string, mosaicName: *, divisibility: *}>}
     * @private
     */
    static async _getMosaicModelFromMosaicId(mosaic: Mosaic, network: NetworkModel): Promise<MosaicModel> {
        let mosaicInfo = {},
            mosaicName = {};
        try {
            mosaicInfo = await new MosaicHttp(network.node).getMosaic(mosaic.id).toPromise();
            [mosaicName] = await new NamespaceHttp(network.node).getMosaicsNames([mosaic.id]).toPromise();
        } catch (e) {
            console.log(e);
        }
        return {
            mosaicId: mosaic.id.toHex(),
            mosaicName: mosaicName.names[0].name,
            amount: mosaic.amount.toString(),
            divisibility: mosaicInfo.divisibility,
        };
    }

    /**
     * Returns balance from a given Address and a node
     * @param rawAddresses
     * @param network
     * @returns {Promise<number>}
     */
    static async getTransactionsFromAddresses(rawAddresses: string[], network: NetworkModel): Promise<any> {
        const allTransactionsPerAddress = await Promise.all(rawAddresses.map(address => this.getTransactionsFromAddress(address, network)));
        return allTransactionsPerAddress.reduce((acc, txList, i) => {
            acc[rawAddresses[i]] = txList;
            return acc;
        }, {});
    }

    /**
     * Returns balance from a given Address and a node
     * @param rawAddress
     * @param network
     * @returns {Promise<number>}
     */
    static async getTransactionsFromAddress(rawAddress: string, network: NetworkModel): Promise<TransactionModel[]> {
        const transactionHttp = new TransactionHttp(network.node);
        const address = Address.createFromRawAddress(rawAddress);
        const confirmedSearchCriteria = { group: TransactionGroup.Confirmed, address, pageNumber: 1, pageSize: 25 };
        const partialSearchCriteria = { group: TransactionGroup.Partial, address, pageNumber: 1, pageSize: 25 };
        const unconfirmedSearchCriteria = { group: TransactionGroup.Unconfirmed, address, pageNumber: 1, pageSize: 25 };
        const [confirmedTransactions, partialTransactions, unconfirmedTransactions] = await Promise.all([
            transactionHttp.search(confirmedSearchCriteria).toPromise(),
            transactionHttp.search(partialSearchCriteria).toPromise(),
            transactionHttp.search(unconfirmedSearchCriteria).toPromise(),
        ]);
        const allTransactions = [...unconfirmedTransactions.data, ...partialTransactions.data, ...confirmedTransactions.data.reverse()];
        const preLoadedMosaics = await this._preLoadMosaics(allTransactions, network);
        return Promise.all(allTransactions.map(tx => this.symbolTransactionToTransactionModel(tx, network, preLoadedMosaics)));
    }

    /**
     * Pre loads all mosaics from transaction list
     * @param transactions
     * @param network
     * @returns {Promise<$TupleMap<Promise<MosaicModel>[]>>}
     * @private
     */
    static async _preLoadMosaics(transactions: Transaction[], network: NetworkModel) {
        const mosaics = {};
        for (let transaction of transactions) {
            if (transaction instanceof TransferTransaction) {
                for (let mosaic of transaction.mosaics) {
                    mosaics[mosaic.id.toHex()] = mosaic;
                }
            }
        }
        const mosaicModels = await Promise.all(Object.values(mosaics).map(mosaic => this._getMosaicModelFromMosaicId(mosaic, network)));
        return mosaicModels.reduce((acc, mosaicModel) => {
            acc[mosaicModel.mosaicId] = mosaicModel;
            return acc;
        }, {});
    }

    /**
     * Transform a symbol account to an account Model
     * @returns {{privateKey: string, name: string, id: string, type: AccountOriginType}}
     * @param transaction
     * @param network
     * @param preLoadedMosaics
     */
    static async symbolTransactionToTransactionModel(transaction: Transaction, network: NetworkModel, preLoadedMosaics): Promise<TransactionModel> {
        let transactionModel: TransactionModel = {
            status: transaction.isConfirmed() ? 'confirmed' : 'unconfirmed',
            signerAddress: transaction.signer.address.pretty(),
            deadline: formatTransactionLocalDateTime(transaction.deadline.value),
            hash: transaction.transactionInfo.hash,
            fee: transaction.maxFee.toString(),
        };
        if (transaction instanceof TransferTransaction) {
            transactionModel = await this._populateTransferTransactionModel(transactionModel, transaction, network, preLoadedMosaics);
        } else if (transaction instanceof LockFundsTransaction) {
            transactionModel = await this._populateFundsLockTransactionModel(transactionModel, transaction, network, preLoadedMosaics);
        } else if (transaction instanceof AggregateTransaction) {
            transactionModel = await this._populateAggregateTransactionModel(transactionModel, transaction, network);
        }
        return transactionModel;
    }

    /**
     * Populates transfer transaction Model
     * @param transactionModel
     * @param transaction
     * @param network
     * @param preLoadedMosaics
     * @returns {Promise<void>}
     * @private
     */
    static async _populateTransferTransactionModel(
        transactionModel: TransactionModel,
        transaction: TransferTransaction,
        network: NetworkModel,
        preLoadedMosaics?
    ): Promise<TransferTransactionModel> {
        const mosaicModels: MosaicModel[] = [];
        for (let mosaic of transaction.mosaics) {
            let mosaicModel;
            if (preLoadedMosaics && preLoadedMosaics[mosaic.id.toHex()]) {
                mosaicModel = {
                    ...preLoadedMosaics[mosaic.id.toHex()],
                    amount: mosaic.amount.toString(),
                };
            } else {
                mosaicModel = await this._getMosaicModelFromMosaicId(mosaic, network);
            }
            mosaicModels.push(mosaicModel);
        }
        return {
            ...transactionModel,
            type: 'transfer',
            recipientAddress: transaction.recipientAddress.pretty(),
            messageText: transaction.message.payload,
            messageEncrypted: transaction.message.type,
            mosaics: mosaicModels,
        };
    }

    /**
     * Populates funds lock Model
     * @param transactionModel
     * @param transaction
     * @param network
     * @param preLoadedMosaics
     * @returns {Promise<void>}
     * @private
     */
    static async _populateFundsLockTransactionModel(
        transactionModel: TransactionModel,
        transaction: LockFundsTransaction,
        network: NetworkModel,
        preLoadedMosaics?
    ): Promise<FundsLockTransaction> {
        let mosaicModel;
        if (preLoadedMosaics && preLoadedMosaics[transaction.mosaic.id.toHex()]) {
            mosaicModel = preLoadedMosaics[transaction.mosaic.id.toHex()];
            mosaicModel = {
                ...preLoadedMosaics[transaction.mosaic.id.toHex()],
                amount: transaction.mosaic.amount.toString(),
            };
        } else {
            mosaicModel = await this._getMosaicModelFromMosaicId(transaction.mosaic, network);
        }
        return {
            ...transactionModel,
            type: 'fundsLock',
            mosaic: mosaicModel,
            duration: transaction.duration.compact(),
            aggregateHash: transaction.hash,
        };
    }

    /**
     * Populates aggregate transaction Model
     * @param transactionModel
     * @param transaction
     * @param network
     * @returns {Promise<void>}
     * @private
     */
    static async _populateAggregateTransactionModel(
        transactionModel: TransactionModel,
        transaction: AggregateTransaction,
        network: NetworkModel
    ): Promise<AggregateTransactionModel> {
        const transactionHttp = new TransactionHttp(network.node);
        const fullTransactionData = await transactionHttp
            .getTransaction(transaction.transactionInfo.id, transaction.isConfirmed() ? TransactionGroup.Confirmed : TransactionGroup.Partial)
            .toPromise();
        const innerTransactionModels = await Promise.all(
            fullTransactionData.innerTransactions.map(innerTx => this.symbolTransactionToTransactionModel(innerTx, network))
        );
        const cosignaturePublicKeys = transaction.cosignatures.map(cosignature => cosignature.signer.publicKey);
        if (transaction.signer) {
            cosignaturePublicKeys.push(transaction.signer.publicKey);
        }
        return {
            ...transactionModel,
            type: 'aggregate',
            innerTransactions: innerTransactionModels,
            cosignaturePublicKeys: cosignaturePublicKeys,
            signTransactionObject: transaction,
        };
    }

    /**
     * Checks if transactions need publicKey signature
     * @param publicKey
     * @param transactions
     * @returns {boolean}
     */
    static checkIfTransactionsNeedsSignature(publicKey: string, transactions: TransactionModel[]): boolean {
        return !!transactions.find(tx => tx.type === 'aggregate' && tx.status === 'unconfirmed' && tx.cosignaturePublicKeys.indexOf(publicKey) === -1);
    }
}
