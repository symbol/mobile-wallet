import { AsyncCache } from '@src/utils/storage/AsyncCache';
import { getDefaultNetworkType, getNISNodes } from '@src/config/environment';
import NetworkService from '@src/services/NetworkService';
import { GlobalListener } from '@src/store/index';

const NETWORK_JOB_INTERVAL = 10000;
const MAX_FAILED_NODE_ATTEMPTS = 5;

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
            currencyDivisibility: 6,
            chainHeight: 0,
            blockGenerationTargetTime: 0,
            epochAdjustment: 0,
            transactionFees: {},
            defaultDynamicFeeMultiplier: 0,
        },
        mainnetNodes: [],
        testnetNodes: [],
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
        setMainnetNodes(state, payload) {
            state.network.mainnetNodes = payload;
            return state;
        },
        setTestnetNodes(state, payload) {
            state.network.testnetNodes = payload;
            return state;
        },
    },
    actions: {
        initState: async ({ state, commit, dispatchAction }) => {
            let selectedNode = await AsyncCache.getSelectedNode();

            // load nodes list from statistic service
            await dispatchAction({ type: 'network/loadNodeList' });

            if (!selectedNode) {
                const network = getDefaultNetworkType();
                const nodeList = network === 'mainnet' ? state.network.mainnetNodes : state.network.testnetNodes;
                const randomIndex = Math.floor(Math.random() * nodeList.length);
                selectedNode = nodeList[randomIndex];
            }
            const network = await NetworkService.getNetworkModelFromNode(selectedNode);
            try {
                const nisNodes = getNISNodes(network.type);
                await dispatchAction({type: 'settings/saveSetSelectedNISNode', payload: nisNodes[0]});
            } catch {}
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
        loadNodeList: async ({ commit }) => {
            try {
                // load nodes list from statistic service
                const [testnetNodes, mainnetNodes] = await Promise.all([
                    NetworkService.getSelectorNodeList('testnet'),
                    NetworkService.getSelectorNodeList('mainnet')
                ])

                // Assign nodes on the state
                commit({ type: 'network/setTestnetNodes', payload: testnetNodes });
                commit({ type: 'network/setMainnetNodes', payload: mainnetNodes });
            } catch(e) {
                console.log(e);
            }
        },
        changeNode: async ({ commit, state, dispatchAction }, payload) => {
            const network = await NetworkService.getNetworkModelFromNode(payload);
            try {
                const nisNodes = getNISNodes(network.type);
                await dispatchAction({type: 'settings/saveSetSelectedNISNode', payload: nisNodes[0]});
            } catch {}
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
                    isUp = state.network.nodeFailedAttempts < MAX_FAILED_NODE_ATTEMPTS;
                }
                if (isUp) {
                    commit({ type: 'network/setNodeFailedAttempts', payload: 0 });
                } else {
                    commit({ type: 'network/setNodeFailedAttempts', payload: state.network.nodeFailedAttempts + 1 });
                }
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
