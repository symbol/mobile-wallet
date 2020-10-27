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
    static SELECTED_PASSCODE_KEY = 'isPasscodeSelected';
    static SELECTED_NODE_KEY = 'selectedNode';

    static getSelectedNetwork = async () => {
        const selected = await this.get(this.SELECTED_NETWORK_KEY);
        if (!selected) return getDefaultNetworkType();
        else return selected;
    };

    static setSelectedNetwork = async network => {
        return this.set(this.SELECTED_NETWORK_KEY, network);
    };

    static getSelectedCurrency = async () => {
        const selected = await this.get(this.SELECTED_CURRENCY_KEY);
        if (!selected) return getDefaultCurrency();
        else return selected;
    };

    static setSelectedCurrency = async selectedCurrency => {
        return this.set(this.SELECTED_CURRENCY_KEY, selectedCurrency);
    };

    static getSelectedLanguage = async () => {
        const selected = await this.get(this.SELECTED_LANGUAGE_KEY);
        if (!selected) return getDefaultLanguage();
        else return selected;
    };

    static setSelectedLanguage = async payload => {
        return this.set(this.SELECTED_LANGUAGE_KEY, payload);
    };

    static getSelectedNotification = async () => {
        const selected = await this.get(this.SELECTED_NOTIFICATION_KEY);
        if (!selected) return getDefaultSyncInterval();
        else return selected;
    };

    static setSelectedSyncInterval = async payload => {
        return this.set(this.SELECTED_NOTIFICATION_KEY, payload);
    };

    static getIsPasscodeSelected = async () => {
        const selected = !!(await this.get(this.SELECTED_PASSCODE_KEY));
        if (!selected) return false;
        else return selected;
    };

    static setIsPasscodeSelected = async payload => {
        return this.set(this.SELECTED_PASSCODE_KEY, payload.toString());
    };

    static getSelectedNode = async () => {
        const selected = await this.get(this.SELECTED_NODE_KEY);
        if (!selected) return null;
        else return selected;
    };

    static setSelectedNode = async payload => {
        return this.set(this.SELECTED_NODE_KEY, payload.toString());
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
