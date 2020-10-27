import TransactionBuilder from '@src/utils/TransactionBuilder';

class TransactionService {
	static announceTransaction = signedTransaction => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5000);
		})
	}
};

class ErrorHandler {
	static getMessage(e) {
		return 'Failed to send transaction. The reason is..' // translation key or already translated
	}
};

export default {
	namespace: 'transfer',
	state: {
		isLoading: false,
		isError: false,
		isSuccessfullySent: false,
		transaction: {
			preview: {},
			signedTransaction: {}
		}
	},
	mutations: {
		setLoading(state, payload) {
			state.transfer.loading = payload;
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
		clear: ({commit}) => {
			commit({type: 'transfer/setLoading', payload: false});
			commit({type: 'transfer/setError', payload: false});
			commit({type: 'transfer/setSuccessfullySent', payload: false});
			commit({type: 'transfer/setTransaction', payload: {}});
		},

		signTransaction: ({commit}, payload) => {
			const transaction = TransactionBuilder.transfer({}); // mock
			commit({type: 'transfer/setTransaction', payload: transaction});
		},

		announceTransaction: async ({commit, dispatchAction}, payload) => {
			try {
				commit({type: 'transfer/setLoading', payload: true});
				commit({type: 'transfer/setError', payload: false});
				await TransactionService.announceTransaction(payload);
				commit({type: 'transfer/setLoading', payload: false});
				commit({type: 'transfer/setSuccessfullySent', payload: true});
				setTimeout(() => dispatchAction({type: 'transfer/clear', payload: true}), 3000);
			} catch(e) {
				commit({type: 'transfer/setError', payload: ErrorHandler.getMessage(e)})
			}
			
		}
	}
}