import { BaseSecureStorage } from '@src/storage/persistence/BaseSecureStorage';
import type { MnemonicModel } from '@src/storage/models/MnemonicModel';

export class MnemonicSecureStorage extends BaseSecureStorage {
    /** MNEMONIC KEY **/
    static MNEMONIC_KEY = 'MNEMONIC_MODEL';

    /**
     * Save mnemonic
     * @param mnemonic
     * @param index
     * @returns {Promise<string | null>}
     */
    static async saveMnemonic(mnemonic: string, index: number = -1): Promise<MnemonicModel> {
        const mnemonicModel: MnemonicModel = { mnemonic: mnemonic, lastIndexDerived: index };
        await this.secureSaveAsync(this.MNEMONIC_KEY, JSON.stringify(mnemonicModel));
        return mnemonicModel;
    }

    /**
     * Retrieves mnemonic model
     * @returns {Promise<MnemonicModel>}
     */
    static async retrieveMnemonic(): Promise<MnemonicModel> {
        const mnemonic = await this.secureRetrieveAsync(this.MNEMONIC_KEY);
        try {
            return JSON.parse(mnemonic);
        } catch (e) {
            return null;
        }
    }

    /**
     * Increases last bip derived path
     * @returns {Promise<MnemonicModel>}
     */
    static async increaseLastBipDerivedPath(): Promise<MnemonicModel> {
        const mnemonicModel = await this.retrieveMnemonic();
        mnemonicModel.lastIndexDerived += 1;
        return this.saveMnemonic(mnemonicModel.mnemonic, mnemonicModel.lastIndexDerived);
    }

    /**
     * Decrease last bip derived path
     * @returns {Promise<void>}
     */
    static async decreaseLastBipDerivedPath(): Promise<MnemonicModel> {
        const mnemonicModel = await this.retrieveMnemonic();
        mnemonicModel.lastIndexDerived -= 1;
        return this.saveMnemonic(mnemonicModel.mnemonic, mnemonicModel.lastIndexDerived);
    }

    /**
     * Clear all keys
     * @returns {Promise<string | null>}
     */
    static clear() {
        return this.removeKey(this.MNEMONIC_KEY);
    }
}
