import React from 'react';
import AddressDisplay from '../../src/components/controls/AddressDisplay';
import { account1, account2 } from '../../__mocks__/account';
import { mockStore } from '__mocks__/store';
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
            plain,
            trunc,
        };
        const store = mockStore({
            addressBook: {
                addressBook,
            },
            account: {
                selectedAccountAddress: account1.address.plain(),
            },
        });
        const labelText = '!';

        // Act:
        const screen = renderConnected(<AddressDisplay {...props}>{address}</AddressDisplay>, store);
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

        test('renders plain address when trunc is false', () => {
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

        test('renders truncated address when trunc is true', () => {
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

        test('renders full contact name when trunc is false', () => {
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

        test('renders truncated contact name when trunc is true', () => {
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

        test('renders contact address when plain is true', () => {
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

        test('renders full contact name when trunc is false', () => {
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

        test('renders truncated contact name when trunc is true', () => {
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

        test('renders contact address when plain is true', () => {
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

        test('renders "blocked" label when contact does not contain name', () => {
            // Arrange:
            const plain = false;
            const trunc = false;
            const contactWithoutName = {
                ...contact,
                name: '',
            };

            // Act + Assert:
            const expectations = {
                mainText: 't_addressBook.addressBlocked',
                showLabel: true,
            };
            runAddressDisplayTest(address, contactWithoutName, plain, trunc, expectations);
        });
    });

    describe('address belongs to the current account', () => {
        // Arrange:
        const address = account1.address.plain();
        const contact = null;

        test('renders caption with plain address when trunc is false', () => {
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

        test('renders caption with truncated address when trunc is true', () => {
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

        test('renders plain address without caption when plain is true', () => {
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
