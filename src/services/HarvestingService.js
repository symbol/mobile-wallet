import {
    Account,
    AccountHttp,
    AccountKeyLinkTransaction,
    Address,
    AggregateTransaction,
    Deadline,
    LinkAction,
    NodeHttp,
    NodeKeyLinkTransaction,
    Order,
    PersistentDelegationRequestTransaction,
    PublicAccount,
    ReceiptHttp,
    ReceiptPaginationStreamer,
    ReceiptType,
    RepositoryFactoryHttp,
    SignedTransaction,
    Transaction,
    TransactionHttp,
    TransactionService,
    UInt64,
    VrfKeyLinkTransaction,
} from 'symbol-sdk';
import type {NetworkModel} from '@src/storage/models/NetworkModel';
import type {AccountModel} from '@src/storage/models/AccountModel';
import AccountService from '@src/services/AccountService';
import type {HarvestedBlock, HarvestedBlockStats, HarvestingStatus} from '@src/store/harvesting';
import {map, reduce} from 'rxjs/operators';
import {Observable} from 'rxjs';
import NetworkService from '@src/services/NetworkService';
import {HarvestingSecureStorage} from '@src/storage/persistence/HarvestingSecureStorage';
import type {HarvestingModel} from '@src/storage/models/HarvestingModel';

export default class HarvestingService {
    /**
     * Get account linked keys
     * @param account
     * @param network
     * @returns {Promise<void>}
     */
    static async getAccountKeys(account: AccountModel, network: NetworkModel): Promise<{ vrf: any, linked: any, node: any }> {
        const accountHttp = new AccountHttp(network.node);
        const rawAddress = AccountService.getAddressByAccountModelAndNetwork(account, network.type);
        const address = Address.createFromRawAddress(rawAddress);
        // const address = Address.createFromRawAddress('TD5YTEJNHOMHTMS6XESYAFYUE36COQKPW6MQQQY');
        const accountInfo = await accountHttp.getAccountInfo(address).toPromise();
        return {
            vrf: accountInfo.supplementalPublicKeys.vrf,
            linked: accountInfo.supplementalPublicKeys.linked,
            node: accountInfo.supplementalPublicKeys.node,
        };
    }
    /**
     * Get account linked keys
     * @param account
     * @param network
     * @returns {Promise<void>}
     */
    static async getAccountStatus(account: AccountModel, network: NetworkModel): Promise<HarvestingStatus> {
        const keys = await this.getAccountKeys(account, network);
        const allKeysLinked = keys.node && keys.vrf && keys.linked;

        let unlockedAccounts = [];
        if (account.harvestingNode) {
            try {
                const nodeHttp = new NodeHttp(account.harvestingNode);
                unlockedAccounts = await nodeHttp.getUnlockedAccount().toPromise();
            } catch (e) {
                console.log(e);
            }
        }
        const accountUnlocked = keys.linked && unlockedAccounts.some(publicKey => publicKey === keys.linked.publicKey);

        if (allKeysLinked && accountUnlocked) {
            return 'ACTIVE';
        }
        // const harvestedBlocks = await this.getHarvestedBlocks(account, network);
        // if (harvestedBlocks.length > 0) {
        //    return 'ACTIVE';
        // }
        let status: HarvestingStatus;
        if (allKeysLinked) {
            status = accountUnlocked ? 'ACTIVE' : account.isPersistentDelReqSent ? 'INPROGRESS_ACTIVATION' : 'KEYS_LINKED';
        } else {
            status = accountUnlocked ? 'INPROGRESS_DEACTIVATION' : 'INACTIVE';
        }
        return status;
    }

