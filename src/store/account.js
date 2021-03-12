import AccountService from '@src/services/AccountService';
import { from } from 'rxjs';
import { GlobalListener } from '@src/store/index';

export default {
    namespace: 'account',
    state: {
        refreshingObs: null,
        selectedAccount: {},
        selectedAccountAddress: '',
        loading: true,
        balance: 0,
        isMultisig: false,
        ownedMosaics: [],
        accounts: [],
        cosignatoryOf: [],
        pendingSignature: false,
    },
    mutations: {
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
        setBalance(state, payload) {
            state.account.balance = payload;
            return state;
        },
        setIsMultisig(state, payload) {
            state.account.isMultisig = payload;
            return state;
        },
        setOwnedMosaics(state, payload) {
            state.account.ownedMosaics = payload;
            return state;
        },
        setCosignatoryOf(state, payload) {
            state.account.cosignatoryOf = payload;
            return state;
        },
    },
    actions: {
        loadAllData: async ({ commit, dispatchAction, state }, reset) => {
            try {
                commit({ type: 'account/setLoading', payload: true });
                const address = AccountService.getAddressByAccountModelAndNetwork(state.wallet.selectedAccount, state.network.network);
                commit({ type: 'account/setSelectedAccountAddress', payload: address });
                dispatchAction({ type: 'transaction/init' });
                if (reset) {
                    commit({ type: 'account/setBalance', payload: 0 });
                    commit({ type: 'account/setOwnedMosaics', payload: [] });
                }
                if (state.account.refreshingObs) {
                    state.account.refreshingObs.unsubscribe();
                }
                await dispatchAction({type: 'account/loadBalance'});
                dispatchAction({type: 'harvesting/init'});
                dispatchAction({type: 'account/loadCosignatoryOf'});
                commit({ type: 'account/setLoading', payload: false });
            } catch (e) {
                commit({ type: 'account/setLoading', payload: false });
                console.log(e);
            }
        },
        loadBalance: async ({ commit, state }) => {
            const address = await AccountService.getAddressByAccountModelAndNetwork(state.wallet.selectedAccount, state.network.network);
            const { balance, ownedMosaics } = await AccountService.getBalanceAndOwnedMosaicsFromAddress(address, state.network.selectedNetwork);
            commit({ type: 'account/setBalance', payload: balance });
            commit({ type: 'account/setOwnedMosaics', payload: ownedMosaics });
        },
        loadCosignatoryOf: async ({ commit, state }) => {
            const address = AccountService.getAddressByAccountModelAndNetwork(state.wallet.selectedAccount, state.network.network);
            const msigInfo = await AccountService.getCosignatoryOfByAddress(address, state.network.selectedNetwork);

            for (let cosignatoryOf of msigInfo.cosignatoryOf) {
                GlobalListener.addConfirmed(cosignatoryOf);
                GlobalListener.addUnconfirmed(cosignatoryOf);
            }
            commit({ type: 'account/setCosignatoryOf', payload: msigInfo.cosignatoryOf });
            commit({ type: 'account/setIsMultisig', payload: msigInfo.isMultisig });
        },
    },
};
