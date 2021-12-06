import { AsyncCache } from '@src/utils/storage/AsyncCache';
import { AccountSecureStorage } from '@src/storage/persistence/AccountSecureStorage';
import AccountService from '@src/services/AccountService';
import { SecureStorage } from '@src/utils/storage/SecureStorage';
import { MnemonicSecureStorage } from '@src/storage/persistence/MnemonicSecureStorage';
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
        const optinMainnetAccount = AccountService.createFromMnemonicAndIndex(
            mnemonicModel.mnemonic,
            i,
            `Opt In Account ${i + 1}`,
            'mainnet',
            Network.BITCOIN
        );
        mainnetOptinAccounts[optinMainnetAccount.id] = optinMainnetAccount;
    }

    const mainnetList = getWhitelistedPublicKeys('mainnet');
    for (let publicKey of mainnetList) {
        if (mainnetOptinAccounts[publicKey]) await AccountSecureStorage.createNewAccount(mainnetOptinAccounts[publicKey]);
    }
};
