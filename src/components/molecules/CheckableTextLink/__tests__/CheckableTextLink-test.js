/**
 * @format
 * @flow
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import {
    NonEmptyItems,
    WithMockError,
} from '../../../../../../shared/utils/TestUtils';
import CheckableTextLink, { testIDs } from '../index';

// This is a redundant test since flow will warn you about this.
// But just incase you are not using flow.
test('fails if there are no children', () => {
    WithMockError(() => {
        const onChecked = jest.fn();

        expect(() => {
            // $FlowFixMe - Forcing null child for this component.
            render(
                <CheckableTextLink
                    isChecked
                    onChecked={onChecked}
                    linksMap={{}}
                />
            );
        }).toThrow();
    });
});

test('render all children correctly', () => {
    const validChildContent = 'hello {terms} {and} {privacy}';
    const validLinks = {
        terms: {
            text: 'Terms',
            active: true,
            href: () => {},
        },
        and: {
            text: 'And',
            active: true,
            href: () => {},
        },
        privacy: {
            text: 'Privacy',
            active: false,
            href: () => {},
        },
    };
    const onChecked = jest.fn();
    const { getByTestId } = render(
        <CheckableTextLink
            isChecked
            onChecked={onChecked}
            linksMap={validLinks}
        >
            {validChildContent}
        </CheckableTextLink>
    );
    const nonSpaceChildren = getByTestId(
        testIDs.textContainer
    ).props.children.filter(NonEmptyItems);
    const expectedChildCount = validChildContent.split(' ').length;

    expect(nonSpaceChildren.length).toBe(expectedChildCount);
});

test('renders correct number of normal texts', () => {
    const validChildContent = 'hello terms and {privacy}';
    const validLinks = {
        privacy: {
            text: 'Privacy',
            active: false,
            href: () => {},
        },
    };
    const onChecked = jest.fn();
    const { getAllByTestId } = render(
        <CheckableTextLink
            isChecked
            onChecked={onChecked}
            linksMap={validLinks}
        >
            {validChildContent}
        </CheckableTextLink>
    );

    // Don't panic, `hello terms and` will be treated as a single text.
    expect(getAllByTestId(testIDs.textNormal).length).toBe(1);
});

test('render correct number of link texts', () => {
    const validChildContent = 'hello {terms} {and} {privacy}';
    const validLinks = {
        terms: {
            text: 'Terms',
            active: true,
            href: () => {},
        },
        and: {
            text: 'And',
            active: true,
            href: () => {},
        },
        privacy: {
            text: 'Privacy',
            active: false,
            href: () => {},
        },
    };
    const onChecked = jest.fn();
    const { getByTestId, getAllByTestId } = render(
        <CheckableTextLink
            isChecked
            onChecked={onChecked}
            linksMap={validLinks}
        >
            {validChildContent}
        </CheckableTextLink>
    );
    const nonSpaceChildren = getByTestId(
        testIDs.textContainer
    ).props.children.filter(NonEmptyItems);
    const normalTextItems = getAllByTestId(testIDs.textNormal);

    expect(nonSpaceChildren.length - normalTextItems.length).toBe(3);
});

test('renders active links correctly', () => {
    const validChildContent = 'hello {terms} {and} {privacy}';
    const validLinks = {
        terms: {
            text: 'Terms',
            active: true,
            href: () => {},
        },
        and: {
            text: 'And',
            active: false,
            href: () => {},
        },
        privacy: {
            text: 'Privacy',
            active: false,
            href: () => {},
        },
    };
    const onChecked = jest.fn();
    const { getByTestId } = render(
        <CheckableTextLink
            isChecked
            onChecked={onChecked}
            linksMap={validLinks}
        >
            {validChildContent}
        </CheckableTextLink>
    );
    const nonSpaceChildren = getByTestId(
        testIDs.textContainer
    ).props.children.filter(NonEmptyItems);
    const activeLinks = nonSpaceChildren.filter(
        lb => lb.props.disabled === false
    );

    expect(activeLinks.length).toBe(1);
});

test('renders correctly', () => {
    const validChildContent = 'hello {terms} and {privacy}';
    const validLinks = {
        terms: {
            text: 'Terms',
            active: true,
            href: () => {},
        },
        privacy: {
            text: 'Privacy',
            active: false,
            href: () => {},
        },
    };
    const onChecked = jest.fn();
    const { baseElement } = render(
        <CheckableTextLink
            isChecked
            onChecked={onChecked}
            linksMap={validLinks}
        >
            {validChildContent}
        </CheckableTextLink>
    );

    expect(baseElement).toMatchSnapshot();
});
