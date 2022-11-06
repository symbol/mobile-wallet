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

export const createGetTransaction = transactions => transactionId => {
    return {
        toPromise: () =>
            new Promise((resolve, reject) => {
                const transaction = transactions.find(tx => tx.transactionInfo.id === transactionId);
                if (transaction) {
                    resolve(transaction);
                }

                reject();
            }),
    };
};
