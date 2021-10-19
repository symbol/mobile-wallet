import { TransactionFees, NetworkType } from 'symbol-sdk';

export type AppNetworkType = 'testnet' | 'mainnet';

/**
 * Network model
 */
export interface NetworkModel {
    type: AppNetworkType;
    networkType: NetworkType;
    generationHash: string;
    node: string;
    currencyMosaicId: string;
    chainHeight: number;
    blockGenerationTargetTime: number;
    epochAdjustment: number;
    transactionFees: TransactionFees;
    defaultDynamicFeeMultiplier: number;
    networkCurrency: {
        namespaceName: string;
        namespaceId: string;
        mosaicId: string;
        divisibility: number;
    }
}
