import store from '@src/store';

export const getStore = state => {
    const initialState = store.getState();

    Object.entries(state).forEach(([moduleName, module]) => {
        Object.entries(module).forEach(([key, value]) => {
            initialState[moduleName][key] = value;
        });
    });

    return store;
};
