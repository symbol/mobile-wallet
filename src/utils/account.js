import { Account, NetworkType } from 'symbol-sdk';

export const getPublicKeyFromPrivateKey = (privateKey: string) => {
    return Account.createFromPrivateKey(privateKey, NetworkType.MAIN_NET).publicKey;
}
