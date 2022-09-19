import { MosaicId } from 'symbol-sdk';

export const createGetMosaicsNames = idNamesMap => mosaicIds => {
    return {
        toPromise: new Promise(resolve => {
            const mosaicNames = [];

            mosaicIds.forEach(id => {
                if (idNamesMap.hasOwnProperty(id)) {
                    mosaicNames.push(...idNamesMap[id]);
                }
            });

            resolve(mosaicNames);
        }),
    };
};

export const createMosaicName = (mosaicId, name) => ({
    mosaicId: new MosaicId(mosaicId),
    names: [
        {
            name,
        },
    ],
});
