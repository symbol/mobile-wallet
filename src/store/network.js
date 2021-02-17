import { AsyncCache } from '@src/utils/storage/AsyncCache';
import { getDefaultNetworkType, getNodes } from '@src/config/environment';
import NetworkService from '@src/services/NetworkService';
import { GlobalListener } from '@src/store/index';

const NETWORK_JOB_INTERVAL = 5000;

export default {
    namespace: 'network',
    state: {
        isUp: true,
        nodeFailedAttempts: 0,
        checkNodeJob: null,
        isLoaded: false,
        generationHash: '',
        network: 'testnet',
        selectedNode: '',
        selectedNetwork: {
            type: 'testnet',
            generationHash: '',
            node: '',
            currencyMosaicId: '',
            chainHeight: 0,
            blockGenerationTargetTime: 0,
            epochAdjustment: 0,
            transactionFees: {},
            defaultDynamicFeeMultiplier: 0,
        },
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
        setCheckNodeJob(state, payload) {
            state.network.checkNodeJob = payload;
            return state;
        },
        setIsUp(state, payload) {
            state.network.isUp = payload;
            return state;
        },
        setNodeFailedAttempts(state, payload) {
            state.network.nodeFailedAttempts = payload;
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
            await AsyncCache.setSelectedNode(payload);
            commit({
                type: 'network/setSelectedNetwork',
                payload: network,
            });
            commit({ type: 'network/setGenerationHash', payload: network.generationHash });
            commit({ type: 'network/setNetwork', payload: network.type });
            commit({ type: 'network/setSelectedNode', payload: payload });
            commit({ type: 'network/setIsLoaded', payload: true });
            GlobalListener.setNetwork(network);
            await dispatchAction({ type: 'wallet/initState' });
        },
        updateChainHeight: async ({ state, commit }, payload) => {
            const selectedNetwork = state.network.selectedNetwork;
            selectedNetwork.chainHeight = payload;
            commit({ type: 'network/setSelectedNetwork', payload: selectedNetwork });
        },
        checkNetwork: async ({ state, commit }) => {
            const selectedNetwork = state.network.selectedNetwork;
            let isUp = false;
            if (selectedNetwork) {
                try {
                    isUp = await NetworkService.isNetworkUp(selectedNetwork);
                } catch {
                    isUp = false;
                }
                if (isUp) {
                    commit({ type: 'network/setNodeFailedAttempts', payload: 0 });
                } else {
                    commit({ type: 'network/setNodeFailedAttempts', payload: state.network.nodeFailedAttempts + 1 });
                }
                isUp = state.network.nodeFailedAttempts < 3;
            }
            commit({ type: 'network/setIsUp', payload: isUp });
        },
        registerNodeCheckJob: async ({ state, commit, dispatchAction }) => {
            if (!state.network.checkNodeJob) {
                const job = setInterval(() => dispatchAction({ type: 'network/checkNetwork' }), NETWORK_JOB_INTERVAL);
                commit({ type: 'network/setCheckNodeJob', payload: job });
            }
        },
        dismissNodeCheckJob: async ({ state, commit }) => {
            if (state.network.checkNodeJob) {
                clearInterval(state.network.checkNodeJob);
                commit({ type: 'network/setCheckNodeJob', payload: null });
            }
        },
    },
};
