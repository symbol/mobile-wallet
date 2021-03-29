import OptInService from '@src/services/OptInService';
import {NIS1AccountSecureStorage} from "@src/storage/persistence/NIS1AccountSecureStorage";

export default {
    namespace: 'optin',
    state: {
        nis1Accounts: [],
        nisAddressOptInBalance: {},
        selectedNIS1Account: null,
        selectedOptInStatus: {
            balance: undefined,
            status: undefined,
            error: undefined,
            destination: undefined,
        },
        selectedSymbolAccount: null,
        error: null,
        loading: true,
    },
    mutations: {
        setNisAddressOptInBalance(state, payload) {
            state.optin.nisAddressOptInBalance = payload;
            return state;
        },
        setNisAccounts(state, payload) {
            state.optin.nis1Accounts = payload;
            return state;
        },
        setLoading(state, payload) {
            state.optin.loading = payload;
            return state;
        },
        setError(state, payload) {
            state.optin.error = payload;
            return state;
        },
        setSelectedNIS1Account(state, payload) {
            state.optin.selectedNIS1Account = payload;
            return state;
        },
        setSelectedOptInStatus(state, payload) {
            state.optin.selectedOptInStatus = payload;
            return state;
        },
        setSelectedSymbolAccount(state, payload) {
            state.optin.selectedSymbolAccount = payload;
            return state;
        },
    },
    actions: {
        load: async ({ commit, dispatchAction, state }, payload) => {
            commit({ type: 'optin/setError', payload: null });
            commit({ type: 'optin/setLoading', payload: true });
            const nis1Accounts = await OptInService.getNISAccounts(state.network.selectedNetwork.type);
            commit({ type: 'optin/setNisAccounts', payload: nis1Accounts });
            commit({ type: 'optin/setLoading', payload: false });
        },
        addPrivateKey: async ({ commit, dispatchAction, state }, payload) => {
            await OptInService.addNISAccount(payload);
            await dispatchAction({ type: 'optin/load' });
        },
        removeNIS1Account: async ({ commit, dispatchAction, state }, payload) => {
            await OptInService.removeNIS1Account(payload);
            await dispatchAction({ type: 'optin/load' });
        },
        loadNIS1Account: async ({ commit, state }, payload) => {
            commit({ type: 'optin/setLoading', payload: true });
            commit({ type: 'optin/setError', payload: null });
            const selectedAccount = state.optin.nis1Accounts[payload];
            commit({ type: 'optin/setSelectedNIS1Account', payload: selectedAccount });
            const optinData = await OptInService.getOptInStatus(selectedAccount.address, state.network.selectedNetwork.type);
            commit({ type: 'optin/setSelectedOptInStatus', payload: optinData });
            commit({ type: 'optin/setLoading', payload: false });
        },
        doOptIn: async ({ commit, state }, payload) => {
            commit({ type: 'optin/setLoading', payload: true });
            try {
                await OptInService.doSimpleOptIn(state.optin.selectedNIS1Account, state.optin.selectedSymbolAccount, state.network.selectedNetwork.type);
                commit({ type: 'optin/setError', payload: null });
            } catch (e) {
                commit({ type: 'optin/setError', payload: e.toString() });
            }
            commit({ type: 'optin/setLoading', payload: false });
        },
    },
};
