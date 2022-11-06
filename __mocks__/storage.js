import { BaseSecureStorage } from '@src/storage/persistence/BaseSecureStorage';

export const mockSecureStorage = state => {
    BaseSecureStorage.state = state;
    BaseSecureStorage.secureSaveAsync = (key, value) => {
        BaseSecureStorage.state[key] = value;

        return Promise.resolve();
    };
    BaseSecureStorage.secureRetrieveAsync = key => {
        if (BaseSecureStorage.state.hasOwnProperty(key)) {
            return Promise.resolve(BaseSecureStorage.state[key]);
        }

        return Promise.reject();
    };

    return BaseSecureStorage;
};
