import { AsyncCache } from '@src/utils/storage/AsyncCache';
import { getLocalAccounts } from '@src/utils/storage/RealmDB';
import Account from '@src/utils/storage/models/Account';
import { AccountSecureStorage } from '@src/storage/persistence/AccountSecureStorage';
import AccountService from '@src/services/AccountService';
import { SecureStorage } from '@src/utils/storage/SecureStorage';
import { MnemonicSecureStorage } from '@src/storage/persistence/MnemonicSecureStorage';
import { NetworkType, Account as SymbolAccount } from 'symbol-sdk';
import { Network } from 'symbol-hd-wallets';
import { getWhitelistedPublicKeys } from '@src/config/environment';

export const CURRENT_DATA_SCHEMA = 2;

export const migrateDataSchema = async (oldVersion: number) => {
    switch (oldVersion) {
        case 0:
            await migrateOptIn();
            break;
    }
    await AsyncCache.setDataSchemaVersion(CURRENT_DATA_SCHEMA);
};

const migrateOptIn = async () => {
    let mnemonic;
    try {
        mnemonic = await SecureStorage.secureRetrieveAsync('mnemonics');
    } catch (e) {}
    if (!mnemonic) return;

    await MnemonicSecureStorage.saveMnemonic(mnemonic);
    let mnemonicModel = await MnemonicSecureStorage.retrieveMnemonic();

    const mainnetAccountModel = AccountService.createFromMnemonicAndIndex(mnemonicModel.mnemonic, 0, 'Seed account 1', 'mainnet');
    await AccountSecureStorage.createNewAccount(mainnetAccountModel);
    const testnetAccountModel = AccountService.createFromMnemonicAndIndex(mnemonicModel.mnemonic, 0, 'Seed account 1', 'testnet');
    await AccountSecureStorage.createNewAccount(testnetAccountModel);

    const mainnetOptinAccounts = {};
    for (let i = 0; i < 10; i++) {
        const optinMainnetAccount = AccountService.createFromMnemonicAndIndex(mnemonicModel.mnemonic, i, `Opt In Account ${i + 1}`, 'mainnet', Network.BITCOIN);
        mainnetOptinAccounts[optinMainnetAccount.id] = optinMainnetAccount;
    }

    const mainnetList = getWhitelistedPublicKeys('mainnet');
    for (let publicKey of mainnetList) {
        if (mainnetOptinAccounts[publicKey]) await AccountSecureStorage.createNewAccount(mainnetOptinAccounts[publicKey]);
    }
};

const migrateVersion0 = async () => {
    console.log('Migrating from version 0');
    try {
        const mnemonic = await SecureStorage.secureRetrieveAsync('mnemonics');
        if (!mnemonic) return;
        await MnemonicSecureStorage.saveMnemonic(mnemonic);
        const accounts = await getLocalAccounts().toPromise();
        let i = 1;
        for (let account: Account of accounts) {
            /*
            const newAccountModel = AccountService.createFromMnemonicAndIndex(
                mnemonic,
                account.bipIndex,
                'Opt In Account ' + i,
                NetworkType.MAIN_NET,
                Network.BITCOIN
            );
            */
            const symbolAccount = SymbolAccount.createFromPrivateKey(account.privateKey, NetworkType.MAIN_NET);
            const newAccountModel = {
                id: symbolAccount.publicKey,
                name: 'Opt In Account ' + i,
                type: 'optin',
                privateKey: symbolAccount.privateKey,
                network: 'mainnet',
            };
            await AccountSecureStorage.createNewAccount(newAccountModel);
            i++;
        }
        const testnetAccountModel = AccountService.createFromMnemonicAndIndex(mnemonic, 0, 'Seed account 0', 'testnet');
        await AccountSecureStorage.createNewAccount(testnetAccountModel);
        const mainnetAccountModel = AccountService.createFromMnemonicAndIndex(mnemonic, 0, 'Seed account 0', 'mainnet');
        await AccountSecureStorage.createNewAccount(mainnetAccountModel);
    } catch (e) {
        console.log('Error migrating from version 0');
    }
};
