import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import test from './test';
const modules = {
	test
};

const createModuleReducer = (module, state = {}, action) => {	
	const namespace = action.type.split('/')[0];
	const mutation = action.type.split('/')[1];

	if(!state[module.namespace]) 
		state[module.namespace] = module.state;

	if(
		module.namespace === namespace &&
		typeof module.mutations[mutation] === 'function'
	)
		return module.mutations[mutation](state, action.payload);
	return state;
}

const createRootReducer = (state, action) => {
	let rootState = {...state};

	Object
		.values(modules)
		.forEach((module) => {
			rootState = {
				...rootState,
				...createModuleReducer(module, state, action)
			}	
		});

	return rootState;
}

const store = createStore(createRootReducer, applyMiddleware(thunk));

store.dispatchAction = (type, payload) => {
	const namespace = type.split('/')[0];
	const action = type.split('/')[1];
	if(!modules[namespace]) {
		console.error('Failed to dispatchAction. Module "' + namespace + '" not found');
		return;
	}

	if(typeof modules[namespace].actions[action] !== 'function')  {
		console.error('Failed to dispatchAction. Action "' + action + '" not found')
		return;
	}

	store.dispatch(dispatch => 
		modules[namespace]
			.actions[action](dispatch, payload)
	);
}

export default store;