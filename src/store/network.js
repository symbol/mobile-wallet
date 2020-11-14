import { AsyncCache } from '@src/utils/storage/AsyncCache';
import { getDefaultNetworkType, getNodes } from '@src/config/environment';
import NetworkService from '@src/services/NetworkService';
import { GlobalListener } from '@src/store/index';

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
        initState: async ({ commit, dispatchAction }) => {
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
            GlobalListener.setNetwork(network);
            await dispatchAction({ type: 'wallet/initState' });
        },
        changeNode: async ({ commit, state, dispatchAction }, payload) => {
            const network = await NetworkService.getNetworkModelFromNode(payload);
            commit({
                type: 'network/setSelectedNetwork',
                payload: network,
            });
            commit({ type: 'network/setGenerationHash', payload: network.generationHash });
            commit({ type: 'network/setNetwork', payload: network.type });
            commit({ type: 'network/setSelectedNode', payload: payload });
            commit({ type: 'network/setIsLoaded', payload: true });
            await dispatchAction({ type: 'wallet/initState' });
        },
        updateChainHeight: async ({ state, commit }, payload) => {
            const selectedNetwork = state.network.selectedNetwork;
            selectedNetwork.chainHeight = payload;
            commit({ type: 'network/setSelectedNetwork', payload: selectedNetwork });
        },
    },
};
