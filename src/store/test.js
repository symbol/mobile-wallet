const module = {
	namespace: 'test',
	state: {
		a: 1,
		b: 2
	},
	mutations: {
		setA(state, payload) {
			state.test.a = payload;
			return state;
		}
	},
	actions: {
		ASYNC_ACTION: (commit, payload) => {
			setTimeout(() => {
				commit({type: 'test/setA', payload})
			}, 1500)
		}
	}
}

export default module;