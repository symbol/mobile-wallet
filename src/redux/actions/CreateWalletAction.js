import {createAccount, createWallet} from "../../utils/storage/RealmDB";
import {SecureStorage} from "../../utils/storage/SecureStorage";
import {NetworkType} from "symbol-sdk";
import {createAccountFromMnemonic} from "../../utils/SymbolMnemonic";

export const SET_NAME = 'SET_NAME';
export const SET_MNEMONIC_PASSPHRASE = 'SET_MNEMONIC_PASSPHRASE';
export const SET_PASSWORD = 'SET_PASSWORD';
export const SAVE_WALLET = 'SAVE_WALLET';

export const setName = name => ({
    type: SET_NAME,
    payload: name
});

export const setMnemonic = mnemonic => ({
    type: SET_MNEMONIC_PASSPHRASE,
    payload: mnemonic
});

export const setPassword = password => ({
    type: SET_PASSWORD,
    payload: password
});

export const saveWallet = async (name, mnemonic) => {
    await SecureStorage.saveMnemonic(mnemonic);
    const mainnetAccount = createAccountFromMnemonic(mnemonic, 0, NetworkType.MAIN_NET);
    await createAccount(name, 0, '', mainnetAccount.address.pretty(), NetworkType.MAIN_NET, '', mainnetAccount.publicKey);
    const testnetAccount = createAccountFromMnemonic(mnemonic, 0, NetworkType.TEST_NET);
    await createAccount(name, 0, '', testnetAccount.address.pretty(), NetworkType.TEST_NET, '', testnetAccount.publicKey);

    return {
        type: SAVE_WALLET,
        payload: null
    }
};
