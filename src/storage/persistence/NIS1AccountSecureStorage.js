import { BaseSecureStorage } from '@src/storage/persistence/BaseSecureStorage';

export class NIS1AccountSecureStorage extends BaseSecureStorage {
    /** NIS1ACCOUNTS KEY **/
    static NIS1ACCOUNTS_KEY = 'nisaccounts';

    /**
     * Save account
     * @returns {Promise<string | null>}
     * @param privateKey
     */
    static async saveAccount(privateKey: string): Promise<string> {
        let accounts = [];
        try {
            const raw = await this.secureRetrieveAsync(this.NIS1ACCOUNTS_KEY);
            accounts = JSON.parse(raw);
        } catch (e) {}
        if (!accounts) accounts = [];
        if (accounts.find(account => account.privateKey === privateKey)) return accounts;
        accounts.push({ privateKey: privateKey, address: '' });
        await this.secureSaveAsync(this.NIS1ACCOUNTS_KEY, JSON.stringify(accounts));
        return accounts;
    }

    /**
     * Retrieves accounts
     * @returns {Promise<string[]>}
     */
    static async removeAccount(privateKey: string): Promise<void> {
        const privateKeys = await this.retrieveAccounts();
        const filtered = privateKeys.filter(pk => pk !== privateKey);
        const accountsFiltered = filtered.map(pk => ({ privateKey: pk }));
        await this.secureSaveAsync(this.NIS1ACCOUNTS_KEY, JSON.stringify(accountsFiltered));
    }

    /**
     * Retrieves accounts
     * @returns {Promise<string[]>}
     */
    static async retrieveAccounts(): Promise<string[]> {
        try {
            const accounts = JSON.parse(await this.secureRetrieveAsync(this.NIS1ACCOUNTS_KEY));
            return accounts.map(account => account.privateKey);
        } catch (e) {
            return [];
        }
    }

    /**
     * Clear all keys
     * @returns {Promise<string | null>}
     */
    static clear() {
        return this.removeKey(this.NIS1ACCOUNTS_KEY);
    }
}
