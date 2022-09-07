import React from 'react';
import { render } from '@testing-library/react-native';
import { AddressDisplay } from '../../src/components/controls/AddressDisplay';
import { account1, account2 } from '../../__mocks__/account';
import { AddressBook } from 'symbol-address-book';

jest.mock('@src/locales/i18n', () => t => `t_${t}`);

describe('components/AddressDisplay', () => {
    const runAddressDisplayTest = (address, contact, plain, trunc, expectations) => {
        // Arrange:
        const addressBook = new AddressBook();
        if (contact) {
            addressBook.addContact(contact);
        }
        const props = {
            addressBook,
            currentAddress: account1.address.plain(),
            plain,
            trunc,
        };
        const labelText = 't_addressBook.addressBlocked';

        // Act:
        const screen = render(<AddressDisplay {...props}>{address}</AddressDisplay>);
        const textContent = screen.getByTestId('text-display').children.join('');

        // Assert:
        expect(textContent).toBe(expectations.mainText);

        if (expectations.showLabel) {
            expect(screen.queryByText(labelText)).not.toBeNull();
        } else {
            expect(screen.queryByText(labelText)).toBeNull();
        }
    };

    describe('unknown address', () => {
        // Arrange:
        const address = account2.address.plain();
        const contact = null;

        test('render plain address when trunc is false', () => {
            // Arrange:
            const plain = false;
            const trunc = false;

            // Act + Assert:
            const expectations = {
                mainText: 'TCHBDENCLKEBILBPWP3JPB2XNY64OE7PYHHE32I',
                showLabel: false,
            };
            runAddressDisplayTest(address, contact, plain, trunc, expectations);
        });

        test('render truncated address when trunc is true', () => {
            // Arrange:
            const plain = false;
            const trunc = true;

            // Act + Assert:
            const expectations = {
                mainText: 'TCHBDE...32I',
                showLabel: false,
            };
            runAddressDisplayTest(address, contact, plain, trunc, expectations);
        });
    });

    describe('address is a whitelisted contact', () => {
        // Arrange:
        const address = account2.address.plain();
        const contact = {
            id: 0,
            address,
            name: 'Lorem ipsum dolor sit amet',
            isBlackListed: false,
        };

        test('render full contact name when trunc is false', () => {
            // Arrange:
            const plain = false;
            const trunc = false;

            // Act + Assert:
            const expectations = {
                mainText: 'Lorem ipsum dolor sit amet',
                showLabel: false,
            };
            runAddressDisplayTest(address, contact, plain, trunc, expectations);
        });

        test('render truncated contact name when trunc is true', () => {
            // Arrange:
            const plain = false;
            const trunc = true;

            // Act + Assert:
            const expectations = {
                mainText: 'Lorem ipsum dolor ...',
                showLabel: false,
            };
            runAddressDisplayTest(address, contact, plain, trunc, expectations);
        });

        test('render contact address when plain is true', () => {
            // Arrange:
            const plain = true;
            const trunc = false;

            // Act + Assert:
            const expectations = {
                mainText: 'TCHBDENCLKEBILBPWP3JPB2XNY64OE7PYHHE32I',
                showLabel: false,
            };
            runAddressDisplayTest(address, contact, plain, trunc, expectations);
        });
    });

    describe('address is a blacklisted contact', () => {
        // Arrange:
        const address = account2.address.plain();
        const contact = {
            id: 0,
            address,
            name: 'Lorem ipsum dolor sit amet',
            isBlackListed: true,
        };

        test('render full contact name when trunc is false', () => {
            // Arrange:
            const plain = false;
            const trunc = false;

            // Act + Assert:
            const expectations = {
                mainText: 'Lorem ipsum dolor sit amet',
                showLabel: true,
            };
            runAddressDisplayTest(address, contact, plain, trunc, expectations);
        });

        test('render truncated contact name when trunc is true', () => {
            // Arrange:
            const plain = false;
            const trunc = true;

            // Act + Assert:
            const expectations = {
                mainText: 'Lorem ipsum dolor ...',
                showLabel: true,
            };
            runAddressDisplayTest(address, contact, plain, trunc, expectations);
        });

        test('render contact address when plain is true', () => {
            // Arrange:
            const plain = true;
            const trunc = false;

            // Act + Assert:
            const expectations = {
                mainText: 'TCHBDENCLKEBILBPWP3JPB2XNY64OE7PYHHE32I',
                showLabel: true,
            };
            runAddressDisplayTest(address, contact, plain, trunc, expectations);
        });
    });

    describe('address belongs to the current account', () => {
        // Arrange:
        const address = account1.address.plain();
        const contact = null;

        test('render caption with plain address when trunc is false', () => {
            // Arrange:
            const plain = false;
            const trunc = false;

            // Act + Assert:
            const expectations = {
                mainText: 't_unsortedKeys.currentAddress (TCWYXKVYBMO4NBCUF3AXKJMXCGVSYQOS7ZG2TLI)',
                showLabel: false,
            };
            runAddressDisplayTest(address, contact, plain, trunc, expectations);
        });

        test('render caption with truncated address when trunc is true', () => {
            // Arrange:
            const plain = false;
            const trunc = true;

            // Act + Assert:
            const expectations = {
                mainText: 't_unsortedKeys.currentAddress (...TLI)',
                showLabel: false,
            };
            runAddressDisplayTest(address, contact, plain, trunc, expectations);
        });

        test('render plain address without caption when plain is true', () => {
            // Arrange:
            const plain = true;
            const trunc = false;

            // Act + Assert:
            const expectations = {
                mainText: 'TCWYXKVYBMO4NBCUF3AXKJMXCGVSYQOS7ZG2TLI',
                showLabel: false,
            };
            runAddressDisplayTest(address, contact, plain, trunc, expectations);
        });
    });
});
