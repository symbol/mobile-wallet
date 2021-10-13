import { TransactionFees } from 'symbol-sdk';

export type AppNetworkType = 'testnet' | 'mainnet';

/**
 * Network model
 */
export interface NetworkModel {
    type: AppNetworkType;
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
