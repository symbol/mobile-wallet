import AccountService from '@src/services/AccountService';
import { AccountSecureStorage } from '@src/storage/persistence/AccountSecureStorage';
import { MnemonicSecureStorage } from '@src/storage/persistence/MnemonicSecureStorage';
import type { TransactionModel } from '@src/storage/models/TransactionModel';

export default {
    namespace: 'account',
    state: {
        selectedAccount: null,
        balance: 0,
        transactions: [],
    },
    mutations: {
        setSelectedAccount(state, payload) {
            state.account.selectedAccount = payload;
            return state;
        },
        setBalance(state, payload) {
            state.account.balance = payload;
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
            let accountModel;
            if (id) {
                accountModel = await AccountSecureStorage.getAccountById(id);
            } else {
                accountModel = (await AccountSecureStorage.getAllAccounts())[0];
            }
            commit({ type: 'account/setSelectedAccount', payload: accountModel });
            await dispatchAction({ type: 'account/loadBalance' });
            await dispatchAction({ type: 'account/loadTransactions' });
        },
        loadBalance: async ({ commit, state }) => {
            const address = await AccountService.getAddressByAccountModelAndNetwork(state.account.selectedAccount, state.network.network);
            const balance = await AccountService.getBalanceFromAddress(address, state.network.selectedNode);
            commit({ type: 'account/setBalance', payload: balance });
        },
        loadTransactions: async ({ commit, state }) => {
            const address = await AccountService.getAddressByAccountModelAndNetwork(state.account.selectedAccount, state.network.network);
            const transactions = await AccountService.getTransactionsFromAddress(address, state.network.selectedNode);
            commit({ type: 'account/setTransactions', payload: transactions });
        },
    },
};
