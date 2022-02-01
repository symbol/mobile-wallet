import {
    AccountHttp,
    Account,
    Address,
    NetworkType,
    Mosaic,
    MosaicHttp,
    NamespaceHttp,
    MultisigHttp,
    MosaicId,
    UInt64,
} from 'symbol-sdk';
import { ExtendedKey, MnemonicPassPhrase, Network, Wallet } from 'symbol-hd-wallets';
import type { AccountModel, AccountOriginType, MultisigAccountInfo } from '@src/storage/models/AccountModel';
import type { MnemonicModel } from '@src/storage/models/MnemonicModel';
import type { AppNetworkType, NetworkModel } from '@src/storage/models/NetworkModel';
import type { MosaicModel } from '@src/storage/models/MosaicModel';
import { AccountSecureStorage } from '@src/storage/persistence/AccountSecureStorage';
import MosaicService from '@src/services/MosaicService';
import { SymbolPaperWallet } from 'symbol-wallets-lib';
import { getAccountIndexFromDerivationPath } from '@src/utils/format';

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
        return Account.createFromPrivateKey(accountModel.privateKey, this._appNetworkToNetworkType(network)).address.plain();
    }
    /**
     * Generates random mnemonic
     */
    static async getNextIndex(network: AppNetworkType): number {
        const accounts = await AccountSecureStorage.getAllAccountsByNetwork(network);
        const hdAccounts = accounts.filter(el => el.type === 'hd' && el.path);
        hdAccounts.sort((a, b) => {
            const aI = getAccountIndexFromDerivationPath(a.path, a.network) || -1;
            const bI = getAccountIndexFromDerivationPath(b.path, b.network) || -1;
            return aI - bI;
        });
        let lastIndex = 0;
        for (let account: AccountModel of hdAccounts) {
            const index = getAccountIndexFromDerivationPath(account.path, account.network);
            if (index === lastIndex) lastIndex = index + 1;
        }
        return lastIndex;
    }

    /**
     * Remove account by it's id
     */
    static async removeAccountById(id: string, network: AppNetworkType): string {
        return AccountSecureStorage.removeAccount(id, network);
    }

    /**
     * Renames account by it's id
     */
    static async renameAccount(id: string, newName: string, network: AppNetworkType): string {
        const allAccounts = await AccountSecureStorage.getAllAccountsByNetwork(network);
        const account = allAccounts.find(account => account.id === id);
        account.name = newName;
        await AccountSecureStorage.updateAccount(account);
        return AccountSecureStorage.getAllAccountsByNetwork(network);
    }

    /**
     * Updates persistent del request sent
     */
    static async updateDelegatedHarvestingInfo(id: string, isPersistentDelReqSent: boolean, harvestingNode: string, network: AppNetworkType): string {
        const allAccounts = await AccountSecureStorage.getAllAccountsByNetwork(network);
        const account = allAccounts.find(account => account.id === id);
        if (!account) return;
        account.isPersistentDelReqSent = isPersistentDelReqSent;
        account.harvestingNode = harvestingNode;
        await AccountSecureStorage.updateAccount(account);
        return AccountSecureStorage.getAllAccountsByNetwork(network);
    }

    /**
     * Creates an account from a mnemonic
     * @param mnemonic
     * @param index
     * @param name
     * @param network
     * @param curve
     * @returns {AccountModel}
     */
    static createFromMnemonicAndIndex(mnemonic: string, index: number, name: string, network: AppNetworkType, curve = Network.SYMBOL): AccountModel {
        const mnemonicPassPhrase = new MnemonicPassPhrase(mnemonic);
        const seed = mnemonicPassPhrase.toSeed().toString('hex');
        const extKey = ExtendedKey.createFromSeed(seed, curve);
        const wallet = new Wallet(extKey);
        const path = `m/44'/${network === 'testnet' ? '1' : '4343'}'/${index}'/0'/0'`;
        const privateKey = wallet.getChildAccountPrivateKey(path);
        const symbolAccount = Account.createFromPrivateKey(privateKey, network === 'testnet' ? NetworkType.TEST_NET : NetworkType.MAIN_NET);
        return this.symbolAccountToAccountModel(symbolAccount, name, curve === Network.SYMBOL ? 'hd' : 'optin', path);
    }

    /**
     * Creates an account from a mnemonic
     * @param privateKey
     * @param name
     * @param network
     * @returns {AccountModel}
     */
    static createFromPrivateKey(privateKey: string, name: string, network: AppNetworkType): AccountModel {
        const symbolAccount = Account.createFromPrivateKey(privateKey, network === 'testnet' ? NetworkType.TEST_NET : NetworkType.MAIN_NET);
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
            network: account.networkType === NetworkType.TEST_NET ? 'testnet' : 'mainnet',
        };
    }

    /**
     * Gets multisig information
     * @param address
     * @param network
     * @returns {Promise<*[]>}
     */
    static async getCosignatoryOfByAddress(address: string, network: NetworkModel): Promise<{ cosignatoryOf: string[], isMultisig: boolean }> {
        try {
            const multisigInfo = await new MultisigHttp(network.node).getMultisigAccountInfo(Address.createFromRawAddress(address)).toPromise();
            return {
                cosignatoryOf: multisigInfo.multisigAddresses.map(address => address.plain()),
                isMultisig: multisigInfo.cosignatoryAddresses.length > 0,
            };
        } catch (e) {
            return { cosignatoryOf: [], isMultisig: false };
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
        const mnemonicAccount = this.createFromMnemonicAndIndex(mnemonic, 0, 'Root', network.type);
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

    // get signers for current account
    static getSigners(
        currentAccountAddress: Address,
        multisigAccountGraph?: Map<number, MultisigAccountInfo[]>,
        level?: number,
        childMinApproval?: number,
        childMinRemoval?: number
    ) {
        let currentMultisigAccountInfo: MultisigAccountInfo;
        if (level === undefined) {
            for (const [l, levelAccounts] of multisigAccountGraph) {
                for (const levelAccount of levelAccounts) {
                    if (levelAccount.accountAddress.equals(currentAccountAddress)) {
                        currentMultisigAccountInfo = levelAccount;
                        level = l;
                        break;
                    }
                }
            }
        } else {
            for (const levelAccount of multisigAccountGraph.get(level)) {
                if (levelAccount.accountAddress.equals(currentAccountAddress)) {
                    currentMultisigAccountInfo = levelAccount;
                }
            }
        }
        const currentSigner = {
            address: currentAccountAddress,
            multisig: currentMultisigAccountInfo?.isMultisig() || false,
            requiredCosigApproval: Math.max(childMinApproval || 0, currentMultisigAccountInfo?.minApproval || 0),
            requiredCosigRemoval: Math.max(childMinRemoval || 0, currentMultisigAccountInfo?.minRemoval || 0),
        };

        const parentSigners = [];
        if (currentMultisigAccountInfo?.multisigAddresses) {
            for (const parentSignerAddress of currentMultisigAccountInfo.multisigAddresses) {
                parentSigners.push(
                    ...this.getSigners(
                        parentSignerAddress,
                        multisigAccountGraph,
                        level - 1,
                        currentSigner.requiredCosigApproval,
                        currentSigner.requiredCosigRemoval
                    )
                );
            }
            currentSigner.parentSigners = parentSigners.filter(ps => currentMultisigAccountInfo.multisigAddresses.some(msa => msa.equals(ps.address)));
        }
        return [currentSigner, ...parentSigners];
    }
}
