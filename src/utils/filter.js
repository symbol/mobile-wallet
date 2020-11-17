import type { MosaicModel } from '@src/storage/models/MosaicModel';
import type { NetworkModel } from '@src/storage/models/NetworkModel';

export const filterCurrencyMosaic = (mosaicModels: MosaicModel[], network: NetworkModel): MosaicModel => {
    return mosaicModels.filter(mosaicModel => mosaicModel.mosaicId === network.currencyMosaicId)[0];
};
