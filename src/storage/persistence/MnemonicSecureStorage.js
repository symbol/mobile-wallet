import { BaseSecureStorage } from '@src/storage/persistence/BaseSecureStorage';
import type { MnemonicModel } from '@src/storage/models/MnemonicModel';

export class MnemonicSecureStorage extends BaseSecureStorage {
    /** MNEMONIC KEY **/
    static MNEMONIC_KEY = 'MNEMONIC';

    /**
     * Save mnemonic
     * @param mnemonic
     * @returns {Promise<string | null>}
     */
    static async saveMnemonic(mnemonic: string): Promise<MnemonicModel> {
        const mnemonicModel: MnemonicModel = { mnemonic: mnemonic, lastIndexDerived: 0 };
        await this.secureSaveAsync(this.MNEMONIC_KEY, mnemonic);
        return mnemonicModel;
    }

    /**
     * Retrieves mnemonic model
     * @returns {Promise<MnemonicModel>}
     */
    static retrieveMnemonic(): Promise<MnemonicModel> {
        return this.secureRetrieveAsync(this.MNEMONIC_KEY);
    }

    /**
     * Clear all keys
     * @returns {Promise<string | null>}
     */
    static clear() {
        return this.removeKey(this.MNEMONIC_KEY);
    }
}
