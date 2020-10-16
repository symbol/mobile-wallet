import AsyncStorage from '@react-native-community/async-storage';

export class AsyncCache {
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
