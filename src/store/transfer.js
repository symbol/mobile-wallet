import TransactionService from '@src/services/TransactionService';
import NetworkService from '@src/services/NetworkService';
import { Account } from 'symbol-sdk';

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
        setTransactionHash(state, payload) {
            state.transfer.transaction.hash = payload;
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

        getMaxFee: async ({ state }, payload) => {
            const networkType = NetworkService.getNetworkTypeFromModel(state.network.selectedNetwork);
            const dummyAccount = Account.generateNewAccount(networkType);
            const transactionModel = {
                type: 'transfer',
                recipientAddress: payload.recipientAddress,
                messageText: payload.message,
                messageEncrypted: payload.messageEncrypted,
                mosaics: payload.mosaics,
                fee: payload.fee,
            };
            const ttx = await TransactionService.transactionModelToTransactionObject(transactionModel, dummyAccount, state.network.selectedNetwork);
            const ttxWithFee = TransactionService.calculateMaxFee(ttx, state.network.selectedNetwork, transactionModel.fee);
            return ttxWithFee.maxFee.compact();
        },

        setTransaction: async ({ commit, dispatchAction }, payload) => {
            const transactionModel = {
                type: 'transfer',
                recipientAddress: payload.recipientAddress,
                messageText: payload.message,
                messageEncrypted: payload.messageEncrypted,
                mosaics: payload.mosaics,
                fee: payload.fee,
            };
            const maxFee = await dispatchAction({ type: 'transfer/getMaxFee', payload });

            commit({
                type: 'transfer/setTransaction',
                payload: {
                    ...transactionModel,
                    resolvedFee: maxFee / Math.pow(10, 6),
                    fee: maxFee,
                },
            });
        },

        setTransactionHash: ({ commit }, payload) => {
            commit({ type: 'transfer/setTransactionHash', payload: payload });
        },

        broadcastTransaction: async ({ commit, state, dispatchAction }, payload) => {
            try {
                commit({ type: 'transfer/setLoading', payload: true });
                commit({ type: 'transfer/setError', payload: false });
                await TransactionService.signAndBroadcastTransactionModel(payload, state.wallet.selectedAccount, state.network.selectedNetwork);
                commit({ type: 'transfer/setLoading', payload: false });
                commit({ type: 'transfer/setSuccessfullySent', payload: true });
            } catch (e) {
                console.log(e);
                commit({ type: 'transfer/setError', payload: true });
                commit({ type: 'transfer/setErrorMessage', payload: ErrorHandler.getMessage(e.message) });
            }
        },

        signAggregateBonded: async ({ commit, state, dispatchAction }, payload) => {
            try {
                commit({ type: 'transfer/setLoading', payload: true });
                commit({ type: 'transfer/setError', payload: false });
                await TransactionService.cosignAndBroadcastAggregateTransactionModel(payload, state.wallet.selectedAccount, state.network.selectedNetwork);
                commit({ type: 'transfer/setLoading', payload: false });
                commit({ type: 'transfer/setSuccessfullySent', payload: true });
            } catch (e) {
                console.log(e);
                commit({ type: 'transfer/setError', payload: ErrorHandler.getMessage(e) });
            }
        },

        broadcastSignedTransaction: async ({ commit, state, dispatchAction }, payload) => {
            try {
                await TransactionService.broadcastSignedTransaction(payload, state.network.selectedNetwork);
            } catch (e) {
                console.log(e);
            }
        },

        broadcastCosignatureSignedTransaction: async ({ commit, state, dispatchAction }, payload) => {
            try {
                await TransactionService.broadcastCosignatureSignedTransaction(payload, state.network.selectedNetwork);
            } catch (e) {
                console.log(e);
            }
        },
    },
};
