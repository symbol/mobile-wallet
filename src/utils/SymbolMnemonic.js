import {MnemonicPassPhrase} from "symbol-hd-wallets";

/**
 * Generates an english mnemonic passphrase via nem2-hd-wallets SDK
 *
 * @return {string} Space separated words as string
 */
export const createRandomMnemonic = (): string => {
    return MnemonicPassPhrase.createRandom().plain;
};