    /**
     * Get harvested blocks
     */
    static async getHarvestedBlocks(account: AccountModel, network: NetworkModel, pageNumber = 0, pageSize = 25): Promise<HarvestedBlock[]> {
        const receiptRepository = new ReceiptHttp(network.node);

        const rawAddress = AccountService.getAddressByAccountModelAndNetwork(account, network.type);
        const targetAddress = Address.createFromRawAddress(rawAddress);
        // const targetAddress = Address.createFromRawAddress('TD5YTEJNHOMHTMS6XESYAFYUE36COQKPW6MQQQY');

        const pageTxStatement = await receiptRepository
            .searchReceipts({
                targetAddress: targetAddress,
                receiptTypes: [ReceiptType.Harvest_Fee],
                pageNumber: pageNumber,
                pageSize: pageSize,
                order: Order.Desc,
            })
            .toPromise();

        const harvestedBlocks = pageTxStatement.data.map(t => ({
            blockNo: t.height,
            fee: t.receipts.find(r => r.targetAddress.plain() === targetAddress.plain())?.amount,
        }));
        const pageInfo = { isLastPage: pageTxStatement.isLastPage, pageNumber: pageTxStatement.pageNumber };
        return { harvestedBlocks, pageInfo };
    }

    /**
     * TODO: REMOVE commit from params
     * Get harvested blocks
     */
    static async getHarvestedBlocksStats(account: AccountModel, network: NetworkModel, commit): Observable<HarvestedBlockStats> {
        const receiptRepository = new ReceiptHttp(network.node);
        const streamer = ReceiptPaginationStreamer.transactionStatements(receiptRepository);

        const rawAddress = AccountService.getAddressByAccountModelAndNetwork(account, network.type);
        const targetAddress = Address.createFromRawAddress(rawAddress);
        // const targetAddress = Address.createFromRawAddress('TD5YTEJNHOMHTMS6XESYAFYUE36COQKPW6MQQQY');

        let counter = 0;
        return streamer
            .search({
                targetAddress: targetAddress,
                receiptTypes: [ReceiptType.Harvest_Fee],
                pageNumber: 1,
                pageSize: 50,
            })
            .pipe(
                map(t => ({
                    blockNo: t.height,
                    fee: t.receipts.find(r => r.targetAddress.plain() === targetAddress.plain()).amount,
                })),
                reduce(
                    (acc, harvestedBlock) => ({
                        totalBlockCount: ++counter,
                        totalFeesEarned: acc.totalFeesEarned.add(harvestedBlock.fee),
                    }),
                    {
                        totalBlockCount: 0,
                        totalFeesEarned: UInt64.fromUint(0),
                    }
                )
            )
            .subscribe({
                next: harvestedBlockStats => {
                    harvestedBlockStats.totalFeesEarned = harvestedBlockStats.totalFeesEarned.compact() / Math.pow(10, 6);
                    commit({ type: 'harvesting/setHarvestedBlockStats', payload: harvestedBlockStats });
                },
                error: err => {},
            });
    }

    static async getPeerNodes(network: NetworkModel): { publicKey: string, url: string }[] {
        const repositoryFactory = new RepositoryFactoryHttp(network.node);
        const nodeRepository = repositoryFactory.createNodeRepository();

        const peerNodes = await nodeRepository.getNodePeers().toPromise();
        return [
            // ...this.getHarvestingNodeList(),
            ...peerNodes
                .sort((a, b) => a.host.localeCompare(b.host))
                .map(node => {
                    return { publicKey: node.publicKey, url: node.host };
                }),
        ];
    }

    static async getNodePublicKeyFromNode(node: string): Promise<string> {
        const repositoryFactory = new RepositoryFactoryHttp(node);
        const nodeRepository = repositoryFactory.createNodeRepository();
        const nodeInfo = await nodeRepository.getNodeInfo().toPromise();
        return nodeInfo.nodePublicKey;
    }

