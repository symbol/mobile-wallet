import { UInt64 } from 'symbol-sdk';
import HarvestingService from '@src/services/HarvestingService';
import {HarvestingSecureStorage} from "@src/storage/persistence/HarvestingSecureStorage";

const MIN_REQUIRED_BALANCE = 10000;


export type HarvestingStatus = 'ACTIVE' | 'INACTIVE' | 'INPROGRESS_ACTIVATION' | 'INPROGRESS_DEACTIVATION' | 'KEYS_LINKED';

export type HarvestedBlock = {
    blockNo: UInt64,
    fee: UInt64,
};

export type HarvestedBlockStats = {
    totalBlockCount: number,
    totalFeesEarned: number,
};

export default {
    namespace: 'harvesting',
    state: {
        initialized: false,
        harvestedBlocks: null,
        isFetchingHarvestedBlocks: false,
        harvestedBlocksPageInfo: { pageNumber: 1, isLastPage: false },
        status: 'INACTIVE',
        harvestedBlockStats: {
            totalBlockCount: 0,
            totalFeesEarned: 0,
        },
		isFetchingHarvestedBlockStats: false,
		minRequiredBalance: MIN_REQUIRED_BALANCE,
        harvestingModel: null,
        nodes: HarvestingService.getHarvestingNodeList(),
    },
    mutations: {
        setInitialized(state, payload) {
            state.harvesting.initialized = payload;
            return state;
        },
        setHarvestedBlocks(state, payload) {
            state.harvesting.initialized = payload;
            return state;
        },
        setIsFetchingHarvestedBlocks(state, payload) {
            state.harvesting.isFetchingHarvestedBlocks = payload;
            return state;
        },
        setHarvestedBlocksPageInfo(state, payload) {
            state.harvesting.harvestedBlocksPageInfo = payload;
            return state;
        },
        setStatus(state, payload) {
            state.harvesting.status = payload;
            return state;
        },
        setHarvestedBlockStats(state, payload) {
            state.harvesting.harvestedBlockStats = payload;
            return state;
        },
        setIsFetchingHarvestedBlockStats(state, payload) {
            state.harvesting.isFetchingHarvestedBlockStats = payload;
            return state;
        },
        setHarvestingModel(state, payload) {
            state.harvesting.harvestingModel = payload;
            return state;
        },
        setNodes(state, payload) {
            state.harvesting.nodes = payload;
            return state;
        },
    },
    actions: {
        init: async ({ dispatchAction }) => {
            await Promise.all([
                dispatchAction({ type: 'harvesting/loadState' }),
                dispatchAction({ type: 'harvesting/loadHarvestedBlocks' }),
                dispatchAction({ type: 'harvesting/loadHarvestedBlocksStats' }),
                dispatchAction({ type: 'harvesting/loadHarvestingModel' }),
                dispatchAction({ type: 'harvesting/loadHarvestingNodes' }),
            ]);
        },
        loadState: async ({ commit, state }) => {
            try {
                const status = await HarvestingService.getAccountStatus(state.wallet.selectedAccount, state.network.selectedNetwork);
                commit({ type: 'harvesting/setStatus', payload: status });
            } catch(e) {
                console.log(e);
                commit({ type: 'harvesting/setStatus', payload: 'INACTIVE' });
            }
        },
        loadHarvestingNodes: async ({ commit, state }) => {
            try {
                const nodes = await HarvestingService.getPeerNodes(state.network.selectedNetwork);
                commit({ type: 'harvesting/setNodes', payload: nodes });
            } catch(e) {
                console.log(e);
                commit({ type: 'harvesting/setNodes', payload: HarvestingService.getHarvestingNodeList() });
            }
        },
        loadHarvestingModel: async ({ commit, state }) => {
            const harvestingModel = await HarvestingSecureStorage.getHarvestingModel(state.wallet.selectedAccount.id);
            commit({ type: 'harvesting/setHarvestingModel', payload: harvestingModel });
        },
        loadHarvestedBlocks: async ({ commit, state }) => {
            const harvestedBlocks = await HarvestingService.getHarvestedBlocks(state.wallet.selectedAccount, state.network.selectedNetwork);
            commit({ type: 'harvesting/setHarvestedBlocks', payload: harvestedBlocks });
        },
        loadHarvestedBlocksStats: async ({ commit, state }) => {
            HarvestingService.getHarvestedBlocksStats(state.wallet.selectedAccount, state.network.selectedNetwork, commit);
        },
        startHarvesting: async ({ state, dispatchAction }, { nodePublicKey, harvestingNode }) => {
            try {
                await HarvestingService.createAndLinkKeys(state.wallet.selectedAccount, nodePublicKey, state.network.selectedNetwork);
                await dispatchAction({
                    type: 'wallet/updateDelegatedHarvestingInfo',
                    payload: {
                        id: state.wallet.selectedAccount.id,
                        isPersistentDelReqSent: false,
                        harvestingNode: harvestingNode,
                    },
                });
            } catch {}
            dispatchAction({ type: 'harvesting/init' });
        },
        stopHarvesting: async ({ state, dispatchAction }) => {
            try {
                await HarvestingService.unlinkAllKeys(state.wallet.selectedAccount, state.network.selectedNetwork);
                await dispatchAction({
                    type: 'wallet/updateDelegatedHarvestingInfo',
                    payload: {
                        id: state.wallet.selectedAccount.id,
                        isPersistentDelReqSent: false,
                        harvestingNode: null,
                    },
                });
            } catch(e) {
                console.log(e);
            }
            dispatchAction({ type: 'harvesting/init' });
        },
        activateHarvesting: async ({ state, dispatchAction }, { nodePublicKey, harvestingNode }) => {
            try {
                const harvestingModel = await HarvestingSecureStorage.getHarvestingModel(state.wallet.selectedAccount.id);
                if (!harvestingModel) {
                    console.log('Harvesting model not model saved');
                    return;
                }
                await HarvestingService.sendPersistentHarvestingRequest(harvestingModel, state.wallet.selectedAccount, state.network.selectedNetwork);
                await dispatchAction({
                    type: 'wallet/updateDelegatedHarvestingInfo',
                    payload: {
                        id: state.wallet.selectedAccount.id,
                        isPersistentDelReqSent: true,
                        harvestingNode: harvestingNode,
                    },
                });
            } catch {}
            dispatchAction({ type: 'harvesting/init' });
        },
    },
};
