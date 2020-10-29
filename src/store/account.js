import AccountService from '@src/services/AccountService';
import { AccountSecureStorage } from '@src/storage/persistence/AccountSecureStorage';
import { MnemonicSecureStorage } from '@src/storage/persistence/MnemonicSecureStorage';

export default {
    namespace: 'account',
    state: {
        selectedAccount: null,
        balance: 0,
    },
    mutations: {
        setSelectedAccount(state, payload) {
            state.account.selectedAccount = payload;
            return state;
        },
        setBalance(state, payload) {
            state.account.balance = payload;
            return state;
        },
    },
    actions: {
        createHdAccount: async ({ commit, state, dispatchAction }, { index, name }) => {
            const mnemonic = await MnemonicSecureStorage.retrieveMnemonic();
            const accountModel = AccountService.createFromMnemonicAndIndex(mnemonic, index, name);
            await AccountSecureStorage.createNewAccount(accountModel);
            dispatchAction({ type: 'account/loadAccount', payload: accountModel.id });
        },
        loadAccount: async ({ commit, state }, id) => {
            let accountModel;
            if (id) {
                accountModel = await AccountSecureStorage.getAccountById(id);
            } else {
                accountModel = (await AccountSecureStorage.getAllAccounts())[0];
            }
            const address = await AccountService.getAddressByAccountModelAndNetwork(accountModel, state.network.network);
            console.log('node');
            console.log(state.network.selectedNode);
            const balance = await AccountService.getBalanceFromAddress(address, state.network.selectedNode);
            console.log(balance);
            commit({ type: 'account/setSelectedAccount', payload: accountModel });
            commit({ type: 'account/setBalance', payload: balance });
        },
    },
};
