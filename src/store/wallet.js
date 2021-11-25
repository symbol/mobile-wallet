import { MnemonicSecureStorage } from '@src/storage/persistence/MnemonicSecureStorage';
import AccountService from '@src/services/AccountService';
import { AccountSecureStorage } from '@src/storage/persistence/AccountSecureStorage';
import { GlobalListener } from '@src/store/index';
import { Network } from 'symbol-hd-wallets';
import { getWhitelistedPublicKeys } from '../config/environment';

export default {
    namespace: 'wallet',
    state: {
        name: '',
        mnemonic: null,
        password: null,
        selectedAccount: {},
        accounts: [],
        accountBalances: {},
    },
    mutations: {
        setName(state, payload) {
            state.wallet.name = payload;
            return state;
        },
        setPassword(state, payload) {
            state.wallet.password = payload;
            return state;
        },
        setMnemonic(state, payload) {
            state.wallet.mnemonic = payload;
            return state;
        },
        setSelectedAccount(state, payload) {
            state.wallet.selectedAccount = payload;
            return state;
        },
        setAccounts(state, payload) {
            state.wallet.accounts = payload;
            return state;
        },
        setAccountBalances(state, payload) {
            state.wallet.accountBalances = payload;
            return state;
        },
    },
    actions: {
        initState: async ({ commit, state, dispatchAction }) => {
            const mnemonicModel = await MnemonicSecureStorage.retrieveMnemonic();
            commit({
                type: 'wallet/setMnemonic',
                payload: mnemonicModel.mnemonic,
            });
            await dispatchAction({ type: 'wallet/reloadAccounts' });
            if (state.wallet.accounts.length > 0) {
                await dispatchAction({ type: 'wallet/loadAccount' });
            }
        },
        saveWallet: async ({ state, dispatchAction }) => {
            await MnemonicSecureStorage.saveMnemonic(state.wallet.mnemonic);
            let mnemonicModel = await MnemonicSecureStorage.retrieveMnemonic();

            const mainnetAccountModel = AccountService.createFromMnemonicAndIndex(
                mnemonicModel.mnemonic,
                0,
                state.wallet.name,
                'mainnet'
            );
            await AccountSecureStorage.createNewAccount(mainnetAccountModel);
            const testnetAccountModel = AccountService.createFromMnemonicAndIndex(
                mnemonicModel.mnemonic,
                0,
                state.wallet.name,
                'testnet'
            );
            await AccountSecureStorage.createNewAccount(testnetAccountModel);
            const optinAccounts = [];
            for (let i = 0; i < 10; i++) {
                const optinMainnetAccount = AccountService.createFromMnemonicAndIndex(
                    mnemonicModel.mnemonic,
                    i,
                    `Opt In Account ${i + 1}`,
                    'mainnet',
                    Network.BITCOIN
                );
                if (
                    getWhitelistedPublicKeys('mainnet').indexOf(
                        optinMainnetAccount.id
                    ) >= 0
                ) {
                    optinAccounts.push(optinMainnetAccount);
                }
                const optinTestnetAccount = AccountService.createFromMnemonicAndIndex(
                    mnemonicModel.mnemonic,
                    i,
                    `Opt In Account ${i + 1}`,
                    'testnet',
                    Network.BITCOIN
                );
                if (
                    getWhitelistedPublicKeys('testnet').indexOf(
                        optinTestnetAccount.id
                    ) >= 0
                ) {
                    optinAccounts.push(optinTestnetAccount);
                }
            }
            for (let account of optinAccounts) {
                await AccountSecureStorage.createNewAccount(account);
            }
            await dispatchAction({ type: 'wallet/reloadAccounts' });
            await dispatchAction({
                type: 'wallet/loadAccount',
                payload:
                    state.network.network === 'testnet'
                        ? testnetAccountModel.id
                        : mainnetAccountModel.id,
            });
        },
        reloadAccounts: async ({ commit, state, dispatchAction }) => {
            const accounts = await AccountSecureStorage.getAllAccountsByNetwork(
                state.network.network
            );
            commit({ type: 'wallet/setAccounts', payload: accounts });
            await dispatchAction({ type: 'wallet/loadAccountsBalances' });
        },
        loadAccountsBalances: async ({ commit, state }) => {
            try {
                const balancePairs = await Promise.all(
                    state.wallet.accounts.map(account => {
                        return new Promise(async resolve => {
                            try {
                                const rawAddress = AccountService.getAddressByAccountModelAndNetwork(
                                    account,
                                    state.network.network
                                );
                                const data = await AccountService.getBalanceAndOwnedMosaicsFromAddress(
                                    rawAddress,
                                    state.network.selectedNetwork
                                );
                                resolve({
                                    id: account.id,
                                    balance: data.balance,
                                });
                            } catch {
                                resolve({
                                    id: account.id,
                                    balance: 0,
                                });
                            }
                        });
                    })
                );
                const accountBalances = balancePairs.reduce((acc, pair) => {
                    acc[pair.id] = pair.balance;
                    return acc;
                }, {});
                commit({
                    type: 'wallet/setAccountBalances',
                    payload: accountBalances,
                });
            } catch (e) {
                console.log(e);
                commit({ type: 'wallet/setAccountBalances', payload: {} });
            }
        },
        loadAccount: async ({ commit, dispatchAction, state }, id) => {
            let accountModel;
            if (id) {
                accountModel = await AccountSecureStorage.getAccountById(
                    id,
                    state.network.network
                );
            } else {
                accountModel = (
                    await AccountSecureStorage.getAllAccountsByNetwork(
                        state.network.network
                    )
                )[0];
            }
            await commit({
                type: 'wallet/setSelectedAccount',
                payload: accountModel,
            });
            const rawAddress = AccountService.getAddressByAccountModelAndNetwork(
                accountModel,
                state.network.network
            );
            await GlobalListener.listen(rawAddress);
            await dispatchAction({
                type: 'account/loadAllData',
                payload: true,
            });
        },
        createHdAccount: async ({ state, dispatchAction }, { index, name }) => {
            let mnemonicModel = await MnemonicSecureStorage.retrieveMnemonic();
            if (!index) {
                index = await AccountService.getNextIndex(
                    state.network.network
                );
            }
            const accountModel = AccountService.createFromMnemonicAndIndex(
                mnemonicModel.mnemonic,
                index,
                name,
                state.network.network
            );
            await AccountSecureStorage.createNewAccount(accountModel);
            await dispatchAction({ type: 'wallet/reloadAccounts' });
            dispatchAction({
                type: 'wallet/loadAccount',
                payload: accountModel.id,
            });
        },
        createPkAccount: async (
            { state, dispatchAction },
            { privateKey, name }
        ) => {
            const accountModel = AccountService.createFromPrivateKey(
                privateKey,
                name,
                state.network.network
            );
            await AccountSecureStorage.createNewAccount(accountModel);
            await dispatchAction({ type: 'wallet/reloadAccounts' });
            await dispatchAction({
                type: 'wallet/loadAccount',
                payload: accountModel.id,
            });
        },
        removeAccount: async ({ dispatchAction, state }, id) => {
            await AccountService.removeAccountById(id, state.network.network);
            await dispatchAction({ type: 'wallet/reloadAccounts' });
        },
        renameAccount: async ({ commit, state }, { id, newName }) => {
            const accounts = await AccountService.renameAccount(
                id,
                newName,
                state.network.network
            );
            const selectedAccount = await AccountSecureStorage.getAccountById(
                state.wallet.selectedAccount.id,
                state.network.network
            );
            commit({
                type: 'wallet/setSelectedAccount',
                payload: selectedAccount,
            });
            commit({ type: 'wallet/setAccounts', payload: accounts });
        },
        updateDelegatedHarvestingInfo: async (
            { commit, state },
            { id, isPersistentDelReqSent, harvestingNode }
        ) => {
            const accounts = await AccountService.updateDelegatedHarvestingInfo(
                id,
                isPersistentDelReqSent,
                harvestingNode,
                state.network.network
            );
            const selectedAccount = await AccountSecureStorage.getAccountById(
                state.wallet.selectedAccount.id,
                state.network.network
            );
            commit({
                type: 'wallet/setSelectedAccount',
                payload: selectedAccount,
            });
            commit({ type: 'wallet/setAccounts', payload: accounts });
        },
        downloadPaperWallet: async ({ state }) => {
            const accounts = state.wallet.accounts || [];
            const mnemonic = await MnemonicSecureStorage.retrieveMnemonic();
            return AccountService.generatePaperWallet(
                mnemonic.mnemonic,
                accounts,
                state.network
            );
        },
    },
};
