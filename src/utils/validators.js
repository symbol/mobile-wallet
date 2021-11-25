import type { NetworkModel } from '@src/storage/models/NetworkModel';
import { Address } from 'symbol-sdk';
import NetworkService from '@src/services/NetworkService';

export const isAddressValid = (rawAddress: string, network: NetworkModel) => {
    try {
        Address.createFromRawAddress(
            rawAddress,
            NetworkService.getNetworkTypeFromModel(network)
        );
        return true;
    } catch {
        return false;
    }
};
