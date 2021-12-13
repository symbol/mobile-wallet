import { Platform } from 'react-native';

const PRODUCT_BUNDLE_IDENTIFIER = 'com.nemgrouplimited.symbolwallet';

export class VersionService {
    static async checkAppVersionIsUpToDate(): Promise<boolean> {
        if (Platform.OS === 'ios') {
            const countryCode = 'us';
            const endpoint = `https://itunes.apple.com/${countryCode}/lookup?bundleId=${PRODUCT_BUNDLE_IDENTIFIER}`;
            const version = fetch(endpoint)
                .then(response => response.json())
                .then(json => json.results[0].version);

            return version !== '0.0'; // TDOD: add compare to the current app version
        }

        return true;
    }
}
