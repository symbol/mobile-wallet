export const createSearch = (transactions, group) => searchCriteria => {
    return {
        toPromise: () =>
            new Promise(resolve => {
                if (!group || group === searchCriteria.group) {
                    resolve({ data: transactions });
                } else {
                    resolve({ data: [] });
                }
            }),
    };
};

export const createSearchWithFilter = transactionSets => searchCriteria => {
    return {
        toPromise: () =>
            new Promise(resolve => {
                const transactions = [];

                transactionSets.forEach(set => {
                    if (
                        !set.filter ||
                        ((!set.filter.group || set.filter.group === searchCriteria.group) &&
                            (!set.filter.address || set.filter.group === searchCriteria.address) &&
                            (!set.filter.signerPublicKey || set.filter.group === searchCriteria.signerPublicKey))
                    ) {
                        transactions.push(...set.transactions);
                    }
                });

                resolve({ data: transactions });
            }),
    };
};

export const createGetTransaction = transactions => transactionId => {
    return {
        toPromise: () =>
            new Promise((resolve, reject) => {
                const transaction = transactions.find(tx => tx.transactionInfo.id === transactionId);
                if (transaction) {
                    return resolve(transaction);
                }

                reject();
            }),
    };
};
