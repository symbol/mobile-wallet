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
    AggregateTransaction,
    TransactionStatusHttp,
} from 'symbol-sdk';
import type { NetworkModel } from '@src/storage/models/NetworkModel';
import { TransactionQR } from 'symbol-qr-library';
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
    static async transactionModelToTransactionObject(transaction: TransactionModel, signer: AccountModel, networkModel: NetworkModel): Promise<Transaction> {
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
     * @param extraParams
     */
    static async signAndBroadcastTransactionModel(transaction: TransactionModel, signer: AccountModel, networkModel: NetworkModel, ...extraParams) {
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
        const recipientAddress = Address.createFromRawAddress(transaction.recipientAddress);
        const networkType = networkModel.type === 'testnet' ? NetworkType.TEST_NET : NetworkType.MAIN_NET;
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
            const repositoryFactory = await new RepositoryFactoryHttp(networkModel.node);
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
        await store.dispatchAction({ type: 'transfer/setTransactionHash', payload: signedTransaction.hash });
        const transactionHttp = new TransactionHttp(network.node);
        return transactionHttp.announce(signedTransaction).toPromise();
    }

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

    static calculateMaxFee(transaction: Transaction, network: NetworkModel, selectedFeeMultiplier?: number): Transaction {
        if (!selectedFeeMultiplier) {
            return transaction;
        }
        const feeMultiplier =
            this._resolveFeeMultiplier(transaction, network, selectedFeeMultiplier) < network.transactionFees.minFeeMultiplier
                ? network.transactionFees.minFeeMultiplier
                : this._resolveFeeMultiplier(transaction, network, selectedFeeMultiplier);
        if (!feeMultiplier) {
            return transaction;
        }
        return transaction.setMaxFee(feeMultiplier);
    }

    static _resolveFeeMultiplier(transaction: Transaction, network: NetworkModel, selectedFeeMultiplier: number): number | undefined {
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
                return '';
            }
        } catch (e) {
            console.log(e);
            return '';
        }
    };
}
