const module = {
	namespace: 'test',
	state: {
		a: 1,
		b: 2
	},
	mutations: {
		setA(state, payload) {
			console.log('setA', state)
			state.test.a = payload;
			return state;
		}
	},
	actions: {
		a1: (commit, payload) => {
			
			setTimeout(() => {
				commit({type: 'test/setA', payload})
			}, 0)
		}
	}
}

export default module;