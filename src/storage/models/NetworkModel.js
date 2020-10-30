export type AppNetworkType = 'testnet' | 'mainnet';

/**
 * Network model
 */
export interface NetworkModel {
    type: AppNetworkType;
    generationHash: string;
    node: string;
}
