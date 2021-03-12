import { BaseSecureStorage } from '@src/storage/persistence/BaseSecureStorage';
import type { AccountModel } from '@src/storage/models/AccountModel';
import type {AppNetworkType} from "@src/storage/models/NetworkModel";

export class AccountSecureStorage extends BaseSecureStorage {
    /** ACCOUNTS DB KEY **/
    static ACCOUNTS_KEY = 'ACCOUNTS';

    /**
     * Creates a new account
     * @returns {Promise<AccountModel>}
     * @param account
     */
    static async createNewAccount(account: AccountModel): Promise<AccountModel> {
        const accounts = await this.getAllAccounts();
        if (!accounts.find(el => el.id === account.id && el.network === account.network)) {
            accounts.push(account);
        }
        return this.saveAccounts(accounts);
    }

    /**
     * Creates a new account
     * @returns {Promise<any>}
     * @param accounts
     */
    static async saveAccounts(accounts: AccountModel[]): Promise<any> {
        return this.secureSaveAsync(this.ACCOUNTS_KEY, JSON.stringify(accounts));
    }

    /**
     * Updates account
     * @param newAccount
     * @returns {Promise<*>}
     */
    static async updateAccount(newAccount: AccountModel): Promise<any> {
        const allAccounts = await this.getAllAccounts();
        const edited = allAccounts.map(account => {
            if (account.id === newAccount.id) {
                return newAccount;
            } else {
                return account;
            }
        });
        return this.saveAccounts(edited);
    }

    /**
     * Removes an account by its id and network
     * @param id
     * @param network
     * @returns {Promise<*>}
     */
    static async removeAccount(id: string, network: AppNetworkType): Promise<AccountModel[]> {
        const allAccounts = await this.getAllAccounts();
        const filteredAccounts = allAccounts.filter(account => !(account.id === id && account.network === network));
        await this.saveAccounts(filteredAccounts);
        return filteredAccounts;
    }

    /**
     * Returns all accounts
     * @returns {Promise<void>}
     */
    static async getAllAccounts(): Promise<AccountModel[]> {
        const accountsString = await this.secureRetrieveAsync(this.ACCOUNTS_KEY);
        try {
            return JSON.parse(accountsString) || [];
        } catch (e) {
            return [];
        }
    }

    /**
     * Get all the accounts
     * @returns {Promise<AccountModel[]>}
     */
    static async getAllAccountsByNetwork(network: AppNetworkType): Promise<AccountModel[]> {
        const allAccounts = await this.getAllAccounts();
        return allAccounts.filter(el => el.network === network);
    }

    /**
     * Get all the accounts
     * @returns {Promise<AccountModel[]>}
     */
    static async getAccountById(id: number, network: AppNetworkType): Promise<AccountModel | null> {
        const accounts = await this.getAllAccountsByNetwork(network);
        return accounts.find(account => account.id === id);
    }

    /**
     * Clear all keys
     * @returns {Promise<string | null>}
     */
    static clear() {
        return this.removeKey(this.ACCOUNTS_KEY);
    }
}
