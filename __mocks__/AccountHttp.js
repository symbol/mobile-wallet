export const createGetAccountInfo = addressInfo => () => {
    return {
        toPromise: () =>
            new Promise(resolve => {
                resolve(addressInfo);
            }),
    };
};
