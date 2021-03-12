import FetchTransactionService from '@src/services/FetchTransactionService';
import { from } from 'rxjs';

export type DirectionFilter = 'SENT' | 'RECEIVED' | 'ALL';

export default {
    namespace: 'transaction',
    state: {
		loading: false,
		isNextLoading: false,
        subscription: null,
        addressFilter: '',
        directionFilter: 'ALL',
        transactions: [],
        page: 0,
        isLastPage: false,
        pendingSignature: false,
    },
    mutations: {
        setLoading(state, payload) {
            state.transaction.loading = payload;
            return state;
		},
		setLoadingNext(state, payload) {
			state.transaction.isNextLoading = payload;
            return state;
		},
        setSubscription(state, payload) {
            state.transaction.subscription = payload;
            return state;
        },
        setAddressFilter(state, payload) {
            state.transaction.addressFilter = payload;
            return state;
        },
        setDirectionFilter(state, payload) {
            state.transaction.directionFilter = payload;
            return state;
        },
        setTransactions(state, payload) {
            state.transaction.transactions = payload;
            return state;
        },
        addTransactions(state, payload) {
            state.transaction.transactions.push(...payload);
            return state;
        },
        setPage(state, payload) {
            state.transaction.page = payload;
            return state;
        },
        setIsLastPage(state, payload) {
            state.transaction.isLastPage = payload;
            return state;
        },
        setPendingSignature(state, payload) {
            state.transaction.pendingSignature = payload;
            return state;
        },
    },
    actions: {
        init: async ({ commit, state, dispatchAction }) => {
            commit({ type: 'transaction/setAddressFilter', payload: state.account.selectedAccountAddress });
            await dispatchAction({ type: 'transaction/reset' });
            try {
                await dispatchAction({ type: 'transaction/loadNextPage' });
                await dispatchAction({ type: 'transaction/checkPendingSignatures' });
            } catch (e) {
                await dispatchAction({ type: 'transaction/reset' });
            }
        },
        reset: async ({ commit }) => {
            commit({ type: 'transaction/setPage', payload: 0 });
            commit({ type: 'transaction/setLoading', payload: false });
            commit({ type: 'transaction/setIsLastPage', payload: false });
            commit({ type: 'transaction/setTransactions', payload: [] });
        },
        loadNextPage: async ({ commit, state }) => {
			if (state.transaction.loading) return;
			commit({ type: 'transaction/setLoading', payload: true });
            setTimeout(() => {
				commit({ type: 'transaction/setLoadingNext', payload: true });
			});
            const nextPage = state.transaction.page + 1;
            const subscription = from(
                FetchTransactionService.getTransactionsFromAddress(
                    state.transaction.addressFilter,
                    nextPage,
                    state.transaction.directionFilter,
                    state.network.selectedNetwork
                )
            ).subscribe(
                transactions => {
                    if (transactions.length === 0) {
                        commit({ type: 'transaction/setIsLastPage', payload: true });
                    } else {
                        commit({ type: 'transaction/addTransactions', payload: transactions });
                    }
                    commit({ type: 'transaction/setPage', payload: nextPage });
					commit({ type: 'transaction/setLoading', payload: false });
					commit({ type: 'transaction/setLoadingNext', payload: false })
                },
                error => {
					console.log(error);
					commit({ type: 'transaction/setLoadingNext', payload: false });
                    commit({ type: 'transaction/setLoading', payload: false });
				}
            );
            commit({ type: 'transaction/setSubscription', payload: subscription });
        },
        changeFilters: async ({ commit, state, dispatchAction }, { addressFilter, directionFilter }) => {
            if (state.transaction.subscription) {
                state.transaction.subscription.unsubscribe();
            }
            dispatchAction({ type: 'transaction/reset' });
            if (addressFilter) commit({ type: 'transaction/setAddressFilter', payload: addressFilter });
            if (directionFilter) commit({ type: 'transaction/setDirectionFilter', payload: directionFilter });
            dispatchAction({ type: 'transaction/loadNextPage' });
        },
        checkPendingSignatures: async ({ commit, state }) => {
            let has = await FetchTransactionService.hasAddressPendingSignatures(state.account.selectedAccountAddress, state.network.selectedNetwork);
            for (let address of state.account.cosignatoryOf) {
                let cosigHas = await FetchTransactionService.hasAddressPendingSignatures(address, state.network.selectedNetwork);
                has = has || cosigHas;
            }
            commit({ type: 'transaction/setPendingSignature', payload: has });
        },
    },
};
