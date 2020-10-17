export const SET_NAME = 'SET_NAME';
export const SET_MNEMONIC_PASSPHRASE = 'SET_MNEMONIC_PASSPHRASE';
export const SET_PASSWORD = 'SET_PASSWORD';

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