    /**
     * Static list for the time being - until the dynamic solution
     */
    static getHarvestingNodeList() {
        return [
            {
                publicKey: 'BE60BE426872B3CB46FE2C9BAA521731EA52C0D57E004FC7C84293887AC3BAD0',
                url: 'beacon-01.ap-northeast-1.0.10.0.x.symboldev.network',
            },
            {
                publicKey: 'EE356A555802003C5666D8485185CDC3844F9502FAF24B589BDC4D6E9148022F',
                url: 'beacon-01.eu-central-1.0.10.0.x.symboldev.network',
            },
            {
                publicKey: '81890592F960AAEBDA7612C8917FA9C267A845D78D74D4B3651AF093E6775001',
                url: 'beacon-01.us-west-2.0.10.0.x.symboldev.network',
            },
            {
                publicKey: '2AF52C5AA9A5E13DD548A577DEBF21E7D3CC285A1B0798F4D450239CDDE5A169',
                url: 'beacon-01.ap-southeast-1.0.10.0.x.symboldev.network',
            },
            {
                publicKey: 'D74B89EE9378DEBD510A4139F8E8B10B878E12956059CD9E13253CF3AD73BDEB',
                url: 'beacon-01.us-west-1.0.10.0.x.symboldev.network',
            },
            {
                publicKey: '938D6C1BBDB09F3F1B9D95D2D902A94C95E3AA6F1069A805831D9E272DCF927F',
                url: 'beacon-01.eu-west-1.0.10.0.x.symboldev.network',
            },
            {
                publicKey: '2A40F7895F56389BE40C063B897E9E66E64705D55B19FC43C8CEB5F7F14ABE59',
                url: 'beacon-01.us-east-1.0.10.0.x.symboldev.network',
            },
        ];
    }
    static async getAccountImportance(node: string, accountAddress: string){
        try{
            const accountHttp = new AccountHttp(node);
            const accountInfo = await accountHttp.getAccountInfo(Address.createFromRawAddress(accountAddress)).toPromise();
            return accountInfo.importance.compact()
        }catch(err){
            console.log(err);
        }
    }

    /**
     * Creates and links the keys
     *
     * @param accountModel
     * @param nodePublicKey
     * @param network
     */
    static async createAndLinkKeys(accountModel: AccountModel, nodePublicKey: string, network: NetworkModel) {
        const networkType = NetworkService.getNetworkTypeFromModel(network);
        const vrfAccount = Account.generateNewAccount(networkType);
        const remoteAccount = Account.generateNewAccount(networkType);

        const maxFee = UInt64.fromUint(1000000);
        const vrfTx = VrfKeyLinkTransaction.create(Deadline.create(network.epochAdjustment, 2), vrfAccount.publicKey, LinkAction.Link, networkType, maxFee);
        const remoteTx = AccountKeyLinkTransaction.create(
            Deadline.create(network.epochAdjustment, 2),
            remoteAccount.publicKey,
            LinkAction.Link,
            networkType,
            maxFee
        );
        const nodeTx = NodeKeyLinkTransaction.create(Deadline.create(network.epochAdjustment, 2), nodePublicKey, LinkAction.Link, networkType, maxFee);

        const account = Account.createFromPrivateKey(accountModel.privateKey, networkType);
        const currentSigner = account.publicAccount;
        const aggregateTx = AggregateTransaction.createComplete(
            Deadline.create(network.epochAdjustment, 2),
            [vrfTx.toAggregate(currentSigner), remoteTx.toAggregate(currentSigner), nodeTx.toAggregate(currentSigner)],
            networkType,
            [],
            maxFee
        );
        const signedTx = account.sign(aggregateTx, network.generationHash);
        const transactionHttp = new TransactionHttp(network.node);
        transactionHttp.announce(signedTx);

        await HarvestingSecureStorage.saveHarvestingModel(accountModel.id, {
            vrfPrivateKey: vrfAccount.privateKey,
            remotePrivateKey: remoteAccount.privateKey,
            nodePublicKey: nodePublicKey,
        });
    }

