import '@testing-library/jest-native/extend-expect';
import '@testing-library/react-native/cleanup-after-each';
import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);
jest.mock('rn-fetch-blob', () => {
    return {
        DocumentDir: () => {},
        polyfill: () => {},
    };
});
jest.mock('@haskkor/react-native-pincode', () => {
    return {
        hasUserSetPinCode: false,
    };
});
jest.mock('react-native-qrcode-scanner', () => {});
