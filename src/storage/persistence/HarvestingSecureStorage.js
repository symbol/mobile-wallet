import { BaseSecureStorage } from '@src/storage/persistence/BaseSecureStorage';
import type { AccountModel } from '@src/storage/models/AccountModel';
import type { HarvestingModel } from '@src/storage/models/HarvestingModel';

export class HarvestingSecureStorage extends BaseSecureStorage {
    /** HARVESTING DB KEY **/
    static HARVESTING_KEY = 'HARVESTING';

    /**
     * Creates a new harvesting model
     * @returns {Promise<any>}
     * @param model
     */
    static async saveHarvestingModel(model: HarvestingModel): Promise<any> {
        return this.secureSaveAsync(this.HARVESTING_KEY, JSON.stringify(model));
    }

    /**
     * Get harvesting model
     * @returns {Promise<AccountModel[]>}
     */
    static async getHarvestingModel(): Promise<HarvestingModel | null> {
        const harvestingString = await this.secureRetrieveAsync(this.HARVESTING_KEY);
        let harvestingModel;
        try {
            harvestingModel = JSON.parse(harvestingString) || null;
        } catch (e) {
            return null;
        }
        return harvestingModel;
    }

    /**
     * Clear all keys
     * @returns {Promise<string | null>}
     */
    static clear() {
        return this.removeKey(this.HARVESTING_KEY);
    }
}
