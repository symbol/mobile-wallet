import TransactionBuilder from '@src/utils/TransactionBuilder';

class MosaicService {
	static getOwnedMosaics = () => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve([
					{ mosaicId: '234234235', mosaicName: 'Symbol.XYM', amount: 1324234.24234 },
					{ mosaicId: 'AER2REW322C', mosaicName: 'namespace.coin', amount: 2 },
					{ mosaicId: 'EFA539E73G5', mosaicName: 'EFA539E73G5', amount: 0.12312 },
				]);
			}, 3000);
		})
	};

	static getNativeMosaic = () => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					mosaicId: '234234235',
					namespaceName: 'symnol.xym',
					subNamespaceName: 'xym'
				});
			}, 3000);
		})
	}
};

export default {
	namespace: 'mosaic',
	state: {
		isLoading: false,
		isError: false,
		ownedMosaics: [],
		nativeMosaicNamespaceName: '',
		nativeMosaicSubNamespaceName: '',
		balance: 0
	},
	mutations: {
		setLoading(state, payload) {
			state.mosaic.isLoading = payload;
			return state;
		},
		setError(state, payload) {
			state.mosaic.isError = payload;
			return state;
		},
		setOwnedMosaics(state, payload) {
			console.log('setOwnedMosaics', payload)
			state.mosaic.ownedMosaics = payload;
			return state;
		},
		setNativeMosaic(state, payload) {
			state.mosaic.nativeMosaicNamespaceName = payload.namespaceName;
			state.mosaic.nativeMosaicSubNamespaceName = payload.subNamespaceName;
			state.mosaic.balance = payload.amount;
			return state;
		},
	},
	actions: {
		clear: ({commit}) => {
			commit({type: 'mosaic/setLoading', payload: false});
			commit({type: 'mosaic/setError', payload: false});
		},

		loadOwnedMosaics: async ({commit}) => {
			console.log('teke it')
			try {
				commit({type: 'mosaic/setLoading', payload: true});
				const { 
					mosaicId, 
					namespaceName,
					subNamespaceName,
				} = await MosaicService.getNativeMosaic();
				const mosaics = await MosaicService.getOwnedMosaics();
				const ownedNativeMosaic = mosaics.find(mosaic => mosaic.mosaicId === mosaicId);

				commit({type: 'mosaic/setOwnedMosaics', payload: mosaics});
				commit({type: 'mosaic/setNativeMosaic', payload: {
					...ownedNativeMosaic,
					namespaceName,
					subNamespaceName,
				}});
				commit({type: 'mosaic/setLoading', payload: false});
			}
			catch(e) {
				commit({type: 'mosaic/setLoading', payload: false});
				commit({type: 'mosaic/setError', payload: true});
			}
		}
	}
}