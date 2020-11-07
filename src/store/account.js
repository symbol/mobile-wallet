import AccountService from '@src/services/AccountService';
import { AccountSecureStorage } from '@src/storage/persistence/AccountSecureStorage';
import { MnemonicSecureStorage } from '@src/storage/persistence/MnemonicSecureStorage';
import type { TransactionModel } from '@src/storage/models/TransactionModel';
import FetchTransactionService from '@src/services/FetchTransactionService';
import { Pagination, getStateFromManagers, getMutationsFromManagers } from '@src/utils/DataManager';

const fetchAccountTransactions = async ({ state }) => {
    const address = await AccountService.getAddressByAccountModelAndNetwork(state.account.selectedAccount, state.network.selectedNetwork.type);
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
        setAccounts(state, payload) {
            state.account.accounts = payload;
            return state;
        },
        setSelectedAccount(state, payload) {
            state.account.selectedAccount = payload;
            return state;
        },
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
        initState: async ({ commit, state, dispatchAction }) => {
            const accounts = await AccountSecureStorage.getAllAccounts();
            commit({ type: 'account/setAccounts', payload: accounts });
            if (accounts.length > 0) {
                await dispatchAction({ type: 'account/loadAccount' });
            }
        },
        createHdAccount: async ({ commit, state, dispatchAction }, { index, name }) => {
            const mnemonicModel = await MnemonicSecureStorage.increaseLastBipDerivedPath();
            const accountModel = AccountService.createFromMnemonicAndIndex(mnemonicModel.mnemonic, index || mnemonicModel.lastIndexDerived, name);
            await AccountSecureStorage.createNewAccount(accountModel);
            const accounts = await AccountSecureStorage.getAllAccounts();
            commit({ type: 'account/setAccounts', payload: accounts });
            await dispatchAction({ type: 'account/loadAccount', payload: accountModel.id });
        },
        loadAccount: async ({ commit, dispatchAction, state }, id) => {
            commit({ type: 'account/setLoading', payload: true });
            let accountModel;
            if (id) {
                accountModel = await AccountSecureStorage.getAccountById(id);
            } else {
                accountModel = (await AccountSecureStorage.getAllAccounts())[0];
            }
            const address = AccountService.getAddressByAccountModelAndNetwork(accountModel, state.network.network);
            commit({ type: 'account/setSelectedAccountAddress', payload: address });
            commit({ type: 'account/setSelectedAccount', payload: accountModel });
            commit({ type: 'account/setBalance', payload: 0 });
            commit({ type: 'account/setOwnedMosaics', payload: [] });
            commit({ type: 'account/setTransactions', payload: [] });
            await dispatchAction({ type: 'account/loadBalance' });
            await dispatchAction({ type: 'account/loadTransactions' });
            commit({ type: 'account/setLoading', payload: false });
        },
        removeAccount: async ({ commit, dispatchAction, state }, id) => {
            commit({ type: 'account/setLoading', payload: true });
            const accounts = await AccountService.removeAccountById(id);
            commit({ type: 'account/setAccounts', payload: accounts });
            commit({ type: 'account/setLoading', payload: false });
        },
        loadBalance: async ({ commit, state }) => {
            const address = await AccountService.getAddressByAccountModelAndNetwork(state.account.selectedAccount, state.network.network);
            const { balance, ownedMosaics } = await AccountService.getBalanceAndOwnedMosaicsFromAddress(address, state.network.selectedNetwork);
            commit({ type: 'account/setBalance', payload: balance });
            commit({ type: 'account/setOwnedMosaics', payload: ownedMosaics });
        },
        loadTransactions: async store => {
            store.state.account.transactionListManager.setStore(store, 'account').initialFetch();
        },
    },
};
