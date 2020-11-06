export Pagination from './Pagination';

export const getStateFromManagers = (managers) => {
	let state = {};

	for (const manager of managers)
		state[manager.name] = manager;
	return state;
};

export const getMutationsFromManagers = (managers) => {
	let mutations = {};

	for (const manager of managers)
		mutations[`setDataManager_${manager.name}`] = (state, payload) => {
			state[manager.name] = payload;
			return state;
		};
	return mutations;
};