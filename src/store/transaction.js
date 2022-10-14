import FetchTransactionService from '@src/services/FetchTransactionService';
import { transactionAwaitingSignatureByAccount } from '@src/utils/transaction';

export default {
    namespace: 'transaction',
    state: {
        isLoading: false,
        addressFilter: '',
        filter: 'ALL',
        transactions: [],
        pageNumber: 0,
        isLastPage: false,
        pendingSignature: false,
    },
    mutations: {
        setLoading(state, payload) {
            state.transaction.isLoading = payload;
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
        setPageNumber(state, payload) {
            state.transaction.pageNumber = payload;
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
        init: async ({ dispatchAction }) => {
            await dispatchAction({ type: 'transaction/reset' });
            try {
                await dispatchAction({ type: 'transaction/loadNextPage' });
                await dispatchAction({ type: 'transaction/checkPendingSignatures' });
            } catch (e) {
                await dispatchAction({ type: 'transaction/reset' });
            }
        },
        reset: async ({ commit, state }) => {
            const { selectedAccountAddress } = state.account;
            commit({ type: 'transaction/setAddressFilter', payload: selectedAccountAddress });
            commit({ type: 'transaction/setPageNumber', payload: 0 });
            commit({ type: 'transaction/setLoading', payload: false });
            commit({ type: 'transaction/setIsLastPage', payload: false });
            commit({ type: 'transaction/setTransactions', payload: [] });
        },
        loadNextPage: async ({ commit, dispatchAction, state }) => {
            const { addressFilter, filter, isLoading, pageNumber } = state.transaction;
            const { cosignatoryOf, multisigGraphInfo } = state.account;
            const { selectedNetwork } = state.network;
            const nextPage = pageNumber + 1;

            if (isLoading) return;

            commit({ type: 'transaction/setLoading', payload: true });

            if ((!cosignatoryOf || !cosignatoryOf.length) && !!multisigGraphInfo) {
                await dispatchAction({ type: 'account/loadCosignatoryOf' });
            }

            try {
                const transactions = await FetchTransactionService.getTransactionsFromAddress(
                    addressFilter,
                    nextPage,
                    filter,
                    selectedNetwork,
                    cosignatoryOf
                );

                if (transactions.length === 0) {
                    commit({ type: 'transaction/setIsLastPage', payload: true });
                } else {
                    dispatchAction({
                        type: 'transaction/addTransactions',
                        payload: transactions,
                    });
                }
                commit({ type: 'transaction/setPageNumber', payload: nextPage });
                commit({ type: 'transaction/setLoading', payload: false });
            } catch (error) {
                commit({ type: 'transaction/setLoading', payload: false });
                throw error;
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

            commit({ type: 'transaction/addTransactions', payload: filteredTransactions });
        },
        changeFilters: async ({ commit, dispatchAction }, { addressFilter, filter }) => {
            dispatchAction({ type: 'transaction/reset' });
            if (addressFilter) {
                commit({ type: 'transaction/setAddressFilter', payload: addressFilter });
            }
            if (filter) {
                commit({ type: 'transaction/setDirectionFilter', payload: filter });
            }
            dispatchAction({ type: 'transaction/loadNextPage' });
        },
        checkPendingSignatures: async ({ commit, state }) => {
            try {
                const { addressBook } = state.addressBook;
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
                const isTransactionAwaitingSignature =
                    !isMultisig &&
                    transactions.some(
                        transaction =>
                            !addressBook.getContactByAddress(transaction.signerAddress)?.isBlackListed &&
                            transactionAwaitingSignatureByAccount(transaction, selectedAccount, cosignatoryOf)
                    );

                commit({ type: 'transaction/setPendingSignature', payload: isTransactionAwaitingSignature });
            } catch (e) {
                console.log('Failed to checkPendingSignatures', e);
            }
        },
    },
};
