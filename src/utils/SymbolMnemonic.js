import {ExtendedKey, MnemonicPassPhrase, Network, Wallet} from "symbol-hd-wallets";
import {NetworkType} from "symbol-sdk";

/**
 * Generates an english mnemonic passphrase via symbol-hd-wallets SDK
 *
 * @return {string} Space separated words as string
 */
export const createRandomMnemonic = (): string => {
    return MnemonicPassPhrase.createRandom().plain;
};

export const createAccountFromMnemonic = (plainMnemonic: string, index: number, networkType: NetworkType): Account => {
    const mnemonic = new MnemonicPassPhrase(plainMnemonic);
    const seed = mnemonic.toSeed().toString('hex');
    const extKey = ExtendedKey.createFromSeed(seed);
    const wallet = new Wallet(extKey);

    const path = `m/44'/4343'/${index}'/0'/0'`;
    return wallet.getChildAccount(path, NetworkType.TEST_NET);
};
