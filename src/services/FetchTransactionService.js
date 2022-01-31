import {
    Address,
    TransactionHttp,
    TransactionGroup,
    Transaction,
    TransferTransaction,
    LockFundsTransaction,
    AggregateTransaction,
    NamespaceRegistrationTransaction,
    MosaicAliasTransaction,
    Page,
    RepositoryFactory,
    NamespaceHttp,
    Order,
    AccountHttp,
    PublicAccount,
    RepositoryFactoryHttp,
} from 'symbol-sdk';
import type { AccountOriginType } from '@src/storage/models/AccountModel';
import type { NetworkModel } from '@src/storage/models/NetworkModel';
import type {
    AggregateTransactionModel,
    TransactionModel,
    TransferTransactionModel,
    NamespaceRegistrationTransactionModel,
    MosaicAliasTransactionModel,
} from '@src/storage/models/TransactionModel';
import { formatTransactionLocalDateTime } from '@src/utils/format';
import type { MosaicModel } from '@src/storage/models/MosaicModel';
import FundsLockTransaction from '@src/components/organisms/transaction/FundsLockTransaction';
import MosaicService from '@src/services/MosaicService';
import type { DirectionFilter } from '@src/store/transaction';
import { Observable } from 'rxjs';
import NetworkService from '@src/services/NetworkService';
import { getPublicKeyFromPrivateKey } from '@src/utils/account';

