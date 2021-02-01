import { BaseSecureStorage } from '@src/storage/persistence/BaseSecureStorage';
import type { AccountModel } from '@src/storage/models/AccountModel';
import type { HarvestingModel } from '@src/storage/models/HarvestingModel';

export class HarvestingSecureStorage extends BaseSecureStorage {
    /** HARVESTING DB KEY **/
    static HARVESTING_KEY = 'HARVESTING';

    /**
     * Creates a new harvesting model
     * @returns {Promise<any>}
     * @param id
     * @param model
     */
    static async saveHarvestingModel(id: string, model: HarvestingModel): Promise<any> {
        const harvestingString = await this.secureRetrieveAsync(this.HARVESTING_KEY);
        let harvestingModelsPerAccount;
        try {
            harvestingModelsPerAccount = JSON.parse(harvestingString) || {};
        } catch (e) {
            harvestingModelsPerAccount = {};
        }
        harvestingModelsPerAccount[id] = model;
        return this.secureSaveAsync(this.HARVESTING_KEY, JSON.stringify(harvestingModelsPerAccount));
    }

    /**
     * Get harvesting model
     * @returns {Promise<AccountModel[]>}
     */
    static async getHarvestingModel(id: string): Promise<HarvestingModel | null> {
        const harvestingString = await this.secureRetrieveAsync(this.HARVESTING_KEY);
        let harvestingModel;
        try {
            const harvestingModelsPerAccount = JSON.parse(harvestingString) || {};
            harvestingModel = harvestingModelsPerAccount[id] || null;
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
