import AsyncStorage from '@react-native-community/async-storage';
import {NetworkType} from "symbol-sdk";
import {getDefaultNetworkType} from "../../config/environment";

export class AsyncCache {
    static SELECTED_NETWORK_KEY = 'selectedNetwork';

    static setSelectedNetwork = async (networkType) => {
        return this.set(this.SELECTED_NETWORK_KEY, networkType);
    };
    static getSelectedNetwork = async () => {
      try {
        return this.get(this.SELECTED_NETWORK_KEY);
      } catch (e) {
        return getDefaultNetworkType();
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
