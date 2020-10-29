import { SecureStorage } from '@src/utils/storage/SecureStorage';
import { NetworkType, Account } from 'symbol-sdk';

export default {
    namespace: 'wallet',
    state: {
        name: '',
        mnemonic: null,
        password: null,
        walletCreated: false,
        selectedAccount: {
            account: null,
            id: null,
            name: null,
            type: null,
        },
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
        setWalletCreated(state, payload) {
            state.wallet.created = payload;
            return state;
        },
        setSelectedAccount(state, payload) {
            state.wallet.selectedAccount = payload;
            return state;
        },
    },
    actions: {
        saveWallet: async ({ commit, state, dispatchAction }, payload) => {
            await SecureStorage.saveMnemonic(state.wallet.mnemonic);
            dispatchAction({ type: 'account/createHdAccount', payload: { name: state.wallet.name, index: 0 } });
        },
    },
};
