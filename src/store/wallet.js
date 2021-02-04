import { MnemonicSecureStorage } from '@src/storage/persistence/MnemonicSecureStorage';
import AccountService from '@src/services/AccountService';
import { AccountSecureStorage } from '@src/storage/persistence/AccountSecureStorage';
import { GlobalListener } from '@src/store/index';

export default {
    namespace: 'wallet',
    state: {
        name: '',
        mnemonic: null,
        password: null,
        selectedAccount: {},
        accounts: [],
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
    },
    actions: {
        initState: async ({ commit, state, dispatchAction }) => {
            const mnemonicModel = await MnemonicSecureStorage.retrieveMnemonic();
            commit({ type: 'wallet/setMnemonic', payload: mnemonicModel.mnemonic });
            await dispatchAction({ type: 'wallet/reloadAccounts' });
            if (state.wallet.accounts.length > 0) {
                await dispatchAction({ type: 'wallet/loadAccount' });
            }
        },
        saveWallet: async ({ state, dispatchAction }) => {
            await MnemonicSecureStorage.saveMnemonic(state.wallet.mnemonic);
            let mnemonicModel = await MnemonicSecureStorage.retrieveMnemonic();

            const mainnetAccountModel = AccountService.createFromMnemonicAndIndex(mnemonicModel.mnemonic, 0, state.wallet.name, 'mainnet');
            await AccountSecureStorage.createNewAccount(mainnetAccountModel);
            const testnetAccountModel = AccountService.createFromMnemonicAndIndex(mnemonicModel.mnemonic, 0, state.wallet.name, 'testnet');
            await AccountSecureStorage.createNewAccount(testnetAccountModel);

            await dispatchAction({ type: 'wallet/reloadAccounts' });
            dispatchAction({ type: 'wallet/loadAccount', payload: state.network.network === 'testnet' ? testnetAccountModel.id : mainnetAccountModel.id });
        },
        reloadAccounts: async ({ commit, state }) => {
            const accounts = await AccountSecureStorage.getAllAccountsByNetwork(state.network.network);
            commit({ type: 'wallet/setAccounts', payload: accounts });
        },
        loadAccount: async ({ commit, dispatchAction, state }, id) => {
            let accountModel;
            if (id) {
                accountModel = await AccountSecureStorage.getAccountById(id, state.network.network);
            } else {
                accountModel = (await AccountSecureStorage.getAllAccountsByNetwork(state.network.network))[0];
            }
            await commit({ type: 'wallet/setSelectedAccount', payload: accountModel });
            const rawAddress = AccountService.getAddressByAccountModelAndNetwork(accountModel, state.network.network);
            await GlobalListener.listen(rawAddress);
            await dispatchAction({ type: 'account/loadAllData', payload: true });
        },
        createHdAccount: async ({ commit, state, dispatchAction }, { index, name }) => {
            let mnemonicModel = await MnemonicSecureStorage.retrieveMnemonic();
            if (!index) {
                index = await AccountService.getNextIndex(state.network.network);
            }
            const accountModel = AccountService.createFromMnemonicAndIndex(mnemonicModel.mnemonic, index, name, state.network.network);
            await AccountSecureStorage.createNewAccount(accountModel);
            await dispatchAction({ type: 'wallet/reloadAccounts' });
            dispatchAction({ type: 'wallet/loadAccount', payload: accountModel.id });
        },
        createPkAccount: async ({ commit, state, dispatchAction }, { privateKey, name }) => {
            const accountModel = AccountService.createFromPrivateKey(privateKey, name, state.network.network);
            await AccountSecureStorage.createNewAccount(accountModel);
            await dispatchAction({ type: 'wallet/reloadAccounts' });
            await dispatchAction({ type: 'wallet/loadAccount', payload: accountModel.id });
        },
        removeAccount: async ({ commit, dispatchAction, state }, id) => {
            await AccountService.removeAccountById(id, state.network.network);
            await dispatchAction({ type: 'wallet/reloadAccounts' });
        },
        renameAccount: async ({ commit, dispatchAction, state }, { id, newName }) => {
            const accounts = await AccountService.renameAccount(id, newName, state.network.network);
            const selectedAccount = await AccountSecureStorage.getAccountById(state.wallet.selectedAccount.id, state.network.network);
            commit({ type: 'wallet/setSelectedAccount', payload: selectedAccount });
            commit({ type: 'wallet/setAccounts', payload: accounts });
        },
        updateDelegatedHarvestingInfo: async ({ commit, dispatchAction, state }, { id, isPersistentDelReqSent, harvestingNode }) => {
            const accounts = await AccountService.updateDelegatedHarvestingInfo(id, isPersistentDelReqSent, harvestingNode, state.network.network);
            const selectedAccount = await AccountSecureStorage.getAccountById(state.wallet.selectedAccount.id, state.network.network);
            commit({ type: 'wallet/setSelectedAccount', payload: selectedAccount });
            commit({ type: 'wallet/setAccounts', payload: accounts });
        },
        downloadPaperWallet: async ({ state }) => {
            const accounts = state.wallet.accounts || [];
            const mnemonic = await MnemonicSecureStorage.retrieveMnemonic();
            return AccountService.generatePaperWallet(mnemonic.mnemonic, accounts, state.network);
        },
    },
};
