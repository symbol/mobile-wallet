import _ from 'lodash';
export Pagination from './Pagination';
export DataSet from './DataSet';

export const getStateFromManagers = managers => {
    let state = {};

    for (const manager of managers) state[manager.name] = manager;
    return state;
};

export const getMutationsFromManagers = (managers, namespace) => {
    let mutations = {};

    for (const manager of managers)
        mutations[`setDataManager_${manager.name}`] = (state, payload) => {
            state[namespace][manager.name] = _.clone(payload);
            return state;
        };
    return mutations;
};
