import {SecureStorage} from "@src/utils/storage/SecureStorage";
import {createAccountFromMnemonic} from "@src/utils/SymbolMnemonic";
import {NetworkType} from "symbol-sdk";
import {createAccount} from "@src/utils/storage/RealmDB";

export default {
	namespace: 'wallet',
	state: {
		name: '',
		mnemonic: null,
		password: null,
		walletCreated: false,
		
		//TODO
		accounts: []
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
		}
	},
	actions: {
		saveWallet: async ({commit, state}, payload) => {
			await SecureStorage.saveMnemonic(state.wallet.mnemonic);
			const mainnetAccount = createAccountFromMnemonic(state.wallet.mnemonic, 0, NetworkType.MAIN_NET);
			await createAccount(state.wallet.name, 0, '', mainnetAccount.address.pretty(), NetworkType.MAIN_NET, '', mainnetAccount.publicKey);
			const testnetAccount = createAccountFromMnemonic(state.wallet.mnemonic, 0, NetworkType.TEST_NET);
			await createAccount(state.wallet.name, 0, '', testnetAccount.address.pretty(), NetworkType.TEST_NET, '', testnetAccount.publicKey);

			commit({type: 'wallet/setWalletCreated', payload: true});
		}
	}
}
