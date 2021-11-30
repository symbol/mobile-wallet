import type { AccountModel } from '@src/storage/models/AccountModel';
import type { AggregateTransactionModel, TransactionModel, TransferTransactionModel } from '@src/storage/models/TransactionModel';
import {
    Account,
    Address,
    CosignatureSignedTransaction,
    CosignatureTransaction,
    Deadline,
    EncryptedMessage,
    Mosaic,
    MosaicId,
    NetworkType,
    PlainMessage,
    PublicAccount,
    RepositoryFactoryHttp,
    SignedTransaction,
    Transaction,
    TransactionGroup,
    TransactionHttp,
    TransferTransaction,
    UInt64,
} from 'symbol-sdk';
import type { NetworkModel } from '@src/storage/models/NetworkModel';
import { TransactionQR } from 'symbol-qr-library';
import { FormatTransaction } from '@src/services/FormatTransaction';
import FetchTransactionService from '@src/services/FetchTransactionService';
import NetworkService from '@src/services/NetworkService';
import store from '@src/store';
import { defaultFeesConfig } from '@src/config/fees';

export default class TransactionService {
    /**
     * Transforms a model to an sdk object
     * @param transaction
     * @param signer
     * @param networkModel
     * @returns {TransferTransaction}
     */
    static async transactionModelToTransactionObject(
        transaction: TransactionModel,
        signer: AccountModel,
        networkModel: NetworkModel
    ): Promise<Transaction> {
        let transactionObj: Transaction;
        switch (transaction.type) {
            case 'transfer':
                transactionObj = await this._transferTransactionModelToObject(transaction, signer, networkModel);
                break;
            default:
                throw new Error('Not implemented');
        }
        return transactionObj;
    }

    /**
     * Signs and broadcasts a transaction model
     * @param transaction
     * @param signer
     * @param networkModel
     */
    static async signAndBroadcastTransactionModel(transaction: TransactionModel, signer: AccountModel, networkModel: NetworkModel) {
        const transactionObject = await this.transactionModelToTransactionObject(transaction, signer, networkModel);
        return this._signAndBroadcast(transactionObject, signer, networkModel);
    }