    /**
     * Unlinks all keys
     *
     * @param accountModel
     * @param network
     */
    static async unlinkAllKeys(accountModel: AccountModel, network: NetworkModel) {
        const networkType = NetworkService.getNetworkTypeFromModel(network);
        const keys = await this.getAccountKeys(accountModel, network);

        const maxFee = UInt64.fromUint(1000000);
        console.log(keys);
        const vrfTx = VrfKeyLinkTransaction.create(Deadline.create(network.epochAdjustment, 2), keys.vrf.publicKey, LinkAction.Unlink, networkType, maxFee);
        const remoteTx = AccountKeyLinkTransaction.create(
            Deadline.create(network.epochAdjustment, 2),
            keys.linked.publicKey,
            LinkAction.Unlink,
            networkType,
            maxFee
        );
        const nodeTx = NodeKeyLinkTransaction.create(Deadline.create(network.epochAdjustment, 2), keys.node.publicKey, LinkAction.Unlink, networkType, maxFee);

        const account = Account.createFromPrivateKey(accountModel.privateKey, networkType);
        const currentSigner = account.publicAccount;
        const aggregateTx = AggregateTransaction.createComplete(
            Deadline.create(network.epochAdjustment, 2),
            [vrfTx.toAggregate(currentSigner), remoteTx.toAggregate(currentSigner), nodeTx.toAggregate(currentSigner)],
            networkType,
            [],
            maxFee
        );
        const signedTx = account.sign(aggregateTx, network.generationHash);
        const transactionHttp = new TransactionHttp(network.node);
        transactionHttp.announce(signedTx);

        await HarvestingSecureStorage.clear();
    }

    /**
     * Sends Persistent harvesting request
     * @param harvestingModel
     * @param accountModel
     * @param network
     */
    static async sendPersistentHarvestingRequest(harvestingModel: HarvestingModel, accountModel: AccountModel, network: NetworkModel) {
        const maxFee = UInt64.fromUint(1000000); // TODO: UInt64.fromUint(feesConfig.highest); // fixed to the Highest, txs must get confirmed
        const networkType = NetworkService.getNetworkTypeFromModel(network);

        const account = Account.createFromPrivateKey(accountModel.privateKey, networkType);

        const tx = PersistentDelegationRequestTransaction.createPersistentDelegationRequestTransaction(
            Deadline.create(network.epochAdjustment, 2),
            harvestingModel.remotePrivateKey,
            harvestingModel.vrfPrivateKey,
            harvestingModel.nodePublicKey,
            networkType,
            maxFee
        );

        const signedTx = account.sign(tx, network.generationHash);
        const transactionHttp = new TransactionHttp(network.node);
        return transactionHttp.announce(signedTx);
    }

    /**
     * Start harvesting
     * @param action
     * @param accountModel
     * @param network
     * @param nodePublicKey
     * @returns {Promise<void>}
     */
    static async doHarvesting(action: 'START' | 'STOP' | 'SWAP', accountModel: AccountModel, network: NetworkModel, nodePublicKey?: string) {
        const networkType = NetworkService.getNetworkTypeFromModel(network);
        const txs = await this._getTransactions(action, accountModel, network, nodePublicKey);
        console.log(txs);
        const account = Account.createFromPrivateKey(accountModel.privateKey, networkType);
        if (txs.length === 1) {
            const signedTx = account.sign(txs[0], network.generationHash);
            const transactionHttp = new TransactionHttp(network.node);
            return transactionHttp.announce(signedTx);
        } else if (txs.length === 2) {
            const firstSigned = account.sign(txs[0], network.generationHash);
            const secondSigned = account.sign(txs[1], network.generationHash);
            return this.announceChainedBinary(firstSigned, secondSigned, network);
        } else {
            throw new Error('Unexpected number of transactions: ' + txs.length);
        }
    }

