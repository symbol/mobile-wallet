import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';

export class SecureStorage {
    static MNEMONIC_KEY = 'MNEMONIC';
    static ACCOUNTS_KEY = 'ACCOUNTS';

    static saveMnemonic(mnemonic: string) {
        return this.secureSaveAsync(this.MNEMONIC_KEY, mnemonic);
    }

    static retrieveMnemonic() {
        return this.secureRetrieveAsync(this.MNEMONIC_KEY);
    }

    static async createNewAccount(name: string, privateKey: string, index?: number) {
        const accounts = await this.getAccounts();
        accounts.push({
            type: index ? 'hd' : 'privateKey',
            name: name,
            privateKey: privateKey,
            index: index,
        });
        return this.secureSaveAsync(this.ACCOUNTS_KEY, JSON.stringify(accounts));
    }

    static async getAccounts() {
        const accountsString = await this.secureRetrieveAsync(this.ACCOUNTS_KEY);
        try {
            return JSON.parse(accountsString) || [];
        } catch (e) {
            return [];
        }
    }

    static secureSaveAsync = async (key: string, value: string) => {
        return RNSecureStorage.set(key, value, {
            accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY, // iOS only
        });
    };

    static secureRetrieveAsync = async (key: string) => {
        try {
            const data = await RNSecureStorage.get(key);
            return data;
        } catch (e) {
            return null;
        }
    };

    static clearAllData = async () => {
        await RNSecureStorage.remove(this.MNEMONIC_KEY);
        await RNSecureStorage.remove(this.ACCOUNTS_KEY);
    };
}
