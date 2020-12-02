import { AsyncCache } from "@src/utils/storage/AsyncCache";
import {getLocalAccounts} from "@src/utils/storage/RealmDB";
import Account from "@src/utils/storage/models/Account";
import {AccountSecureStorage} from "@src/storage/persistence/AccountSecureStorage";
import AccountService from "@src/services/AccountService";
import {MnemonicSecureStorage} from "@src/storage/persistence/MnemonicSecureStorage";

export const CURRENT_DATA_SCHEMA = 1;

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
    const mnemonicModel = await MnemonicSecureStorage.retrieveMnemonic();
    const accounts = await getLocalAccounts().toPromise();
    for (let account: Account of accounts) {
        const newAccountModel = AccountService.createFromMnemonicAndIndex(mnemonicModel.mnemonic, account.bipIndex, account.name);
        await AccountSecureStorage.createNewAccount(newAccountModel);
    }
};
