/**
 * @format
 * @flow
 *
 * Require the following global mocks to be in place
 * - /src/__mocks__/react-native-camera.js
 * - /src/__mocks__/react-native-permissions.js
 */

import React from 'react';
import { render, wait } from '@testing-library/react-native';
import QRScannerHOC from '../index';
import DummyQRHostComponent from '../testHelper/DummyHostComponent';

const mockPlatform = (OS: string) => {
    jest.resetModules();
    jest.doMock('react-native/Libraries/Utilities/Platform', () => ({
        OS: OS,
        select: objs => objs[OS],
    }));
};

const mockQRScannerProps = {
    QRHandler: () => {},
};

test('should not render camera by default', async () => {
    mockPlatform('ios');

    const WrappedComponent = QRScannerHOC(DummyQRHostComponent);
    const { queryByTestId } = render(<WrappedComponent {...mockQRScannerProps} />);

    await wait(() => {
        expect(queryByTestId('mocked-camera')).toBeFalsy();
    });
});

test('render camera correctly on iOS', async () => {
    mockPlatform('ios');

    const WrappedComponent = QRScannerHOC(DummyQRHostComponent);
    const { baseElement, queryByTestId } = render(<WrappedComponent {...mockQRScannerProps} enableScannerOnStart />);

    await wait(() => {
        expect(queryByTestId('mocked-camera')).toBeTruthy();
        expect(baseElement).toMatchSnapshot();
    });
});

test('render camera correctly on android', async () => {
    jest.doMock('react-native/Libraries/PermissionsAndroid/PermissionsAndroid', () => ({
        PERMISSIONS: {
            CAMERA: 'mock_camera',
        },
        RESULTS: { GRANTED: 'granted' },
        request: () => Promise.resolve('granted'),
    }));
    mockPlatform('android');

    const WrappedComponent = QRScannerHOC(DummyQRHostComponent);
    const { baseElement, queryByTestId } = render(<WrappedComponent {...mockQRScannerProps} enableScannerOnStart />);
    await wait(() => {
        expect(queryByTestId('mocked-camera')).toBeTruthy();
        expect(baseElement).toMatchSnapshot();
    });
});
