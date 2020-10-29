import { AccountHttp, AccountInfo, Account, Address, NetworkType } from 'symbol-sdk';
import { getNativeMosaicId } from '@src/config/environment';
import { ExtendedKey, MnemonicPassPhrase, Wallet } from 'symbol-hd-wallets';
import type { AccountModel, AccountOriginType, AppNetwork } from '@src/storage/models/AccountModel';
import type { MnemonicModel } from '@src/storage/models/MnemonicModel';

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
    static _appNetworkToNetworkType(net: AppNetwork): NetworkType {
        return net === 'testnet' ? NetworkType.TEST_NET: NetworkType.MAIN_NET;
    }

    /**
     * Generates random mnemonic
     */
    static getAddressByAccountModelAndNetwork(accountModel: AccountModel, network: AppNetwork): string {
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
        console.log(node);
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
    };
}
