import RNSecureStorage, {ACCESSIBLE} from "rn-secure-storage";

export class SecureStorage {
    static MNEMONIC_KEY = 'MNEMONIC';

    static saveMnemonic(mnemonic: string) {
        return this.secureSaveAsync(this.MNEMONIC_KEY, mnemonic);
    }

    static retrieveMnemonic() {
        return this.secureRetrieveAsync(this.MNEMONIC_KEY);
    }

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
}
