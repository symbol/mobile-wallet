import { AsyncCache } from '@src/utils/storage/AsyncCache';
import { getDefaultNetworkType, getNodes } from '@src/config/environment';
import { fetchNetworkInfo } from '@src/utils/SymbolNetwork';
import type { AppNetworkType } from '@src/storage/models/NetworkModel';
import NetworkService from '@src/services/NetworkService';

export default {
    namespace: 'network',
    state: {
        isLoaded: false,
        generationHash: '',
        network: 'testnet',
        selectedNode: '',
        selectedNetwork: null,
    },
    mutations: {
        setIsLoaded(state, payload) {
            state.network.isLoaded = payload;
            return state;
        },
        setGenerationHash(state, payload) {
            state.network.generationHash = payload;
            return state;
        },
        setNetwork(state, payload) {
            state.network.network = payload;
            return state;
        },
        setSelectedNode(state, payload) {
            state.network.selectedNode = payload;
            return state;
        },
        setSelectedNetwork(state, payload) {
            state.network.selectedNetwork = payload;
            return state;
        },
    },
    actions: {
        initState: async ({ commit, state, dispatchAction }) => {
            let selectedNode = await AsyncCache.getSelectedNode();
            if (!selectedNode) {
                const network = getDefaultNetworkType();
                selectedNode = getNodes(network)[0];
            }
            const network = await NetworkService.getNetworkModelFromNode(selectedNode);
            commit({ type: 'network/setGenerationHash', payload: network.generationHash });
            commit({ type: 'network/setNetwork', payload: network.type });
            commit({ type: 'network/setSelectedNode', payload: selectedNode });
            commit({ type: 'network/setIsLoaded', payload: true });
            commit({
                type: 'network/setSelectedNetwork',
                payload: network,
            });
            dispatchAction({ type: 'account/initState' });
        },
        changeNode: async ({ commit, state, dispatchAction }, payload) => {
            const networkInfo = await fetchNetworkInfo(payload);
            commit({ type: 'network/setGenerationHash', payload: networkInfo.generationHash });
            commit({ type: 'network/setNetwork', payload: networkInfo.network });
            commit({ type: 'network/setSelectedNode', payload: payload });
            commit({ type: 'network/setIsLoaded', payload: true });
            dispatchAction({ type: 'account/loadAccount' });
        },
    },
};
