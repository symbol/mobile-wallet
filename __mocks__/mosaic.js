import { network } from './network';

export const currencyMosaicModelAmount10 = {
    amount: 10 * Math.pow(10, network.networkCurrency.divisibility),
    divisibility: network.networkCurrency.divisibility,
    expired: false,
    mosaicId: network.networkCurrency.mosaicId,
    mosaicName: network.networkCurrency.mosaicName,
};

export const mosaicModel1Amount10 = {
    amount: 10000000,
    divisibility: 6,
    expired: false,
    mosaicId: '57F988038A741AB8',
    mosaicName: 'test_mosaic',
};
