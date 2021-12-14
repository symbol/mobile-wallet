import { NativeModules, Platform } from 'react-native';
import VersionInfo from 'react-native-version-info';

const PRODUCT_BUNDLE_IDENTIFIER = 'com.nemgrouplimited.symbolwallet';

export class VersionService {
    static get appVersion() {
        return VersionInfo.appVersion;
    }

    // Fetch latest version from App Store API and compare with the "CFBundleShortVersionString"
    static async checkIOSNeedsUpdate(): Promise<boolean> {
        try {
            const endpoint = `https://itunes.apple.com/us/lookup?bundleId=${PRODUCT_BUNDLE_IDENTIFIER}`;
            const data = await fetch(endpoint).then(response => response.json());
            const latestAppVersion = data.results[0].version;

            return latestAppVersion !== VersionService.appVersion;
        } catch {
            return false;
        }
    }

    // Delegate version check to the InAppUpdate Android native module
    static async checkAndroidNeedsUpdate(): Promise<null> {
        NativeModules.InAppUpdate.checkUpdate();

        return null;
    }

    static checkAppNeedsUpdate(): Promise<boolean | null> {
        if (Platform.OS === 'android') {
            return VersionService.checkAndroidNeedsUpdate();
        } else {
            return VersionService.checkIOSNeedsUpdate();
        }
    }
}
