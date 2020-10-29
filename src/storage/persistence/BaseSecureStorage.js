import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';

export class BaseSecureStorage {
    static secureSaveAsync = async (key: string, value: string) => {
        return RNSecureStorage.set(key, value, {
            accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY, // iOS only
        });
    };

    static secureRetrieveAsync = async (key: string) => {
        try {
            const data = await RNSecureStorage.get(key);
            return data;
        } catch (e) {
            return null;
        }
    };

    static removeKey = async (key: string) => {
        return RNSecureStorage.remove(key);
    };
}