    /**
     * Transforms a transfer transaction model to an sdk object
     * @param transaction
     * @param signer
     * @param networkModel
     * @returns {Promise<TransferTransaction>}
     * @private
     */
    static async _transferTransactionModelToObject(
        transaction: TransferTransactionModel,
        signer: AccountModel,
        networkModel: NetworkModel
    ): TransferTransaction {
        const networkType = networkModel.type === 'testnet' ? NetworkType.TEST_NET : NetworkType.MAIN_NET;
        const recipientAddress = Address.createFromRawAddress(transaction.recipientAddress);
        const mosaics = [new Mosaic(new MosaicId(transaction.mosaics[0].mosaicId), UInt64.fromUint(transaction.mosaics[0].amount))];

        if (!transaction.messageEncrypted) {
            const message = PlainMessage.create(transaction.messageText);
            return TransferTransaction.create(
                Deadline.create(networkModel.epochAdjustment),
                recipientAddress,
                mosaics,
                message,
                networkType,
                UInt64.fromUint(transaction.fee)
            );
        } else {
            const signerAccount = Account.createFromPrivateKey(signer.privateKey, networkType);
            const repositoryFactory = new RepositoryFactoryHttp(networkModel.node);
            const accountHttp = repositoryFactory.createAccountRepository();
            try {
                const accountInfo = await accountHttp.getAccountInfo(recipientAddress).toPromise();
                const message = signerAccount.encryptMessage(transaction.messageText, accountInfo);
                return TransferTransaction.create(
                    Deadline.create(networkModel.epochAdjustment, 2),
                    recipientAddress,
                    mosaics,
                    message,
                    networkType,
                    UInt64.fromUint(transaction.fee)
                );
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
    static async _signAndBroadcast(transaction: Transaction, signer: AccountModel, network: NetworkModel) {
        const networkType = network.type === 'testnet' ? NetworkType.TEST_NET : NetworkType.MAIN_NET;
        const signerAccount = Account.createFromPrivateKey(signer.privateKey, networkType);
        const signedTransaction = signerAccount.sign(transaction, network.generationHash);
        await store.dispatchAction({
            type: 'transfer/setTransactionHash',
            payload: signedTransaction.hash,
        });
        return this.broadcastSignedTransaction(signedTransaction, network);
    }

    /**
     * Cosign and broadcast aggregate transactionModel
     * @param transaction
     * @param signer
     * @param network
     */
    static cosignAndBroadcastAggregateTransactionModel(
        transaction: AggregateTransactionModel,
        signer: AccountModel,
        network: NetworkModel
    ) {
        const cosignatureTransaction = CosignatureTransaction.create(transaction.signTransactionObject);
        const networkType = network.type === 'testnet' ? NetworkType.TEST_NET : NetworkType.MAIN_NET;
        const signerAccount = Account.createFromPrivateKey(signer.privateKey, networkType);
        const signedTransaction = signerAccount.signCosignatureTransaction(cosignatureTransaction);

        return this.broadcastCosignatureSignedTransaction(signedTransaction, network);
    }

    static async broadcastSignedTransaction(tx: SignedTransaction, network: NetworkModel) {
        const transactionHttp = new TransactionHttp(network.node);
        return transactionHttp.announce(tx).toPromise();
    }

    static async broadcastCosignatureSignedTransaction(tx: CosignatureSignedTransaction, network: NetworkModel) {
        const transactionHttp = new TransactionHttp(network.node);
        return transactionHttp.announceAggregateBondedCosignature(tx).toPromise();
    }

    static calculateMaxFee(transaction: Transaction, network: NetworkModel, selectedFeeMultiplier?: number): Transaction {
        if (!selectedFeeMultiplier) {
            return transaction;
        }
        const feeMultiplier =
            this._resolveFeeMultiplier(network, selectedFeeMultiplier) < network.transactionFees.minFeeMultiplier
                ? network.transactionFees.minFeeMultiplier
                : this._resolveFeeMultiplier(network, selectedFeeMultiplier);
        if (!feeMultiplier) {
            return transaction;
        }
        return transaction.setMaxFee(feeMultiplier);
    }

    static _resolveFeeMultiplier(network: NetworkModel, selectedFeeMultiplier: number): number | undefined {
        if (selectedFeeMultiplier === defaultFeesConfig.slow) {
            const fees =
                network.transactionFees.lowestFeeMultiplier < network.transactionFees.minFeeMultiplier
                    ? network.transactionFees.minFeeMultiplier
                    : network.transactionFees.lowestFeeMultiplier;
            return fees || network.defaultDynamicFeeMultiplier;
        }
        if (selectedFeeMultiplier === defaultFeesConfig.normal) {
            const fees =
                network.transactionFees.medianFeeMultiplier < network.transactionFees.minFeeMultiplier
                    ? network.transactionFees.minFeeMultiplier
                    : network.transactionFees.medianFeeMultiplier;
            return fees || network.defaultDynamicFeeMultiplier;
        }
        if (selectedFeeMultiplier === defaultFeesConfig.fast) {
            const fees =
                network.transactionFees.highestFeeMultiplier < network.transactionFees.minFeeMultiplier
                    ? network.transactionFees.minFeeMultiplier
                    : network.transactionFees.highestFeeMultiplier;
            return fees || network.defaultDynamicFeeMultiplier;
        }
        return undefined;
    }

    /**
     * Receive QR Data
     * @param recipientAddress
     * @param amount
     * @param network
     * @param message
     * @returns {Promise<void>}
     */
    static getReceiveSvgQRData = async (recipientAddress, amount, network, message) => {
        const netwrokType = network.type === 'testnet' ? NetworkType.TEST_NET : NetworkType.MAIN_NET;
        const transferTransaction = TransferTransaction.create(
            Deadline.create(network.epochAdjustment, 2),
            Address.createFromRawAddress(recipientAddress),
            [new Mosaic(new MosaicId(network.currencyMosaicId), UInt64.fromUint(amount * Math.pow(10, 6)))],
            PlainMessage.create(message),
            netwrokType,
            UInt64.fromUint(1000000)
        );
        const txQR = new TransactionQR(transferTransaction, netwrokType, network.generationHash);
        return txQR.toBase64().toPromise();
    };

    /**
     * Decrypt message
     * @param current
     * @param network
     * @param transaction
     * @returns {Promise<void>}
     */
    static decryptMessage = async (current: AccountModel, network: NetworkModel, transaction: TransferTransactionModel) => {
        try {
            const transactionHash = transaction.hash;
            const repositoryFactory = new RepositoryFactoryHttp(network.node);
            const transactionHttp = repositoryFactory.createTransactionRepository();
            let tx;
            try {
                tx = await transactionHttp.getTransaction(transactionHash, TransactionGroup.Confirmed).toPromise();
            } catch {}
            if (!tx) {
                try {
                    tx = await transactionHttp.getTransaction(transactionHash, TransactionGroup.Unconfirmed).toPromise();
                } catch {}
            }
            if (tx && tx instanceof TransferTransaction && tx.message.type === 1) {
                const networkType = NetworkService.getNetworkTypeFromModel(network);
                const currentAccount = Account.createFromPrivateKey(current.privateKey, networkType);
                if (tx.recipientAddress.plain() === currentAccount.address.plain()) {
                    return EncryptedMessage.decrypt(tx.message, current.privateKey, tx.signer).payload;
                } else {
                    const accountHttp = repositoryFactory.createAccountRepository();
                    const recipientAccountInfo = await accountHttp.getAccountInfo(tx.recipientAddress).toPromise();
                    const recipientAccount = PublicAccount.createFromPublicKey(recipientAccountInfo.publicKey, networkType);
                    return EncryptedMessage.decrypt(tx.message, current.privateKey, recipientAccount).payload;
                }
            } else {
                return '';
            }
        } catch (e) {
            console.log(e);
            return '';
        }
    };

    static getTransaction = async (hash: string, network: NetworkModel): Transaction => {
        const transactionHttp = new TransactionHttp(network.node);
        let tx;

        try {
            tx = await transactionHttp.getTransaction(hash, TransactionGroup.Confirmed).toPromise();
        } catch {}
        if (!tx) {
            try {
                tx = await transactionHttp.getTransaction(hash, TransactionGroup.Unconfirmed).toPromise();
            } catch {}
        }
        if (!tx) {
            try {
                tx = await transactionHttp.getTransaction(hash, TransactionGroup.Partial).toPromise();
            } catch {}
        }

        return tx;
    };

    static getTransactionDetails = async (hash: string, network: NetworkModel) => {
        let rawTransactionDetails = await TransactionService.getTransaction(hash, network);
        rawTransactionDetails.hash = hash;

        const preLoadedMosaics = await FetchTransactionService._preLoadMosaics(rawTransactionDetails.innerTransactions, network);

        return FormatTransaction.format(rawTransactionDetails, network, preLoadedMosaics);
    };
}
