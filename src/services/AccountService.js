import {
    AccountHttp,
    AccountInfo,
    Account,
    Address,
    NetworkType,
    TransactionHttp,
    TransactionGroup,
    Transaction,
    TransferTransaction,
    Mosaic,
    MosaicHttp,
    MosaicId,
    NamespaceHttp,
    LockFundsTransaction,
    AggregateTransactionCosignature, AggregateTransaction, InnerTransaction,
} from 'symbol-sdk';
import { getNativeMosaicId } from '@src/config/environment';
import { ExtendedKey, MnemonicPassPhrase, Wallet } from 'symbol-hd-wallets';
import type { AccountModel, AccountOriginType } from '@src/storage/models/AccountModel';
import type { MnemonicModel } from '@src/storage/models/MnemonicModel';
import type { AppNetworkType, NetworkModel } from '@src/storage/models/NetworkModel';
import type { TransactionModel, TransactionStatus, TransactionType } from '@src/storage/models/TransactionModel';
import { formatTransactionLocalDateTime } from '@src/utils/format';
import type { MosaicModel } from '@src/storage/models/MosaicModel';

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
     * @param network
     * @returns {Promise<number>}
     */
    static async getBalanceAndOwnedMosaicsFromAddress(address: string, network: NetworkModel): Promise<{ balance: number, ownedMosaics: MosaicModel[] }> {
        try {
            const accountInfo = await new AccountHttp(network.node).getAccountInfo(Address.createFromRawAddress(address)).toPromise();
            let amount = 0;
            const ownedMosaics: MosaicModel[] = [];
            for (let mosaic of accountInfo.mosaics) {
                const mosaicModel = await this._getMosaicModelFromMosaicId(mosaic, network);
                if (mosaic.id.toHex() === network.currencyMosaicId) {
                    amount = mosaic.amount.compact() / Math.pow(10, mosaicModel.divisibility);
                }
                ownedMosaics.push(mosaicModel);
            }
            return {
                balance: amount,
                ownedMosaics: ownedMosaics,
            };
        } catch (e) {
            return { balance: 0, ownedMosaics: [] };
        }
    }

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