export default class FetchTransactionService {
    /**
     * Check for pending signatures
     * @param address
     * @param network
     * @returns {Promise<void>}
     */
    static async hasAddressPendingSignatures(address: string, network: NetworkModel) {
        const transactionHttp = new TransactionHttp(network.node);
        // FIXME: Workaround with bad performance
        const accountHttp = new AccountHttp(network.node);
        let accountInfo;
        try {
            accountInfo = await accountHttp.getAccountInfo(Address.createFromRawAddress(address)).toPromise();
        } catch {
            return false;
        }
        if (!accountInfo.publicKey) return false;
        const publicAccount = PublicAccount.createFromPublicKey(accountInfo.publicKey, NetworkService.getNetworkTypeFromModel(network));
        const transactionsData = await transactionHttp
            .search({ pageNumber: 1, pageSize: 100, group: TransactionGroup.Partial, address: publicAccount.address })
            .toPromise();
        for (let transaction: Transaction of transactionsData.data) {
            if (transaction instanceof AggregateTransaction) {
                const txModel = await this._populateAggregateTransactionModel({}, transaction, network);
                if (txModel.cosignaturePublicKeys.indexOf(publicAccount.publicKey) === -1 && txModel.status !== 'confirmed') {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Returns balance from a given Address and a node
     * @param rawAddress
     * @param page
     * @param directionFilter
     * @param network
     * @returns {Promise<number>}
     */
    static async getTransactionsFromAddress(
        rawAddress: string,
        page: number,
        directionFilter: DirectionFilter,
        network: NetworkModel,
        cosignatoryOf: []
    ): Promise<TransactionModel[]> {
        const transactionHttp = new TransactionHttp(network.node);
        const address = Address.createFromRawAddress(rawAddress);
        const baseSearchCriteria = { pageNumber: page, order: Order.Desc };
        if (directionFilter === 'SENT') {
            // FIXME: Workaround with bad performance
            const accountHttp = new AccountHttp(network.node);
            let accountInfo;
            try {
                accountInfo = await accountHttp.getAccountInfo(address).toPromise();
                baseSearchCriteria.signerPublicKey = accountInfo.publicKey;
            } catch {
                return [];
            }
        } else if (directionFilter === 'RECEIVED') {
            baseSearchCriteria.recipientAddress = address;
        } else {
            baseSearchCriteria.address = address;
        }

        const confirmedSearchCriteria = { ...baseSearchCriteria, group: TransactionGroup.Confirmed, pageSize: 25 };
        const partialSearchCriteria = { ...baseSearchCriteria, group: TransactionGroup.Partial, pageSize: 100 };
        const unconfirmedSearchCriteria = { ...baseSearchCriteria, group: TransactionGroup.Unconfirmed, pageSize: 100 };
        let allTransactions;
        if (page === 1) {
            const [confirmedTransactions, partialTransactions, unconfirmedTransactions] = await Promise.all([
                transactionHttp.search(confirmedSearchCriteria).toPromise(),
                transactionHttp.search(partialSearchCriteria).toPromise(),
                transactionHttp.search(unconfirmedSearchCriteria).toPromise(),
            ]);

            let multisigPartialSearchCriteria = partialSearchCriteria;
            for(const cosigner of cosignatoryOf){
                multisigPartialSearchCriteria.address = Address.createFromRawAddress(cosigner);
                const multisigTransactions =  await transactionHttp.search(multisigPartialSearchCriteria).toPromise();
                for(const transaction of multisigTransactions.data){
                    if(!partialTransactions.data.some((tx)=>transaction.transactionInfo.hash ===  tx.transactionInfo.hash)){
                        partialTransactions.data.push(transaction);
                    }
                }
            };

            allTransactions = [...partialTransactions.data, ...unconfirmedTransactions.data, ...confirmedTransactions.data];
        } else {
            const confirmedTxs = await transactionHttp.search(confirmedSearchCriteria).toPromise();
            allTransactions = confirmedTxs.data;
        }
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
        const mosaicModels = await Promise.all(Object.values(mosaics).map(mosaic => MosaicService.getMosaicModelFromMosaicId(mosaic, network)));
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
            type: 'unknown',
            status: transaction.isConfirmed() ? 'confirmed' : 'unconfirmed',
            signerAddress: transaction.signer.address.plain(),
            deadline: formatTransactionLocalDateTime(transaction.deadline.toLocalDateTime(network.epochAdjustment)),
            hash: transaction.transactionInfo.hash,
            fee: transaction.maxFee.toString(),
        };
        if (transaction instanceof TransferTransaction) {
            transactionModel = await this._populateTransferTransactionModel(transactionModel, transaction, network, preLoadedMosaics);
        } else if (transaction instanceof LockFundsTransaction) {
            transactionModel = await this._populateFundsLockTransactionModel(transactionModel, transaction, network, preLoadedMosaics);
        } else if (transaction instanceof AggregateTransaction) {
            transactionModel = await this._populateAggregateTransactionModel(transactionModel, transaction, network);
        } else if (transaction instanceof NamespaceRegistrationTransaction) {
            transactionModel = await this._populateNamespaceRegistrationTransactionModel(transactionModel, transaction, network);
        } else if (transaction instanceof MosaicAliasTransaction) {
            transactionModel = await this._populateMosaicAliasTransactionModel(transactionModel, transaction, network);
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
                mosaicModel = await MosaicService.getMosaicModelFromMosaicId(mosaic, network);
            }
            mosaicModels.push(mosaicModel);
        }
        return {
            ...transactionModel,
            type: 'transfer',
            recipientAddress: transaction.recipientAddress instanceof Address ? transaction.recipientAddress.plain() : transaction.recipientAddress.id.toHex(),
            messageText: transaction.message.payload,
            messageEncrypted: transaction.message.type === 0x01,
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
            mosaicModel = await MosaicService.getMosaicModelFromMosaicId(transaction.mosaic, network);
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
        let innerTransactionModels = [];
        try {
            const transactionHttp = new TransactionHttp(network.node);
            const fullTransactionData = await transactionHttp
                .getTransaction(
                    transaction.transactionInfo.id,
                    transaction.isConfirmed()
                        ? TransactionGroup.Confirmed
                        : transaction.isUnconfirmed()
                            ? TransactionGroup.Unconfirmed
                            : TransactionGroup.Partial
                )
                .toPromise();
            innerTransactionModels = await Promise.all(
                fullTransactionData.innerTransactions.map(innerTx => this.symbolTransactionToTransactionModel(innerTx, network))
            );
        } catch (e) {}
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
     * Populates namespace transaction Model
     * @param transactionModel
     * @param transaction
     * @param network
     * @returns {Promise<void>}
     * @private
     */
    static async _populateNamespaceRegistrationTransactionModel(
        transactionModel: TransactionModel,
        transaction: NamespaceRegistrationTransaction,
        network: NetworkModel
    ): Promise<NamespaceRegistrationTransactionModel> {
        const namespace = transaction.namespaceName;
        return {
            ...transactionModel,
            type: 'namespace',
            namespaceName: namespace,
        };
    }

    /**
     * Populates mosaicAlias transaction Model
     * @param transactionModel
     * @param transaction
     * @param network
     * @returns {Promise<void>}
     * @private
     */
    static async _populateMosaicAliasTransactionModel(
        transactionModel: TransactionModel,
        transaction: MosaicAliasTransaction,
        network: NetworkModel
    ): Promise<MosaicAliasTransactionModel> {
        const namespaceId = transaction.namespaceId;
        const aliasAction = transaction.aliasAction;
        const mosaicId = transaction.mosaicId;
        const repositoryFactory = new RepositoryFactoryHttp(network.node);
        const namespaceHttp = repositoryFactory.createNamespaceRepository();
        const namespaceInfo = await namespaceHttp.getNamespacesNames([transaction.namespaceId]).toPromise();

        return {
            ...transactionModel,
            type: 'mosaicAlias',
            aliasAction: aliasAction,
            namespaceId: namespaceId.toHex(),
            namespaceName: namespaceInfo[0] ? namespaceInfo[0].name : '',
            mosaicId: mosaicId.toHex(),
        };
    }
}
