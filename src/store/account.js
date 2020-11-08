import AccountService from '@src/services/AccountService';
import { AccountSecureStorage } from '@src/storage/persistence/AccountSecureStorage';
import { MnemonicSecureStorage } from '@src/storage/persistence/MnemonicSecureStorage';
import type { TransactionModel } from '@src/storage/models/TransactionModel';
import FetchTransactionService from '@src/services/FetchTransactionService';
import { Pagination, getStateFromManagers, getMutationsFromManagers } from '@src/utils/DataManager';

const fetchAccountTransactions = async ({ state }) => {
    const address = await AccountService.getAddressByAccountModelAndNetwork(state.wallet.selectedAccount, state.network.selectedNetwork.type);
    const transactions = await FetchTransactionService.getTransactionsFromAddress(address, state.network.selectedNetwork);
    return { data: transactions };
};

const managers = [
    new Pagination({
        name: 'transactionListManager',
        fetchFunction: (pageInfo, store) => fetchAccountTransactions(store, pageInfo),
        pageInfo: {
            pageSize: 15,
        },
        errorMessage: 'Failed to fetch transaction list',
    }),
];

export default {
    namespace: 'account',
    state: {
        ...getStateFromManagers(managers),
        selectedAccount: {},
        selectedAccountAddress: '',
        loading: false,
        loadingTransactions: false,
        balance: 0,
        ownedMosaics: [],
        transactions: [],
        accounts: [],
    },
    mutations: {
        ...getMutationsFromManagers(managers, 'account'),
        setSelectedAccountAddress(state, payload) {
            state.account.selectedAccountAddress = payload;
            return state;
        },
        setLoading(state, payload) {
            state.account.loading = payload;
            return state;
        },
        setLoadingTransactions(state, payload) {
            state.account.loadingTransactions = payload;
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
        loadAllData: async ({ commit, dispatchAction, state }) => {
            commit({ type: 'account/setLoading', payload: true });
            const address = AccountService.getAddressByAccountModelAndNetwork(state.wallet.selectedAccount, state.network.network);
            commit({ type: 'account/setSelectedAccountAddress', payload: address });
            commit({ type: 'account/setBalance', payload: 0 });
            commit({ type: 'account/setOwnedMosaics', payload: [] });
            commit({ type: 'account/setTransactions', payload: [] });
            await dispatchAction({ type: 'account/loadBalance' });
            await dispatchAction({ type: 'account/loadTransactions' });
            commit({ type: 'account/setLoading', payload: false });
        },
        loadBalance: async ({ commit, state }) => {
            const address = await AccountService.getAddressByAccountModelAndNetwork(state.wallet.selectedAccount, state.network.network);
            const { balance, ownedMosaics } = await AccountService.getBalanceAndOwnedMosaicsFromAddress(address, state.network.selectedNetwork);
            commit({ type: 'account/setBalance', payload: balance });
            commit({ type: 'account/setOwnedMosaics', payload: ownedMosaics });
        },
        loadTransactions: async store => {
            store.state.account.transactionListManager.setStore(store, 'account').initialFetch();
        },
    },
};
