import { AsyncCache } from '@src/utils/storage/AsyncCache';
import { getLocalAccounts } from '@src/utils/storage/RealmDB';
import Account from '@src/utils/storage/models/Account';
import { AccountSecureStorage } from '@src/storage/persistence/AccountSecureStorage';
import AccountService from '@src/services/AccountService';
import { SecureStorage } from '@src/utils/storage/SecureStorage';
import { MnemonicSecureStorage } from '@src/storage/persistence/MnemonicSecureStorage';

export const CURRENT_DATA_SCHEMA = 2;

export const migrateDataSchema = async (oldVersion: number) => {
    switch (oldVersion) {
        case 0:
            await migrateVersion0();
            break;
    }
    await AsyncCache.setDataSchemaVersion(CURRENT_DATA_SCHEMA);
};

const migrateVersion0 = async () => {
    console.log('Migrating from version 0');
    const mnemonic = await SecureStorage.secureRetrieveAsync('mnemonics');
    if (!mnemonic) return;
    await MnemonicSecureStorage.saveMnemonic(mnemonic);
    const accounts = await getLocalAccounts().toPromise();
    for (let account: Account of accounts) {
        const newAccountModel = AccountService.createFromMnemonicAndIndex(
            mnemonic,
            account.bipIndex,
            account.name,
            account.networkType === NetworkType.MAIN_NET ? 'mainnet' : 'testnet',
            Network.BITCOIN
        );
        await AccountSecureStorage.createNewAccount(newAccountModel);
    }
    const testnetAccountModel = AccountService.createFromMnemonicAndIndex(mnemonic, 0, 'Seed account 0', 'testnet');
    await AccountSecureStorage.createNewAccount(testnetAccountModel);
    const mainnetAccountModel = AccountService.createFromMnemonicAndIndex(mnemonic, 0, 'Seed account 0', 'mainnet');
    await AccountSecureStorage.createNewAccount(mainnetAccountModel);
};