    /**
     * Getter for PERSISTENT DELEGATION REQUEST transactions that will be staged
     * @return {TransferTransaction[]}
     */
    static async _getTransactions(action, account: AccountModel, network: NetworkModel, nodePublicKey: string): Promise<Transaction[]> {
        const maxFee = UInt64.fromUint(1000000); // TODO: UInt64.fromUint(feesConfig.highest); // fixed to the Highest, txs must get confirmed
        const txs: Transaction[] = [];
        const txsToBeAggregated: Transaction[] = [];

        const keys = await this.getAccountKeys(account, network);
        /*
         LINK
         START => link all (new keys)
         STOP =>  unlink all (linked keys)
         SWAP =>  unlink(linked) + link all (new keys)
         */
        const networkType = NetworkService.getNetworkTypeFromModel(network);

        if (keys.linked) {
            const accountKeyUnLinkTx = AccountKeyLinkTransaction.create(
                Deadline.create(network.epochAdjustment, 2),
                keys.linked.publicKey,
                LinkAction.Unlink,
                networkType,
                maxFee
            );
            txsToBeAggregated.push(accountKeyUnLinkTx);
        }

        if (keys.vrf) {
            const vrfKeyUnLinkTx = VrfKeyLinkTransaction.create(
                Deadline.create(network.epochAdjustment, 2),
                keys.vrf.publicKey,
                LinkAction.Unlink,
                networkType,
                maxFee
            );
            txsToBeAggregated.push(vrfKeyUnLinkTx);
        }

        if (keys.node) {
            const nodeUnLinkTx = NodeKeyLinkTransaction.create(
                Deadline.create(network.epochAdjustment, 2),
                keys.node.publicKey,
                LinkAction.Unlink,
                networkType,
                maxFee
            );
            txsToBeAggregated.push(nodeUnLinkTx);
        }

        const newRemoteAccount = Account.generateNewAccount(networkType);
        const newVrfAccount = Account.generateNewAccount(networkType);

        if (action !== 'STOP') {
            const accountKeyLinkTx = AccountKeyLinkTransaction.create(
                Deadline.create(network.epochAdjustment, 2),
                newRemoteAccount.publicKey,
                LinkAction.Link,
                networkType,
                maxFee
            );
            const vrfKeyLinkTx = VrfKeyLinkTransaction.create(
                Deadline.create(network.epochAdjustment, 2),
                newVrfAccount.publicKey,
                LinkAction.Link,
                networkType,
                maxFee
            );
            const nodeLinkTx = NodeKeyLinkTransaction.create(Deadline.create(network.epochAdjustment, 2), nodePublicKey, LinkAction.Link, networkType, maxFee);
            txsToBeAggregated.push(accountKeyLinkTx, vrfKeyLinkTx, nodeLinkTx);
        }

        if (txsToBeAggregated.length === 1) {
            txs.push(txsToBeAggregated[0]);
        }

        if (txsToBeAggregated.length > 1) {
            const currentSigner = PublicAccount.createFromPublicKey(account.id, networkType);
            txs.push(
                AggregateTransaction.createComplete(
                    Deadline.create(network.epochAdjustment, 2),
                    txsToBeAggregated.map(t => t.toAggregate(currentSigner)),
                    networkType,
                    [],
                    maxFee
                )
            );
        }

        if (action !== 'STOP') {
            const persistentDelegationReqTx = PersistentDelegationRequestTransaction.createPersistentDelegationRequestTransaction(
                Deadline.create(network.epochAdjustment, 2),
                newRemoteAccount.privateKey,
                newVrfAccount.privateKey,
                nodePublicKey,
                networkType,
                maxFee
            );
            txs.push(persistentDelegationReqTx);
        }

        return txs;
    }

    /**
     * Announce chained transactions
     * @param first
     * @param second
     * @param network
     * @returns {Promise<void>}
     */
    static announceChainedBinary(first: SignedTransaction, second: SignedTransaction, network): Observable<any> {
        const repositoryFactory = new RepositoryFactoryHttp(network.node, {
            websocketInjected: WebSocket,
        });
        const listener = repositoryFactory.createListener();
        const transactionService = new TransactionService(repositoryFactory.createTransactionRepository(), repositoryFactory.createReceiptRepository());
        return listener.open().then(() => {
            transactionService.announce(first, listener).subscribe(
                () => {
                    transactionService.announce(second, listener).subscribe(() => {
                        listener.close();
                    });
                },
                err => console.error(err)
            );
        });
    }
}
