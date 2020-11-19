import { AccountHttp, Account, Address, NetworkType, Mosaic, MosaicHttp, NamespaceHttp, MultisigHttp, MosaicId, UInt64 } from 'symbol-sdk';
import { ExtendedKey, MnemonicPassPhrase, Wallet } from 'symbol-hd-wallets';
import type { AccountModel, AccountOriginType } from '@src/storage/models/AccountModel';
import type { MnemonicModel } from '@src/storage/models/MnemonicModel';
import type { AppNetworkType, NetworkModel } from '@src/storage/models/NetworkModel';
import type { MosaicModel } from '@src/storage/models/MosaicModel';
import { AccountSecureStorage } from '@src/storage/persistence/AccountSecureStorage';
import MosaicService from '@src/services/MosaicService';
import { SymbolPaperWallet } from 'symbol-paper-wallets';

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
     * Remove account by it's id
     */
    static async removeAccountById(id: string): string {
        const allAccounts = await AccountSecureStorage.getAllAccounts();
        const filteredAccounts = allAccounts.filter(account => account.id !== id);
        await AccountSecureStorage.saveAccounts(filteredAccounts);
        return filteredAccounts;
    }

    /**
     * Renames account by it's id
     */
    static async renameAccount(id: string, newName: string): string {
        const allAccounts = await AccountSecureStorage.getAllAccounts();
        allAccounts.forEach(account => {
            if (account.id === id) {
                account.name = newName;
            }
        });
        await AccountSecureStorage.saveAccounts(allAccounts);
        return allAccounts;
    }

    /**
     * Updates persistent del request sent
     */
    static async updateDelegatedHarvestingInfo(id: string, isPersistentDelReqSent: boolean, harvestingNode: string): string {
        const allAccounts = await AccountSecureStorage.getAllAccounts();
        allAccounts.forEach(account => {
            if (account.id === id) {
                account.isPersistentDelReqSent = isPersistentDelReqSent;
                account.harvestingNode = harvestingNode;
            }
        });
        await AccountSecureStorage.saveAccounts(allAccounts);
        return allAccounts;
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
        const path = `m/44'/4343'/0'/${index}'/0'`;
        const privateKey = wallet.getChildAccountPrivateKey(path);
        const symbolAccount = Account.createFromPrivateKey(privateKey, NetworkType.MAIN_NET);
        return this.symbolAccountToAccountModel(symbolAccount, name, 'hd', path);
    }

    /**
     * Creates an account from a mnemonic
     * @param privateKey
     * @param name
     * @returns {AccountModel}
     */
    static createFromPrivateKey(privateKey: string, name: string): AccountModel {
        const symbolAccount = Account.createFromPrivateKey(privateKey, NetworkType.MAIN_NET);
        return this.symbolAccountToAccountModel(symbolAccount, name, 'privateKey');
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
            let amount = 0,
                hasCurrencyMosaic = false;
            const ownedMosaics: MosaicModel[] = [];
            for (let mosaic of accountInfo.mosaics) {
                const mosaicModel = await MosaicService.getMosaicModelFromMosaicId(mosaic, network);
                if (mosaic.id.toHex() === network.currencyMosaicId) {
                    hasCurrencyMosaic = true;
                    amount = mosaic.amount.compact() / Math.pow(10, mosaicModel.divisibility);
                }
                ownedMosaics.push(mosaicModel);
            }
            if (!hasCurrencyMosaic) {
                const currencyMosaic = await this.getNativeMosaicModel(network);
                ownedMosaics.push(currencyMosaic);
            }
            return {
                balance: amount,
                ownedMosaics: ownedMosaics,
            };
        } catch (e) {
            const currencyMosaic = await this.getNativeMosaicModel(network);
            return { balance: 0, ownedMosaics: [currencyMosaic] };
        }
    }

    /**
     * Get native mosaic Id
     * @param network
     * @returns {Promise<{amount: string, mosaicId: string, mosaicName: (*|null), divisibility: *}>}
     */
    static async getNativeMosaicModel(network: NetworkModel): Promise<MosaicModel> {
        let mosaicInfo = {},
            mosaicName = {};
        const mosaic = new Mosaic(new MosaicId(network.currencyMosaicId), UInt64.fromUint(0));
        try {
            mosaicInfo = await new MosaicHttp(network.node).getMosaic(mosaic.id).toPromise();
            [mosaicName] = await new NamespaceHttp(network.node).getMosaicsNames([mosaic.id]).toPromise();
        } catch (e) {
            console.log(e);
        }
        return {
            mosaicId: mosaic.id.toHex(),
            mosaicName: mosaicName && mosaicName.names && mosaicName.names[0] ? mosaicName.names[0].name : null,
            amount: mosaic.amount.toString(),
            divisibility: mosaicInfo.divisibility,
        };
    }

    /**
     * Transform a symbol account to an account Model
     * @param account
     * @param name
     * @param type
     * @param path
     * @returns {{privateKey: string, name: string, id: string, type: AccountOriginType}}
     */
    static symbolAccountToAccountModel(account: Account, name: string, type: AccountOriginType, path?: string): AccountModel {
        return {
            id: account.publicKey,
            name: name,
            type: type,
            privateKey: account.privateKey,
            path: path,
        };
    }

    /**
     * Gets multisig information
     * @param address
     * @param network
     * @returns {Promise<*[]>}
     */
    static async getCosignatoryOfByAddress(address: string, network: NetworkModel): Promise<string[]> {
        try {
            const multisigInfo = await new MultisigHttp(network.node).getMultisigAccountInfo(Address.createFromRawAddress(address)).toPromise();
            return multisigInfo.multisigAddresses.map(address => address.pretty());
        } catch (e) {
            return [];
        }
    }
    /**
     * Gets multisig information
     * @returns {Promise<*[]>}
     * @param mnemonic
     * @param accounts
     * @param network
     */
    static async generatePaperWallet(mnemonic: string, accounts: AccountModel[], network: NetworkModel): Promise<Uint8Array> {
        const mnemonicAccount = this.createFromMnemonicAndIndex(mnemonic, 0, 'Root');
        const hdRootAccount = {
            mnemonic: mnemonic,
            rootAccountPublicKey: mnemonicAccount.id,
            rootAccountAddress: this.getAddressByAccountModelAndNetwork(mnemonicAccount, network.type),
        };
        const privateKeyAccounts = accounts.map(account => ({
            name: account.name,
            address: this.getAddressByAccountModelAndNetwork(account, network.type),
            publicKey: account.id,
            privateKey: account.privateKey,
        }));

        const paperWallet = new SymbolPaperWallet(
            hdRootAccount,
            privateKeyAccounts,
            network.type === 'testnet' ? NetworkType.TEST_NET : NetworkType.MAIN_NET,
            network.generationHash
        );

        const bytes = await paperWallet.toPdf();
        const Uint8ToString = u8a => {
            var CHUNK_SZ = 0x8000;
            var c = [];
            for (var i = 0; i < u8a.length; i += CHUNK_SZ) {
                c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
            }
            return c.join('');
        };
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        const btoa = (input = '') => {
            let str = input;
            let output = '';

            for (
                let block = 0, charCode, i = 0, map = chars;
                str.charAt(i | 0) || ((map = '='), i % 1);
                output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
            ) {
                charCode = str.charCodeAt((i += 3 / 4));

                if (charCode > 0xff) {
                    throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
                }

                block = (block << 8) | charCode;
            }

            return output;
        };

        return btoa(Uint8ToString(bytes));
    }
}
