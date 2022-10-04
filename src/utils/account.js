import { Account, NetworkType } from 'symbol-sdk';

export const getPublicKeyFromPrivateKey = (privateKey: string) => {
    return Account.createFromPrivateKey(privateKey, NetworkType.MAIN_NET).publicKey;
};

export const isPrivateKeyValid = (privateKey: string): boolean => {
    try {
        Account.createFromPrivateKey(privateKey, NetworkType.MAIN_NET);
        return true;
    } catch (e) {
        return false;
    }
};

export const getMultisigInfoListFromMultisigGraphInfo = multisigAccountGraphInfo => {
    const { multisigEntries } = multisigAccountGraphInfo;
    const levels = [...multisigEntries.keys()].sort((a, b) => b - a);

    return levels
        .map(level => multisigEntries.get(level) || [])
        .filter(multisigInfoList => multisigInfoList.length > 0)
        .flat();
};
