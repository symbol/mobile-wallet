import { Account, NetworkType } from 'symbol-sdk';

export const getPublicKeyFromPrivateKey = (privateKey: string) => {
    return Account.createFromPrivateKey(privateKey, NetworkType.MAIN_NET)
        .publicKey;
};

export const isPrivateKeyValid = (privateKey: string): boolean => {
    try {
        Account.createFromPrivateKey(privateKey, NetworkType.MAIN_NET);
        return true;
    } catch (e) {
        return false;
    }
};
