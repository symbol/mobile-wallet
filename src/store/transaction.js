import FetchTransactionService from '@src/services/FetchTransactionService';
import { transactionAwaitingSignatureByAccount } from '@src/utils/transaction';

export type Filter = 'SENT' | 'RECEIVED' | 'ALL' | 'BLOCKED';

export default {
    namespace: 'transaction',
    state: {
        loading: false,
        isNextLoading: false,
        subscription: null,
        addressFilter: '',
        filter: 'ALL',
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
            state.transaction.filter = payload;
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
            commit({
                type: 'transaction/setAddressFilter',
                payload: state.account.selectedAccountAddress,
            });
            await dispatchAction({ type: 'transaction/reset' });
            try {
                await dispatchAction({ type: 'transaction/loadNextPage' });
                await dispatchAction({
                    type: 'transaction/checkPendingSignatures',
                });
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
        loadNextPage: async ({ commit, dispatchAction, state }) => {
            if (state.transaction.loading) return;
            commit({ type: 'transaction/setLoading', payload: true });
            setTimeout(() => {
                commit({ type: 'transaction/setLoadingNext', payload: true });
            });

            if ((!state.account.cosignatoryOf || !state.account.cosignatoryOf.length) && !!state.account.multisigGraphInfo) {
                await dispatchAction({ type: 'account/loadCosignatoryOf' });
            }

            const nextPage = state.transaction.page + 1;
            try {
                const transactions = await FetchTransactionService.getTransactionsFromAddress(
                    state.transaction.addressFilter,
                    nextPage,
                    state.transaction.filter,
                    state.network.selectedNetwork,
                    state.account.cosignatoryOf
                );

                if (transactions.length === 0) {
                    commit({
                        type: 'transaction/setIsLastPage',
                        payload: true,
                    });
                } else {
                    dispatchAction({
                        type: 'transaction/addTransactions',
                        payload: transactions,
                    });
                }
                commit({ type: 'transaction/setPage', payload: nextPage });
                commit({ type: 'transaction/setLoading', payload: false });
                commit({
                    type: 'transaction/setLoadingNext',
                    payload: false,
                });
            } catch (error) {
                console.log(error);
                commit({
                    type: 'transaction/setLoadingNext',
                    payload: false,
                });
                commit({ type: 'transaction/setLoading', payload: false });
            }
        },
        addTransactions: async ({ commit, state }, transactions) => {
            const { addressBook } = state.addressBook;
            const { filter } = state.transaction;

            const filteredTransactions = transactions.filter(transaction => {
                const contact = addressBook?.getContactByAddress(transaction.signerAddress);

                if (!contact) {
                    return filter !== 'BLOCKED';
                }

                const { isBlackListed } = contact;

                return filter === 'BLOCKED' ? isBlackListed : !isBlackListed;
            });

            commit({
                type: 'transaction/addTransactions',
                payload: filteredTransactions,
            });
        },
        changeFilters: async ({ commit, state, dispatchAction }, { addressFilter, filter }) => {
            if (state.transaction.subscription) {
                state.transaction.subscription.unsubscribe();
            }
            dispatchAction({ type: 'transaction/reset' });
            if (addressFilter)
                commit({
                    type: 'transaction/setAddressFilter',
                    payload: addressFilter,
                });
            if (filter)
                commit({
                    type: 'transaction/setDirectionFilter',
                    payload: filter,
                });
            dispatchAction({ type: 'transaction/loadNextPage' });
        },
        checkPendingSignatures: async ({ commit, state }) => {
            try {
                const { cosignatoryOf, isMultisig } = state.account;
                const { addressFilter, filter } = state.transaction;
                const { selectedNetwork } = state.network;
                const { selectedAccount } = state.wallet;

                const transactions = await FetchTransactionService.getTransactionsFromAddress(
                    addressFilter,
                    1,
                    filter,
                    selectedNetwork,
                    cosignatoryOf
                );
                const transactionAwaitingSignature =
                    !isMultisig &&
                    transactions.some(transaction => transactionAwaitingSignatureByAccount(transaction, selectedAccount, cosignatoryOf));

                commit({ type: 'transaction/setPendingSignature', payload: transactionAwaitingSignature });
            } catch (e) {
                console.log('Failed to checkPendingSignatures', e);
            }
        },
    },
};
