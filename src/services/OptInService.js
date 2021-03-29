import nem from 'nem-sdk';
import { NIS1AccountSecureStorage } from '@src/storage/persistence/NIS1AccountSecureStorage';
import type { AppNetworkType } from '@src/storage/models/NetworkModel';
import {broadcastDTO, buildSimpleDTO, NormalCache, OptinConfig, status, StatusCode} from 'symbol-post-launch-optin';
import { Account, NetworkType, Address } from 'symbol-sdk';
import type { AccountModel } from '@src/storage/models/AccountModel';
import store from '@src/store';
import NetworkService from '@src/services/NetworkService';

export type NIS1Account = {
    privateKey: string,
    publicKey: string,
    address: string,
};

export default class OptInService {
    /**
     * Get NIS1 account private keys
     */
    static async getNISAccounts(network: AppNetworkType): Promise<NIS1Account[]> {
        const privateKeys = (await NIS1AccountSecureStorage.retrieveAccounts()) || [];
        return privateKeys.map(privateKey => {
            const keyPair = nem.crypto.keyPair.create(privateKey);
            const publicKey = keyPair.publicKey.toString();
            const address = nem.utils.format.pubToAddress(
                publicKey,
                network === 'testnet' ? nem.model.network.data.testnet.id : nem.model.network.data.mainnet.id
            );
            return { address: address, privateKey: privateKey, publicKey: publicKey };
        });
    }

    /**
     * Add nis account
     * @param privateKey
     * @returns {Promise<string>}
     */
    static async addNISAccount(privateKey: string): Promise<void> {
        return NIS1AccountSecureStorage.saveAccount(privateKey);
    }

    /**
     * Add nis account
     * @returns {Promise<string>}
     * @param account
     */
    static async removeNIS1Account(account: NIS1Account): Promise<void> {
        return NIS1AccountSecureStorage.removeAccount(account.privateKey);
    }

    /**
     * Get NIS1 account balance
     */
    static async getNISAccountOptInBalance(address: string): Promise<number> {
        return new Promise(resolve => {
            fetch('http://ec2-34-254-63-52.eu-west-1.compute.amazonaws.com/balance?address=' + address).then(rawBalance => {
                rawBalance.json().then(res => {
                    resolve(res.amount);
                });
            }).catch(e => {
                resolve(0)
            });
        });
    }

    static async fetchNIS1Data(address: string, network: AppNetworkType): Promise<any> {
        return nem.com.requests.account.data(this.getOptInConfig(network).NIS.endpoint, address);
    }

    /**
     * Get NIS1 account balance
     */
    static async getOptInStatus(
        address: string,
        network: AppNetworkType
    ): Promise<{
        balance: number,
        status: StatusCode,
        error: string | null,
        destination: string | null,
    }> {
        const balance = await this.getNISAccountOptInBalance(address);
        const accountData = await this.fetchNIS1Data(address, network);
        const cache = new NormalCache(accountData, this.getOptInConfig(network));
        await cache.loadFromChain();
        const statusCode = await status(accountData, this.getOptInConfig(network), cache);
        const destinationAddress = cache.simpleDTO
            ? Address.createFromPublicKey(cache.simpleDTO.data.destination, NetworkService.getNetworkTypeFromModel({ type: network })).pretty()
            : null;
        return {
            balance: balance,
            status: statusCode,
            error: cache.errorDTO ? cache.errorDTO.code : null,
            destination: destinationAddress,
        };
    }

    /**
     * Get NIS1 account balance
     */
    static async doSimpleOptIn(nis1Account: NIS1Account, destination: AccountModel, network: AppNetworkType): Promise<string> {
        const destinationAccount = Account.createFromPrivateKey(destination.privateKey, NetworkService.getNetworkTypeFromModel({ type: network }));
        const simpleDTO = buildSimpleDTO(destinationAccount);
        const result = await broadcastDTO(nis1Account.privateKey, simpleDTO, this.getOptInConfig(network));
        if (result !== 'SUCCESS') {
            throw new Error(result);
        }
    }

    static getOptInConfig(network: AppNetworkType): OptinConfig {
        switch (network) {
            case 'testnet':
                return {
                    NIS: {
                        endpoint: {
                            host: store.getState().settings.selectedNISNode,
                            port: 7890,
                        },
                        network: nem.model.network.data.testnet.id,
                        configAddress: 'TAXF5HUGBKGSC3MOJCRXN5LLKFBY43LXI3DE2YLS',
                        errorAccountPublicKey: 'dd215238aab71f375fc79455e2fe0e3c4f96ba7dadd5f3c102979c6958b9c337',
                    },
                    SYM: {
                        network: NetworkType.TEST_NET,
                        generationHash: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
                    },
                };
            case 'mainnet':
                return {
                    NIS: {
                        endpoint: {
                            host: store.getState().settings.selectedNISNode,
                            port: 7890,
                        },
                        network: nem.model.network.data.mainnet.id,
                        configAddress: 'NAWIP6WBLEAHUHWJ757Q2UXTVE3DYVDNNDAVWLUZ',
                        errorAccountPublicKey: 'dd215238aab71f375fc79455e2fe0e3c4f96ba7dadd5f3c102979c6958b9c337',
                    },
                    SYM: {
                        network: NetworkType.MAIN_NET,
                        generationHash: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
                    },
                };
        }
    }
}
