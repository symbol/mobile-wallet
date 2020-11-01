import type { TransactionStatus, TransactionType } from '@src/storage/models/TransactionModel';
import TransactionService from '@src/services/TransactionService';
import AccountService from '@src/services/AccountService';

class ErrorHandler {
    static getMessage(e) {
        return 'Failed to send transaction. The reason is..'; // translation key or already translated
    }
}

export default {
    namespace: 'transfer',
    state: {
        isLoading: false,
        isError: false,
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
                    messageEncrypted: false,
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
                commit({ type: 'transfer/setError', payload: ErrorHandler.getMessage(e) });
            }
        },
    },
};
