import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react-native';
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
jest.mock('react-native-svg', () => jest.requireActual('./__MOCKS__/react-native-svg'));

global.renderConnected = (component, store) => render(<Provider store={store}>{component}</Provider>);
