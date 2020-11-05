import AccountService from '@src/services/AccountService';
import { AccountSecureStorage } from '@src/storage/persistence/AccountSecureStorage';
import { MnemonicSecureStorage } from '@src/storage/persistence/MnemonicSecureStorage';
import type { TransactionModel } from '@src/storage/models/TransactionModel';

export default {
    namespace: 'account',
    state: {
        selectedAccount: null,
        loading: false,
        balance: 0,
        ownedMosaics: [],
        transactions: [],
    },
    mutations: {
        setSelectedAccount(state, payload) {
            state.account.selectedAccount = payload;
            return state;
        },
        setLoading(state, payload) {
            state.account.loading = payload;
            return state;
        },
        setBalance(state, payload) {
            state.account.balance = payload;
            return state;
        },
        setOwnedMosaics(state, payload) {
            state.account.ownedMosaics = payload;
            return state;
        },
        setTransactions(state, payload) {
            state.account.transactions = payload;
            return state;
        },
    },
    actions: {
        createHdAccount: async ({ commit, state, dispatchAction }, { index, name }) => {
            const mnemonic = await MnemonicSecureStorage.retrieveMnemonic();
            const accountModel = AccountService.createFromMnemonicAndIndex(mnemonic, index, name);
            await AccountSecureStorage.createNewAccount(accountModel);
            dispatchAction({ type: 'account/loadAccount', payload: accountModel.id });
        },
        loadAccount: async ({ commit, dispatchAction, state }, id) => {
            commit({ type: 'account/setLoading', payload: true });
            let accountModel;
            if (id) {
                accountModel = await AccountSecureStorage.getAccountById(id);
            } else {
                accountModel = (await AccountSecureStorage.getAllAccounts())[0];
            }
            commit({ type: 'account/setSelectedAccount', payload: accountModel });
            await dispatchAction({ type: 'account/loadBalance' });
            await dispatchAction({ type: 'account/loadTransactions' });
            commit({ type: 'account/setLoading', payload: false });
        },
        loadBalance: async ({ commit, state }) => {
            const address = await AccountService.getAddressByAccountModelAndNetwork(state.account.selectedAccount, state.network.network);
            const { balance, ownedMosaics } = await AccountService.getBalanceAndOwnedMosaicsFromAddress(address, state.network.selectedNetwork);
            commit({ type: 'account/setBalance', payload: balance });
            commit({ type: 'account/setOwnedMosaics', payload: ownedMosaics });
        },
        loadTransactions: async ({ commit, state }) => {
            const address = await AccountService.getAddressByAccountModelAndNetwork(state.account.selectedAccount, state.network.network);
            const transactions = await AccountService.getTransactionsFromAddress(address, state.network.selectedNetwork);
            commit({ type: 'account/setTransactions', payload: transactions });
        },
    },
};
