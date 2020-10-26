/**
 * @format
 * @flow
 */

import React from 'react';
import { View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

import TitleBar from '../index';

test('renders a title text', () => {
  const title = 'Title';
  const { getByTestId, queryByTestId } = render(<TitleBar title={title} />);

  expect(queryByTestId('back-button')).toBeFalsy();
  expect(getByTestId('title-text').props.children).toBe(title);
});

test('renders a child instead of title', () => {
  const title = 'Title';
  const child = <View testID="title-child" />;
  const { queryByTestId } = render(<TitleBar title={title}>{child}</TitleBar>);

  expect(queryByTestId('title-text')).toBeFalsy();
  expect(queryByTestId('title-child')).toBeTruthy();
});

test('renders a back button when showBack is set', () => {
  const { queryByTestId } = render(<TitleBar showBack />);

  expect(queryByTestId('back-button')).toBeTruthy();
});

test('invokes given on-back event on pressing back', () => {
  const onBackPressed = jest.fn();
  const { getByTestId } = render(<TitleBar showBack onBack={onBackPressed} />);

  fireEvent.press(getByTestId('back-button'));

  expect(onBackPressed).toBeCalled();
});

test('renders a close button when showClose is set', () => {
  const { queryByTestId } = render(<TitleBar showClose />);

  expect(queryByTestId('close-button')).toBeTruthy();
});

test('invokes given on-close event on pressing close', () => {
  const onClosed = jest.fn();
  const { getByTestId } = render(<TitleBar showClose onClose={onClosed} />);

  fireEvent.press(getByTestId('close-button'));

  expect(onClosed).toBeCalled();
});

test('renders correctly', () => {
  const onBackPressed = jest.fn();
  const onClosed = jest.fn();
  const { baseElement } = render(
    <TitleBar title="MOCK-TITLE" showBack onBack={onBackPressed} showClose onClose={onClosed} />
  );

  expect(baseElement).toMatchSnapshot();
});
