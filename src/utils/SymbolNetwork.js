import { NetworkType, NodeHttp } from 'symbol-sdk';

type NetworkInfo = {
    generationHash: string,
    network: 'mainnet' | 'testnet',
};

export const fetchNetworkInfo = async (node: string): Promise<NetworkInfo> => {
    const nodeHttp = new NodeHttp(node);
    const nodeInfo = await nodeHttp.getNodeInfo().toPromise();
    return {
        generationHash: nodeInfo.networkGenerationHashSeed,
        network: nodeInfo.networkIdentifier === NetworkType.MAIN_NET ? 'mainnet' : 'testnet',
    };
};
