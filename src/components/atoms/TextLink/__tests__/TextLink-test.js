/**
 * @format
 * @flow
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import TextLink, { testIDs } from '../index';

test('renders text as link button', () => {
    const text = 'LINK';
    const onLinkPressed = jest.fn();
    const { getByTestId } = render(<TextLink href={onLinkPressed}>{text}</TextLink>);

    expect(getByTestId(testIDs.text).props.children).toBe(text);
});

test('fires on-press event on tap', () => {
    const text = 'LINK';
    const onLinkPressed = jest.fn();
    const { getByTestId } = render(<TextLink href={onLinkPressed}>{text}</TextLink>);

    fireEvent.press(getByTestId(testIDs.button));

    expect(onLinkPressed).toBeCalled();
});

test('will not fire on-press event if disabled', () => {
    const text = 'DISABLED_LINK';
    const onLinkPressed = jest.fn();
    const { getByTestId } = render(
        <TextLink disabled href={onLinkPressed}>
            {text}
        </TextLink>
    );

    fireEvent.press(getByTestId(testIDs.button));

    expect(onLinkPressed).not.toBeCalled();
});

test('renders correctly', () => {
    const text = 'LINK';
    const onLinkPressed = jest.fn();
    const { baseElement } = render(<TextLink href={onLinkPressed}>{text}</TextLink>);

    expect(baseElement).toMatchSnapshot();
});

test('renders correctly with disabled prop', () => {
    const text = 'DISABLED_LINK';
    const onLinkPressed = jest.fn();
    const { baseElement } = render(
        <TextLink disabled href={onLinkPressed}>
            {text}
        </TextLink>
    );

    expect(baseElement).toMatchSnapshot();
});
