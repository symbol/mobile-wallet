/**
 * @format
 * @flow
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import Warning from '../index';

const mockAlert = jest.fn();
jest.doMock('react-native/Libraries/Alert/Alert', () => ({
    alert: mockAlert,
}));

test('renders enter warning component correctly', () => {
    const mockHandler = jest.fn();

    const { baseElement } = render(
        <Warning
            message="foo"
            okButtonText="ignore"
            hideWarning={mockHandler}
            onIgnore={mockHandler}
        />
    );

    expect(baseElement).toMatchSnapshot();
});

test('render proper alert', () => {
    const mockHandler = jest.fn();

    render(
        <Warning
            message="foo"
            okButtonText="ignore"
            hideWarning={mockHandler}
            onIgnore={mockHandler}
        />
    );

    // TODO: Ideally, the below eventArgs should be where expect.anything() is now.
    // let eventArgs = [
    //   { onPress: () => mockHandler(), text: 'ignore' },
    //   {
    //     onPress: () => mockHandler(),
    //     style: 'cancel',
    //     text: translate('ImportWallet.EnterMnemonics.cancelModalButton'),
    //   },
    // ];

    expect(mockAlert).toBeCalledWith('Warning', 'foo', expect.anything(), {
        cancelable: true,
    });
});
