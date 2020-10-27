import AsyncStorage from '@react-native-community/async-storage';
import {
    getDefaultCurrency,
    getDefaultLanguage,
    getDefaultNetworkType,
    getDefaultSyncInterval,
} from '@src/config/environment';

export class AsyncCache {
    static SELECTED_NETWORK_KEY = 'selectedNetwork';
    static SELECTED_CURRENCY_KEY = 'selectedCurrency';
    static SELECTED_LANGUAGE_KEY = 'selectedLanguage';
    static SELECTED_NOTIFICATION_KEY = 'selectedNotification';

    static setSelectedNetwork = async networkType => {
        return this.set(this.SELECTED_NETWORK_KEY, networkType);
    };

    static getSelectedNetwork = async () => {
        try {
            return this.get(this.SELECTED_NETWORK_KEY);
        } catch (e) {
            return getDefaultNetworkType();
        }
    };

    static getSelectedCurrency = async () => {
        try {
            return this.get(this.SELECTED_CURRENCY_KEY);
        } catch (e) {
            return getDefaultCurrency();
        }
    };

    static getSelectedLanguage = async () => {
        try {
            return this.get(this.SELECTED_LANGUAGE_KEY);
        } catch (e) {
            return getDefaultLanguage();
        }
    };

    static getSelectedNotification = async () => {
        try {
            return this.get(this.SELECTED_NOTIFICATION_KEY);
        } catch (e) {
            return getDefaultSyncInterval();
        }
    };

    static set = async (key: String, value: string) => {
        return AsyncStorage.setItem(key, value);
    };

    static multiSet = async (keyValuePairs: string[][]) => {
        return AsyncStorage.multiSet(keyValuePairs);
    };

    static get = async (key: string) => {
        return AsyncStorage.getItem(key);
    };

    static getAllKeys = async () => {
        return AsyncStorage.getAllKeys();
    };

    static remove = async (key: string) => {
        return AsyncStorage.removeItem(key);
    };
}
