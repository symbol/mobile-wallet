export const createGetMosaic = idInfoMap => mosaicId => {
    return {
        toPromise: () =>
            new Promise((resolve, reject) => {
                if (idInfoMap.hasOwnProperty(mosaicId)) {
                    resolve(idInfoMap[mosaicId]);
                }

                reject();
            }),
    };
};

export const createMosaicInfo = (divisibility, expired) => ({
    divisibility,
    expired,
});
