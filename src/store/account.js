import AccountService from '@src/services/AccountService';
import FetchTransactionService from '@src/services/FetchTransactionService';
import { Pagination, getStateFromManagers, getMutationsFromManagers } from '@src/utils/DataManager';
import {from} from 'rxjs';

const fetchAccountTransactions = async ({ state, commit }) => {
    const address = await AccountService.getAddressByAccountModelAndNetwork(state.wallet.selectedAccount, state.network.selectedNetwork.type);
    const transactionsByAddress = await FetchTransactionService.getTransactionsFromAddresses(
        [address, ...state.account.cosignatoryOf],
        state.network.selectedNetwork
    );
    const someSignaturePending = Object.values(transactionsByAddress).reduce((acc, txs) => {
        const needsSig = FetchTransactionService.checkIfTransactionsNeedsSignature(state.wallet.selectedAccount.id, txs);
        return acc || needsSig;
    }, false);
    commit({ type: 'account/setPendingSignature', payload: someSignaturePending });
    return { data: transactionsByAddress };
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
        refreshingObs: null,
        selectedAccount: {},
        selectedAccountAddress: '',
        loading: false,
        loadingTransactions: false,
        balance: 0,
        ownedMosaics: [],
        transactions: {},
        accounts: [],
        cosignatoryOf: [],
        cosignatoryTransactions: {},
        pendingSignature: false,
    },
    mutations: {
        ...getMutationsFromManagers(managers, 'account'),
        setRefreshingObs(state, payload) {
            state.account.refreshingObs = payload;
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
        setCosignatoryOf(state, payload) {
            state.account.cosignatoryOf = payload;
            return state;
        },
        setPendingSignature(state, payload) {
            state.account.pendingSignature = payload;
            return state;
        },
    },
    actions: {
        loadAllData: async ({ commit, dispatchAction, state }, reset) => {
            commit({ type: 'account/setLoading', payload: true });
            const address = AccountService.getAddressByAccountModelAndNetwork(state.wallet.selectedAccount, state.network.network);
            commit({ type: 'account/setSelectedAccountAddress', payload: address });
            if (reset) {
                commit({ type: 'account/setBalance', payload: 0 });
                commit({ type: 'account/setOwnedMosaics', payload: [] });
                commit({ type: 'account/setTransactions', payload: [] });
            }
            if (state.account.refreshingObs) {
                state.account.refreshingObs.unsubscribe();
            }
            const refreshingObs = from(
                new Promise(async resolve => {
                    await Promise.all([
                        dispatchAction({ type: 'account/loadBalance' }),
                        dispatchAction({ type: 'account/loadCosignatoryOf' }),
                        dispatchAction({ type: 'harvesting/init' }),
                    ]);
                    await dispatchAction({ type: 'account/loadTransactions' });
                    resolve();
                })
            ).subscribe(() => {
                //state.account.transactionListManager.reset();
                commit({ type: 'account/setRefreshingObs', payload: false });
                commit({ type: 'account/setLoading', payload: false });
            });
            commit({ type: 'account/setRefreshingObs', payload: refreshingObs });
        },
        loadBalance: async ({ commit, state }) => {
            const address = await AccountService.getAddressByAccountModelAndNetwork(state.wallet.selectedAccount, state.network.network);
            const { balance, ownedMosaics } = await AccountService.getBalanceAndOwnedMosaicsFromAddress(address, state.network.selectedNetwork);
            commit({ type: 'account/setBalance', payload: balance });
            commit({ type: 'account/setOwnedMosaics', payload: ownedMosaics });
        },
        loadTransactions: async store => {
            await store.state.account.transactionListManager.setStore(store, 'account').initialFetch();
            await store.state.account.transactionListManager.reset();
        },
        loadCosignatoryOf: async ({ commit, state }) => {
            const address = AccountService.getAddressByAccountModelAndNetwork(state.wallet.selectedAccount, state.network.network);
            const cosignatoryOf = await AccountService.getCosignatoryOfByAddress(address, state.network.selectedNetwork);
            commit({ type: 'account/setCosignatoryOf', payload: cosignatoryOf });
        },
    },
};
