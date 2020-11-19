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
            await dispatchAction({ type: 'wallet/createHdAccount', payload: { name: state.wallet.name, index: 0 } });
        },
        reloadAccounts: async ({ commit }) => {
            const accounts = await AccountSecureStorage.getAllAccounts();
            commit({ type: 'wallet/setAccounts', payload: accounts });
        },
        loadAccount: async ({ commit, dispatchAction, state }, id) => {
            let accountModel;
            if (id) {
                accountModel = await AccountSecureStorage.getAccountById(id);
            } else {
                accountModel = (await AccountSecureStorage.getAllAccounts())[0];
            }
            await commit({ type: 'wallet/setSelectedAccount', payload: accountModel });
            await dispatchAction({ type: 'account/loadAllData', payload: true });
            GlobalListener.listen(accountModel);
        },
        createHdAccount: async ({ commit, state, dispatchAction }, { index, name }) => {
            let mnemonicModel = await MnemonicSecureStorage.retrieveMnemonic();
            if (!index) {
                mnemonicModel = await MnemonicSecureStorage.increaseLastBipDerivedPath();
                index = mnemonicModel.lastIndexDerived;
            }
            const accountModel = AccountService.createFromMnemonicAndIndex(mnemonicModel.mnemonic, index, name);
            await AccountSecureStorage.createNewAccount(accountModel);
            await dispatchAction({ type: 'wallet/reloadAccounts' });
            dispatchAction({ type: 'wallet/loadAccount', payload: accountModel.id });
        },
        createPkAccount: async ({ commit, state, dispatchAction }, { privateKey, name }) => {
            const accountModel = AccountService.createFromPrivateKey(privateKey, name);
            await AccountSecureStorage.createNewAccount(accountModel);
            await dispatchAction({ type: 'wallet/reloadAccounts' });
            await dispatchAction({ type: 'wallet/loadAccount', payload: accountModel.id });
        },
        removeAccount: async ({ commit, dispatchAction, state }, id) => {
            await AccountService.removeAccountById(id);
            await dispatchAction({ type: 'wallet/reloadAccounts' });
        },
        renameAccount: async ({ commit, dispatchAction, state }, { id, newName }) => {
            const accounts = await AccountService.renameAccount(id, newName);
            const selectedAccount = await AccountSecureStorage.getAccountById(state.wallet.selectedAccount.id);
            commit({ type: 'wallet/setSelectedAccount', payload: selectedAccount });
            commit({ type: 'wallet/setAccounts', payload: accounts });
        },
        updateDelegatedHarvestingInfo: async ({ commit, dispatchAction, state }, { id, isPersistentDelReqSent, harvestingNode }) => {
            const accounts = await AccountService.updateDelegatedHarvestingInfo(id, isPersistentDelReqSent, harvestingNode);
            const selectedAccount = await AccountSecureStorage.getAccountById(state.wallet.selectedAccount.id);
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
