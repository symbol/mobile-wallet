import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import _ from 'lodash';
import AddContact from '@src/screens/AddContact';
import { Router } from '@src/Router';
import { network } from '../../__mocks__/network';
import { account1, account2, account3 } from '../../__mocks__/account';
import { getStore } from '../../__mocks__/store';
import { AddressBook } from 'symbol-address-book';

jest.mock('@src/locales/i18n', () => t => `t_${t}`);
jest.mock('@src/components/controls/InputAddress', () => jest.requireActual('@src/components/controls/Input'));

const mockGoBack = jest.fn();
const currentAddress = account1.address.plain();
const contacts = [
    {
        name: 'Contact Name',
        address: account2.address.plain(),
    },
];
let addressBook = new AddressBook(contacts);

beforeEach(() => {
    Router.goBack = mockGoBack;
    mockGoBack.mockClear();
    addressBook = new AddressBook(contacts);
});

describe('screens/AddContact', () => {
    describe('address warnings', () => {
        const runAddressWarningTest = (addressToBeInputted, expectedWarningText) => {
            // Arrange:
            const state = {
                account: {
                    selectedAccountAddress: currentAddress,
                },
                addressBook: {
                    addressBook,
                },
                network: {
                    selectedNetwork: network,
                },
            };

            // Act:
            const screen = renderConnected(<AddContact />, getStore(state));
            const addressInputElement = screen.getByTestId('input-address');
            fireEvent.changeText(addressInputElement, addressToBeInputted);

            // Assert:
            expect(screen.queryByText(expectedWarningText)).not.toBeNull();
        };

        test('renders warning when address is invalid', () => {
            // Arrange:
            const addressToBeInputted = 'a1!';

            // Act + Assert:
            const expectedWarningText = 't_addressBook.addressWarning';
            runAddressWarningTest(addressToBeInputted, expectedWarningText);
        });

        test('renders warning when address is already in the address book', () => {
            // Arrange:
            const addressToBeInputted = account2.address.plain();

            // Act + Assert:
            const expectedWarningText = 't_addressBook.addressTakenWarning';
            runAddressWarningTest(addressToBeInputted, expectedWarningText);
        });

        test('renders warning when address belongs to current account', () => {
            // Arrange:
            const addressToBeInputted = account1.address.plain();

            // Act + Assert:
            const expectedWarningText = 't_addressBook.addressCurrentWarning';
            runAddressWarningTest(addressToBeInputted, expectedWarningText);
        });
    });

    describe('add contact action', () => {
        // Arrange:
        const selectedContact = null;

        test('renders screen without preselected fields', () => {
            // Arrange:
            const state = {
                account: {
                    selectedAccountAddress: currentAddress,
                },
                addressBook: {
                    addressBook,
                    selectedContact,
                },
                network: {
                    selectedNetwork: network,
                },
            };

            // Act:
            const screen = renderConnected(<AddContact />, getStore(state));

            // Assert:
            const expectations = {
                listType: 't_addressBook.whitelist',
                nameWarningToBeShown: 't_addressBook.nameWarning',
                addressWarningToBeShown: 't_addressBook.addressRequiredWarning',
                buttonText: 't_CreateNewAccount.submitButton',
            };
            expect(screen.queryByTestId('dropdown-selected-label').children.join('')).toBe(expectations.listType);
            expect(screen.queryByText(expectations.nameWarningToBeShown)).not.toBeNull();
            expect(screen.queryByText(expectations.addressWarningToBeShown)).not.toBeNull();
            expect(screen.queryByText(expectations.buttonText)).not.toBeNull();
            expect(screen.queryByText(expectations.buttonText)).toBeDisabled();
        });

        test('renders screen with preselected fields', () => {
            // Arrange:
            const props = {
                name: 'New Contact',
                address: account3.address.plain(),
                isBlackListed: false,
            };
            const state = {
                account: {
                    selectedAccountAddress: currentAddress,
                },
                addressBook: {
                    addressBook,
                    selectedContact,
                },
                network: {
                    selectedNetwork: network,
                },
            };

            // Act:
            const screen = renderConnected(<AddContact {...props} />, getStore(state));

            // Assert:
            const expectations = {
                listType: 't_addressBook.whitelist',
                name: 'New Contact',
                address: account3.address.plain(),
                nameWarningToBeHidden: 't_addressBook.nameWarning',
                addressWarningToBeHidden: 't_addressBook.addressRequiredWarning',
                buttonText: 't_CreateNewAccount.submitButton',
            };
            expect(screen.getByTestId('dropdown-selected-label').children.join('')).toBe(expectations.listType);
            expect(screen.getByTestId('input-name').props.value).toBe(expectations.name);
            expect(screen.getByTestId('input-address').props.value).toBe(expectations.address);
            expect(screen.queryByText(expectations.nameWarningToBeHidden)).toBeNull();
            expect(screen.queryByText(expectations.addressWarningToBeHidden)).toBeNull();
            expect(screen.queryByText(expectations.buttonText)).not.toBeNull();
            expect(screen.queryByText(expectations.buttonText)).not.toBeDisabled();
        });

        test('adds contact when press on button', () => {
            // Arrange:
            const state = {
                account: {
                    selectedAccountAddress: currentAddress,
                },
                addressBook: {
                    addressBook,
                    selectedContact,
                },
                network: {
                    selectedNetwork: network,
                },
            };
            const store = getStore(state);
            const nameToBeInputted = 'New contact';
            const addressToBeInputted = account3.address.plain();
            const notesToBeInputted = 'Lorem ipsum dolor sit amet';

            // Act:
            const screen = renderConnected(<AddContact />, store);
            const nameInputElement = screen.getByTestId('input-name');
            const addressInputElement = screen.getByTestId('input-address');
            const notesInputElement = screen.getByTestId('input-notes');
            const buttonElement = screen.queryByText('t_CreateNewAccount.submitButton');
            fireEvent.changeText(nameInputElement, nameToBeInputted);
            fireEvent.changeText(addressInputElement, addressToBeInputted);
            fireEvent.changeText(notesInputElement, notesToBeInputted);
            fireEvent.press(buttonElement);
            const addedContact = store.getState().addressBook.addressBook.getContactByAddress(addressToBeInputted);

            // Assert:
            const expectedContactToBeAdded = {
                name: nameToBeInputted,
                address: addressToBeInputted,
                notes: notesToBeInputted,
                isBlackListed: false,
            };
            expect(_.omit(addedContact, 'id')).toEqual(expectedContactToBeAdded);
            expect(mockGoBack).toBeCalledTimes(1);
        });
    });

    describe('update contact action', () => {
        // Arrange:
        const selectedContact = {
            id: 0,
            name: 'Contact Name',
            address: account3.address.plain(),
            notes: '',
            isBlackListed: false,
        };

        test('update contact when press on button', async () => {
            // Arrange:
            const state = {
                account: {
                    selectedAccountAddress: currentAddress,
                },
                addressBook: {
                    addressBook,
                    selectedContact,
                },
                network: {
                    selectedNetwork: network,
                },
            };
            const store = getStore(state);
            const nameToBeInputted = 'New contact 3';
            const addressToBeInputted = account3.address.plain();
            const notesToBeInputted = 'Lorem ipsum dolor sit amet';

            // Act:
            const screen = renderConnected(<AddContact />, store);
            const nameInputElement = screen.getByTestId('input-name');
            const addressInputElement = screen.getByTestId('input-address');
            const notesInputElement = screen.getByTestId('input-notes');
            const buttonElement = screen.queryAllByText('t_addressBook.updateContact')[1];
            fireEvent.changeText(nameInputElement, nameToBeInputted);
            fireEvent.changeText(addressInputElement, addressToBeInputted);
            fireEvent.changeText(notesInputElement, notesToBeInputted);
            fireEvent.press(buttonElement);
            await new Promise(setImmediate);
            const addedContact = store.getState().addressBook.addressBook.getContactByAddress(addressToBeInputted);
            const finalSelectedContact = store.getState().addressBook.selectedContact;

            // Assert:
            const expectedContactToBeAdded = {
                name: nameToBeInputted,
                address: addressToBeInputted,
                notes: notesToBeInputted,
                isBlackListed: false,
            };
            expect(_.omit(addedContact, 'id')).toEqual(expectedContactToBeAdded);
            expect(_.omit(finalSelectedContact, 'id')).toStrictEqual(expectedContactToBeAdded);
            expect(mockGoBack).toHaveBeenCalledTimes(1);
        });
    });

    describe('list selector', () => {
        // Arrange:
        const name = 'Contact Name';
        const address = account3.address.plain();

        const runListSelectorTest = async (isBlackListed, listToSelect, expectations) => {
            // Arrange:
            const props = {
                name,
                address,
            };
            const state = {
                account: {
                    selectedAccountAddress: currentAddress,
                },
                addressBook: {
                    addressBook,
                },
                network: {
                    selectedNetwork: network,
                },
            };
            const store = getStore(state);

            // Act:
            const screen = renderConnected(<AddContact isBlackListed={isBlackListed} {...props} />, store);
            const dropdownElement = screen.getByTestId('dropdown-selected-label');
            fireEvent.press(dropdownElement);
            const listItemElement = screen.getByText(listToSelect);
            fireEvent.press(listItemElement);
            const buttonElement = screen.queryByText('t_CreateNewAccount.submitButton');
            fireEvent.press(buttonElement);
            await new Promise(setImmediate);
            const addedContact = store.getState().addressBook.addressBook.getContactByAddress(address);

            // Assert:
            if (expectations.isNameFieldShown) {
                expect(screen.queryByTestId('input-name')).not.toBeNull();
            } else {
                expect(screen.queryByTestId('input-name')).toBeNull();
            }
            expect(_.omit(addedContact, 'id')).toEqual(expectations.contactToBeAdded);
        };

        test('hide name field when select blacklist', async () => {
            // Arrange:
            const isBlackListed = false;
            const listToSelect = 't_addressBook.blacklist';

            // Act + Assert:
            const expectations = {
                isNameFieldShown: false,
                contactToBeAdded: {
                    name: '',
                    address,
                    notes: '',
                    isBlackListed: true,
                },
            };
            await runListSelectorTest(isBlackListed, listToSelect, expectations);
        });

        test('show name field when select whitelist', async () => {
            // Arrange:
            const isBlackListed = true;
            const listToSelect = 't_addressBook.whitelist';

            // Act + Assert:
            const expectations = {
                isNameFieldShown: true,
                contactToBeAdded: {
                    name,
                    address,
                    notes: '',
                    isBlackListed: false,
                },
            };
            await runListSelectorTest(isBlackListed, listToSelect, expectations);
        });
    });
});
