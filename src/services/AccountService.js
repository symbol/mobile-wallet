import {
    AccountHttp,
    AccountInfo,
    Account,
    Address,
    NetworkType,
    TransactionHttp,
    TransactionGroup,
    Transaction,
    TransferTransaction, Mosaic,
} from 'symbol-sdk';
import { getNativeMosaicId } from '@src/config/environment';
import { ExtendedKey, MnemonicPassPhrase, Wallet } from 'symbol-hd-wallets';
import type { AccountModel, AccountOriginType } from '@src/storage/models/AccountModel';
import type { MnemonicModel } from '@src/storage/models/MnemonicModel';
import type { AppNetworkType } from '@src/storage/models/NetworkModel';
import type { TransactionModel, TransactionStatus, TransactionType } from '@src/storage/models/TransactionModel';
import { formatTransactionLocalDateTime } from '@src/utils/format';

export default class AccountService {
    /**
     * Generates random mnemonic
     */
    static createRandomMnemonic(): MnemonicModel {
        return {
            mnemonic: MnemonicPassPhrase.createRandom().plain,
            lastIndexDerived: 0,
        };
    }

    /**
     * App network to symbol network type
     * @param net
     * @returns {NetworkType.TEST_NET|NetworkType.MAIN_NET}
     * @private
     */
    static _appNetworkToNetworkType(net: AppNetworkType): NetworkType {
        return net === 'testnet' ? NetworkType.TEST_NET : NetworkType.MAIN_NET;
    }

    /**
     * Generates random mnemonic
     */
    static getAddressByAccountModelAndNetwork(accountModel: AccountModel, network: AppNetworkType): string {
        return Account.createFromPrivateKey(accountModel.privateKey, this._appNetworkToNetworkType(network)).address.pretty();
    }

    /**
     * Creates an account from a mnemonic
     * @param mnemonic
     * @param index
     * @param name
     * @returns {AccountModel}
     */
    static createFromMnemonicAndIndex(mnemonic: string, index: number, name: string): AccountModel {
        const mnemonicPassPhrase = new MnemonicPassPhrase(mnemonic);
        const seed = mnemonicPassPhrase.toSeed().toString('hex');
        const extKey = ExtendedKey.createFromSeed(seed);
        const wallet = new Wallet(extKey);
        const path = `m/44'/4343'/${index}'/0'/0'`;
        const privateKey = wallet.getChildAccountPrivateKey(path);
        const symbolAccount = Account.createFromPrivateKey(privateKey, NetworkType.MAIN_NET);
        return this.symbolAccountToAccountModel(symbolAccount, name, 'hd');
    }

    /**
     * Returns balance from a given Address and a node
     * @param address
     * @param node
     * @returns {Promise<number>}
     */
    static async getBalanceFromAddress(address: string, node: string): Promise<number> {
        try {
            const accountInfo = await new AccountHttp(node).getAccountInfo(Address.createFromRawAddress(address)).toPromise();
            let amount = 0;
            accountInfo.mosaics.forEach(mosaic => {
                if (mosaic.id.toHex() === getNativeMosaicId()) {
                    amount = mosaic.amount.compact() / Math.pow(10, 6);
                }
            });
            return amount;
        } catch (e) {
            console.log(e);
            return 0;
        }
    }

    /**
     * Returns balance from a given Address and a node
     * @param rawAddress
     * @param node
     * @returns {Promise<number>}
     */
    static async getTransactionsFromAddress(rawAddress: string, node: string): Promise<TransactionModel[]> {
        const transactionHttp = new TransactionHttp(node);
        const address = Address.createFromRawAddress(rawAddress);
        const confirmedSearchCriteria = { group: TransactionGroup.Confirmed, address, pageNumber: 1, pageSize: 100 };
        const unconfirmedSearchCriteria = { group: TransactionGroup.Unconfirmed, address, pageNumber: 1, pageSize: 100 };
        const [confirmedTransactions, unconfirmedTransactions] = await Promise.all([
            transactionHttp.search(confirmedSearchCriteria).toPromise(),
            transactionHttp.search(unconfirmedSearchCriteria).toPromise(),
        ]);
        const allTransactions = [...unconfirmedTransactions.data, ...confirmedTransactions.data];
        return allTransactions.map(this.symbolTransactionToTransactionModel);
    }

    /**
     * Transform a symbol account to an account Model
     * @returns {{privateKey: string, name: string, id: string, type: AccountOriginType}}
     * @param transaction
     */
    static symbolTransactionToTransactionModel(transaction: Transaction): TransactionModel {
        let transactionModel: TransactionModel = {
            status: transaction.isConfirmed(),
            signerAddress: transaction.signer.address.pretty(),
            deadline: formatTransactionLocalDateTime(transaction.deadline.value),
            hash: transaction.transactionInfo.hash,
            fee: transaction.maxFee.toString(),
        };

        if (transaction instanceof TransferTransaction) {
            const nativeMosaicAttachment = transaction.mosaics.find(mosaic => mosaic.id.toHex() === getNativeMosaicId());
            const otherMosaics = transaction.mosaics.filter(mosaic => mosaic.id.toHex() !== getNativeMosaicId());
            transactionModel = {
                ...transactionModel,
                type: 'transfer',
                recipientAddress: transaction.recipientAddress.pretty(),
                messageText: transaction.message.message,
                messageEncrypted: transaction.message.type,
                amount: nativeMosaicAttachment ? nativeMosaicAttachment.amount.toString() : 0,
                otherMosaics: otherMosaics.map(mosaic => ({
                    id: mosaic.id,
                    amount: mosaic.amount.toString(),
                })),
            };
        }
        return transactionModel;
    }

    /**
     * Transform a symbol account to an account Model
     * @param account
     * @param name
     * @param type
     * @returns {{privateKey: string, name: string, id: string, type: AccountOriginType}}
     */
    static symbolAccountToAccountModel(account: Account, name: string, type: AccountOriginType): AccountModel {
        return {
            id: account.publicKey,
            name: name,
            type: type,
            privateKey: account.privateKey,
        };
    }
}
