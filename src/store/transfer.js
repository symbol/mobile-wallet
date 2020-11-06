import type { TransactionStatus, TransactionType } from '@src/storage/models/TransactionModel';
import TransactionService from '@src/services/TransactionService';
import AccountService from '@src/services/AccountService';

class ErrorHandler {
    static getMessage(e) {
        return 'Failed to send transaction.\n' + e; // translation key or already translated
    }
}

export default {
    namespace: 'transfer',
    state: {
        isLoading: false,
        isError: false,
        errorMessage: '',
        isSuccessfullySent: false,
        transaction: {
            preview: {},
            signedTransaction: {},
        },
    },
    mutations: {
        setLoading(state, payload) {
            state.transfer.isLoading = payload;
            return state;
        },
        setError(state, payload) {
            state.transfer.isError = payload;
            return state;
        },
        setErrorMessage(state, payload) {
            state.transfer.errorMessage = payload;
            return state;
        },
        setSuccessfullySent(state, payload) {
            state.transfer.isSuccessfullySent = payload;
            return state;
        },
        setTransaction(state, payload) {
            state.transfer.transaction = payload;
            return state;
        },
    },
    actions: {
        clear: ({ commit }) => {
            commit({ type: 'transfer/setLoading', payload: false });
            commit({ type: 'transfer/setError', payload: false });
            commit({ type: 'transfer/setErrorMessage', payload: '' });
            commit({ type: 'transfer/setSuccessfullySent', payload: false });
            commit({ type: 'transfer/setTransaction', payload: {} });
        },

        setTransaction: ({ commit }, payload) => {
            commit({
                type: 'transfer/setTransaction',
                payload: {
                    type: 'transfer',
                    recipientAddress: payload.recipientAddress,
                    messageText: payload.message,
                    messageEncrypted: payload.isEncrypted,
                    mosaics: payload.mosaics,
                    fee: payload.fee,
                },
            });
        },

        broadcastTransaction: async ({ commit, state, dispatchAction }, payload) => {
            try {
                commit({ type: 'transfer/setLoading', payload: true });
                commit({ type: 'transfer/setError', payload: false });
                await TransactionService.signAndBroadcastTransactionModel(payload, state.account.selectedAccount, state.network.selectedNetwork);
                commit({ type: 'transfer/setLoading', payload: false });
                commit({ type: 'transfer/setSuccessfullySent', payload: true });
            } catch (e) {
                console.log(e);
                commit({ type: 'transfer/setError', payload: true });
                commit({ type: 'transfer/setErrorMessage', payload: ErrorHandler.getMessage(e.message) });
            }
        },
    },
};
