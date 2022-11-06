import React from 'react';
import { render } from '@testing-library/react-native';
import ContactItem from '@src/components/organisms/ContactItem';
import { account1 } from '../../__mocks__/account';

describe('components/ContactItem', () => {
    const runContactItemTest = (contact, expectations) => {
        // Act:
        const screen = render(<ContactItem data={contact} />);
        const iconElement = screen.container.children[0].children[0];
        const nameElement = screen.queryByTestId('contact-name');

        // Assert:
        expect(iconElement.props.source.testUri).toBe(expectations.iconSrc);

        if (expectations.nameToBeShown) {
            expect(nameElement.children.join('')).toBe(contact.name);
        } else {
            expect(nameElement).toBeNull();
        }
    };

    test('renders whitelisted contact', () => {
        // Arrange:
        const contact = {
            name: 'Contact Name',
            address: account1.address.plain(),
        };

        // Act + Assert:
        const expectations = {
            iconSrc: '../../../src/assets/icons/contact_light.png',
            nameToBeShown: true,
        };
        runContactItemTest(contact, expectations);
    });

    test('renders blacklisted contact', () => {
        // Arrange:
        const contact = {
            name: '',
            address: account1.address.plain(),
            isBlackListed: true,
        };

        // Act + Assert:
        const expectations = {
            iconSrc: '../../../src/assets/icons/contact_blocked_light.png',
            nameToBeShown: false,
        };
        runContactItemTest(contact, expectations);
    });
});
