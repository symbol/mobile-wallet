import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import wallet from '@src/store/wallet';
import settings from '@src/store/settings';
import network from '@src/store/network';
import transfer from '@src/store/transfer';
import mosaic from '@src/store/mosaic';
import account from '@src/store/account';
import harvesting from '@src/store/harvesting';
import addressBook from '@src/store/addressBook';
import ListenerService from '@src/services/ListenerService';
import transaction from '@src/store/transaction';
import optin from '@src/store/optin';

const modules = {
    // market,
    settings,
    network,
    wallet,
    mosaic,
    transfer,
    account,
    harvesting,
    addressBook,
    transaction,
    optin,
};

const createModuleReducer = (module, state = {}, action) => {
    if (!state[module.namespace]) state[module.namespace] = module.state;

    const namespace = action.type.split('/')[0];
    const mutation = action.type.split('/')[1];

    if (module.namespace === namespace && typeof module.mutations[mutation] !== 'function') {
        console.error('[Store] Failed to commit mutation. Type "' + mutation + '" does not exist in "' + namespace + '"');
        return state;
    }

    if (module.namespace === namespace && typeof module.mutations[mutation] === 'function')
        return module.mutations[mutation](state, action.payload);

    return state;
};

const createRootReducer = (state, action) => {
    let rootState = { ...state };

    if (typeof action.type !== 'string') {
        console.error('[Store] Failed to commit mutation. Type "' + action.type + '" is not a string');
        return rootState;
    }

    const namespace = action.type.split('/')[0];

    if (namespace !== '@@redux' && !modules[namespace]) {
        console.error('[Store] Failed to commit mutation. Module "' + namespace + '" not found');
        return rootState;
    }

    Object.values(modules).forEach(module => {
        rootState = {
            ...rootState,
            ...createModuleReducer(module, state, action),
        };
    });

    return rootState;
};

const store = createStore(createRootReducer, applyMiddleware(thunk));

store.dispatchAction = ({ type, payload }) => {
    if (typeof type !== 'string') {
        console.error('[Store] Failed to dispatchAction. Type "' + type + '" is not a string');
        return;
    }
    const namespace = type.split('/')[0];
    const action = type.split('/')[1];

    if (!modules[namespace]) {
        console.error('[Store] Failed to dispatchAction. Module "' + namespace + '" not found');
        return;
    }

    if (typeof modules[namespace].actions[action] !== 'function') {
        console.error('[Store] Failed to dispatchAction. Action "' + action + '" not found');
        return;
    }

    const state = store.getState();
    return store.dispatch(dispatch =>
        modules[namespace].actions[action](
            {
                commit: dispatch,
                state: state,
                dispatchAction: store.dispatchAction,
            },
            payload
        )
    );
};

export const GlobalListener = new ListenerService();

export default store;
