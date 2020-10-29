import {
    NetworkType,
    PublicAccount,
    AccountKeyLinkTransaction,
    LinkAction,
    PersistentDelegationRequestTransaction,
    Deadline,
    UInt64,
    RepositoryFactoryHttp,
} from "symbol-sdk";

const networkGenerationHash = '6C1B92391CCB41C96478471C2634C111D9E989DECD66130C0430B5B8D20117CD';
const nodePublicKey = "C7F6B7749B23B3871736058963390C7ED2A7B40924A1C300C717611F49B316B7";

export const startHarvesting = async (mainAccount, remoteAccount, nodeUrl) => {

    const networkType = NetworkType.TEST_NET;
    const nodePublicAccount = PublicAccount.createFromPublicKey(nodePublicKey, networkType);

    const persistentDelegationRequestTransaction = await PersistentDelegationRequestTransaction
        .createPersistentDelegationRequestTransaction(
            Deadline.create(),
            remoteAccount.privateKey,
            remoteAccount.privateKey,
            nodePublicAccount.publicKey,
            networkType,
            UInt64.fromUint(2000000)
        );

    const signedTransaction = await mainAccount.sign(persistentDelegationRequestTransaction, networkGenerationHash);
    const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
    const transactionHttp = await repositoryFactory.createTransactionRepository();

    transactionHttp
        .announce(signedTransaction)
        .subscribe((x) => console.log(x), (err) => console.error(err));
}

export const linkRemoteAccount = async (mainAccount, remoteAccount, nodeUrl) => {

    const accountLinkTransaction = await AccountKeyLinkTransaction.create(
        Deadline.create(),
        remoteAccount.publicKey,
        LinkAction.Link,
        NetworkType.TEST_NET,
        UInt64.fromUint(2000000)
    );

    const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
    const transactionHttp = await repositoryFactory.createTransactionRepository();
    const signedTransaction = await mainAccount.sign(accountLinkTransaction, networkGenerationHash);

    transactionHttp
        .announce(signedTransaction)
        .subscribe((x) => console.log(x), (err) => console.error(err));
}


export const unlinkRemoteAccount = async (mainAccount, remoteAccount, nodeUrl) => {

    const accountLinkTransaction = await AccountKeyLinkTransaction.create(
        Deadline.create(),
        remoteAccount.publicKey,
        LinkAction.Unlink,
        NetworkType.TEST_NET,
        UInt64.fromUint(2000000)
    );

    const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
    const transactionHttp = await repositoryFactory.createTransactionRepository();
    const signedTransaction = await mainAccount.sign(accountLinkTransaction, networkGenerationHash);

    transactionHttp
        .announce(signedTransaction)
        .subscribe((x) => console.log(x), (err) => console.error(err));
}