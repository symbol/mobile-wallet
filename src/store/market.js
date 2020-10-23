// Mock. TODO: remove
class MarketService {
	static getPriceChartData = () => {
		return fetch('https://min-api.cryptocompare.com/data/histohour?fsym=XEM&tsym=USD&limit=168', {method: 'GET'})
			.then(response => response.json())
			.then(responseJson => responseJson.Data.map(el => el.close))
			.catch((error) => {
				console.error(error);
				throw error;
			});
	}
	
	static getCurrentPrice = () => {
		return Promise.resolve(0.12);
	}
}



export default {
	namespace: 'market',
	state: {
		isLoading: false,
		isError: false,
		priceChartData: [],
		currentPrice: 0
	},
	mutations: {
		setLoading(state, payload) {
			state.market.loading = payload;
			return state;
		},
		setPriceChartData(state, payload) {
			state.market.priceChartData = payload;
			return state;
		},
		setCurrentPrice(state, payload) {
			state.market.currentPrice = payload;
			return state;
		}
	},
	actions: {
		loadMarketData: async (commit, payload) => {
			commit({type: 'market/setLoading', payload: true});
			const priceChartData = await MarketService.getPriceChartData();
			const currentPrice = await MarketService.getCurrentPrice();
			commit({type: 'market/setPriceChartData', payload: priceChartData});
			commit({type: 'market/setCurrentPrice', payload: currentPrice});
			commit({type: 'market/setLoading', payload: false});
		}
	}
}