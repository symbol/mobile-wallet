import {
    AccountHttp,
    Address,
    Order,
    Transaction,
    TransactionGroup,
    TransactionHttp,
    TransactionType,
    TransferTransaction,
} from 'symbol-sdk';
import MosaicService from '@src/services/MosaicService';
import { FormatTransaction } from '@src/services/FormatTransaction';
import type { NetworkModel } from '@src/storage/models/NetworkModel';
import type { TransactionModel } from '@src/storage/models/TransactionModel';
import type { MosaicModel } from '@src/storage/models/MosaicModel';
import type { Filter } from '@src/store/transaction';

export default class FetchTransactionService {
    /**
     * Returns balance from a given Address and a node
     * @param rawAddress
     * @param page
     * @param filter
     * @param network
     * @returns {Promise<number>}
     */
    static async getTransactionsFromAddress(
        rawAddress: string,
        page: number,
        filter: Filter,
        network: NetworkModel,
        cosignatoryOf: []
    ): Promise<TransactionModel[]> {
        const transactionHttp = new TransactionHttp(network.node);
        const address = Address.createFromRawAddress(rawAddress);
        const baseSearchCriteria = { pageNumber: page, order: Order.Desc };
        if (filter === 'SENT') {
            // FIXME: Workaround with bad performance
            const accountHttp = new AccountHttp(network.node);
            let accountInfo;
            try {
                accountInfo = await accountHttp.getAccountInfo(address).toPromise();
                baseSearchCriteria.signerPublicKey = accountInfo.publicKey;
            } catch {
                return [];
            }
        } else if (filter === 'RECEIVED') {
            baseSearchCriteria.recipientAddress = address;
        } else {
            baseSearchCriteria.address = address;
        }

        const confirmedSearchCriteria = {
            ...baseSearchCriteria,
            group: TransactionGroup.Confirmed,
            pageSize: 15,
        };
        const partialSearchCriteria = {
            ...baseSearchCriteria,
            group: TransactionGroup.Partial,
            pageSize: 100,
        };
        const unconfirmedSearchCriteria = {
            ...baseSearchCriteria,
            group: TransactionGroup.Unconfirmed,
            pageSize: 100,
        };
        let allTransactions;
        if (page === 1) {
            const [confirmedTransactions, partialTransactions, unconfirmedTransactions] = await Promise.all([
                transactionHttp.search(confirmedSearchCriteria).toPromise(),
                transactionHttp.search(partialSearchCriteria).toPromise(),
                transactionHttp.search(unconfirmedSearchCriteria).toPromise(),
            ]);

            let multisigPartialSearchCriteria = partialSearchCriteria;
            for (const cosigner of cosignatoryOf) {
                multisigPartialSearchCriteria.address = Address.createFromRawAddress(cosigner);
                const multisigTransactions = await transactionHttp.search(multisigPartialSearchCriteria).toPromise();
                for (const transaction of multisigTransactions.data) {
                    if (!partialTransactions.data.some(tx => transaction.transactionInfo.hash === tx.transactionInfo.hash)) {
                        partialTransactions.data.push(transaction);
                    }
                }
            }

            allTransactions = [...partialTransactions.data, ...unconfirmedTransactions.data, ...confirmedTransactions.data];
        } else {
            const confirmedTxs = await transactionHttp.search(confirmedSearchCriteria).toPromise();
            allTransactions = confirmedTxs.data;
        }
        const preLoadedMosaics = await this._preLoadMosaics(allTransactions, network);

        return Promise.all(
            allTransactions.map(async transaction => {
                if (transaction.type !== TransactionType.AGGREGATE_BONDED && transaction.type !== TransactionType.AGGREGATE_COMPLETE) {
                    return FormatTransaction.format(transaction, network, preLoadedMosaics);
                }

                const transactionGroup = transaction.isConfirmed()
                    ? TransactionGroup.Confirmed
                    : transaction.isUnconfirmed()
                    ? TransactionGroup.Unconfirmed
                    : TransactionGroup.Partial;
                const aggregateTransactionDetails = await transactionHttp
                    .getTransaction(transaction.transactionInfo.id, transactionGroup)
                    .toPromise();

                return FormatTransaction.format(aggregateTransactionDetails, network, preLoadedMosaics);
            })
        );
    }

    /**
     * Pre loads all mosaics from transaction list
     * @param transactions
     * @param network
     * @returns {Promise<$TupleMap<Promise<MosaicModel>[]>>}
     * @private
     */
    static async _preLoadMosaics(transactions: Transaction[], network: NetworkModel): Promise<MosaicModel[]> {
        const mosaics = {};
        for (let transaction of transactions) {
            if (transaction instanceof TransferTransaction) {
                for (let mosaic of transaction.mosaics) {
                    mosaics[mosaic.id.toHex()] = mosaic;
                }
            }
        }
        const mosaicModels = await Promise.all(
            Object.values(mosaics).map(mosaic => MosaicService.getMosaicModelFromMosaicId(mosaic, network))
        );
        return mosaicModels.reduce((acc, mosaicModel) => {
            acc[mosaicModel.mosaicId] = mosaicModel;
            return acc;
        }, {});
    }
}
