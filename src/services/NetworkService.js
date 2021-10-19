import {ChainHttp, NetworkConfiguration, NetworkHttp, NetworkType, NodeHttp, RepositoryFactoryHttp, TransactionFees} from 'symbol-sdk';
import type { NetworkModel } from '@src/storage/models/NetworkModel';
import { durationStringToSeconds } from '@src/utils/format';
import { timeout } from 'rxjs/operators';

const REQUEST_TIMEOUT = 5000;

export default class NetworkService {
    /**
     * Get network model from node
     * @param node
     * @returns {Promise<{node: string, generationHash: string, type: NetworkType, currencyMosaicId: string}>}
     */
    static async getNetworkModelFromNode(node: string): NetworkModel {
        const networkHttp = new NetworkHttp(node);
        const chainHttp = new ChainHttp(node);
        const [networkType, networkProps, chainInfo] = await Promise.all([
            networkHttp
                .getNetworkType()
                .pipe(timeout(REQUEST_TIMEOUT))
                .toPromise(),
            networkHttp
                .getNetworkProperties()
                .pipe(timeout(REQUEST_TIMEOUT))
                .toPromise(),
            chainHttp
                .getChainInfo()
                .pipe(timeout(REQUEST_TIMEOUT))
                .toPromise(),
        ]);

        const networkCurrency = await new RepositoryFactoryHttp(node, {
            networkType: networkType,
            generationHash: networkProps.network.generationHashSeed
        }).getCurrencies().toPromise();

        let transactionFees: TransactionFees;
        try {
            transactionFees = await networkHttp
                .getTransactionFees()
                .pipe(timeout(REQUEST_TIMEOUT))
                .toPromise();
        } catch (e) {
            transactionFees = new TransactionFees(0, 0, 0, 0, 0);
        }

        return {
            type: networkType === NetworkType.TEST_NET ? 'testnet' : 'mainnet',
            networkType,
            generationHash: networkProps.network.generationHashSeed,
            node: node,
            currencyMosaicId: networkProps.chain.currencyMosaicId.replace('0x', '').replace(/'/g, ''),
            currencyDivisibility: networkCurrency.currency.divisibility,
            chainHeight: chainInfo.height.compact(),
            blockGenerationTargetTime: this._blockGenerationTargetTime(networkProps),
            epochAdjustment: parseInt(networkProps.network.epochAdjustment),
            transactionFees: transactionFees,
            defaultDynamicFeeMultiplier: networkProps.chain.defaultDynamicFeeMultiplier || 1000,
            networkCurrency: {
                namespaceName: networkCurrency.currency.namespaceId.fullName,
                namespaceId: networkCurrency.currency.namespaceId.id.toHex(),
                mosaicId: networkCurrency.currency.mosaicId.toHex(),
                divisibility: networkCurrency.currency.divisibility,
            }
        };
    }

    /**
     * Block generation time
     * @param networkConfiguration
     * @param defaultValue
     * @returns {number}
     * @private
     */
    static _blockGenerationTargetTime(networkConfiguration: NetworkConfiguration | undefined, defaultValue: number | undefined = 15): number {
        return (
            (networkConfiguration && networkConfiguration.chain && durationStringToSeconds(networkConfiguration.chain.blockGenerationTargetTime)) ||
            defaultValue
        );
    }

    /**
     * Return network type from model
     * @param network
     * @returns {NetworkType.MAIN_NET|NetworkType.MIJIN|NetworkType.TEST_NET}
     */
    static getNetworkTypeFromModel(network: NetworkModel): NetworkType {
        switch (network.type) {
            case 'mainnet':
                return NetworkType.MAIN_NET;
            case 'testnet':
                return NetworkType.TEST_NET;
            default:
                return NetworkType.MIJIN;
        }
    }

    /**
     * Check if network or node are up
     * @param network
     */
    static async isNetworkUp(network: NetworkModel) {
        const nodeHttp = new NodeHttp(network.node);
        try {
            const health = await nodeHttp
                .getNodeHealth()
                .toPromise();
            return health.apiNode === 'up' && health.db === 'up';
        } catch {
            return false;
        }
    }
}
