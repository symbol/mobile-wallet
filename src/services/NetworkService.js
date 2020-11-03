import { NetworkHttp, NetworkType } from 'symbol-sdk';
import type { NetworkModel } from '@src/storage/models/NetworkModel';

export default class NetworkService {
    /**
     * Get network model from node
     * @param node
     * @returns {Promise<{node: string, generationHash: string, type: NetworkType, currencyMosaicId: string}>}
     */
    static async getNetworkModelFromNode(node: string): NetworkModel {
        const networkHttp = new NetworkHttp(node);
        const networkType = await networkHttp.getNetworkType().toPromise();
        const networkProps = await networkHttp.getNetworkProperties().toPromise();
        return {
            type: networkType === NetworkType.TEST_NET ? 'testnet' : 'mainnet',
            generationHash: networkProps.network.generationHashSeed,
            node: node,
            currencyMosaicId: networkProps.chain.currencyMosaicId.replace('0x', '').replace(/'/g, ''),
        };
    }
}
