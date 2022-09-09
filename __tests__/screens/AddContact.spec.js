import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { AddContact } from '@src/screens/AddContact';
import { Router } from '@src/Router';
import store from '@src/store';
import { network } from '../../__mocks__/network';
import { account1, account2, account3 } from '../../__mocks__/account';
import { AddressBook } from 'symbol-address-book';

jest.mock('@src/locales/i18n', () => t => `t_${t}`);
jest.mock('@src/components/controls/InputAddress', () => jest.requireActual('@src/components/controls/Input'));

const mockDispatchAction = jest.fn().mockResolvedValue(null);
const mockGoBack = jest.fn();

beforeEach(() => {
    store.dispatchAction = mockDispatchAction;
    Router.goBack = mockGoBack;
    mockDispatchAction.mockClear();
    mockGoBack.mockClear();
});

describe('screens/AddContact', () => {
    // Arrange:
    const currentAddress = account1.address.plain();
    const contacts = [
        {
            name: 'Contact Name',
            address: account2.address.plain(),
        },
    ];
    const addressBook = new AddressBook(contacts);

    describe('address warnings', () => {
        const runAddressWarningTest = (addressToBeInputted, expectedWarningText) => {
            // Arrange:
            const props = {
                currentAddress,
                network,
                addressBook,
            };

            // Act:
            const screen = render(<AddContact {...props} />);
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
            const props = {
                currentAddress,
                network,
                addressBook,
                selectedContact,
            };

            // Act:
            const screen = render(<AddContact {...props} />);

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
                currentAddress,
                network,
                addressBook,
                selectedContact,
                name: 'New Contact',
                address: account3.address.plain(),
                isBlackListed: false,
            };

            // Act:
            const screen = render(<AddContact {...props} />);

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
            const props = {
                currentAddress,
                network,
                addressBook,
                selectedContact,
            };
            const nameToBeInputted = 'New contact';
            const addressToBeInputted = account3.address.plain();
            const notesToBeInputted = 'Lorem ipsum dolor sit amet';

            // Act:
            const screen = render(<AddContact {...props} />);
            const nameInputElement = screen.getByTestId('input-name');
            const addressInputElement = screen.getByTestId('input-address');
            const notesInputElement = screen.getByTestId('input-notes');
            const buttonElement = screen.queryByText('t_CreateNewAccount.submitButton');
            fireEvent.changeText(nameInputElement, nameToBeInputted);
            fireEvent.changeText(addressInputElement, addressToBeInputted);
            fireEvent.changeText(notesInputElement, notesToBeInputted);
            fireEvent.press(buttonElement);

            // Assert:
            const expectedContactToBeAdded = {
                name: nameToBeInputted,
                address: addressToBeInputted,
                notes: notesToBeInputted,
                isBlackListed: false,
            };
            expect(mockDispatchAction).toBeCalledWith({
                type: 'addressBook/addContact',
                payload: expectedContactToBeAdded,
            });
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
            const props = {
                currentAddress,
                network,
                addressBook,
                selectedContact,
            };
            const nameToBeInputted = 'New contact';
            const addressToBeInputted = account3.address.plain();
            const notesToBeInputted = 'Lorem ipsum dolor sit amet';

            // Act:
            const screen = render(<AddContact {...props} />);
            const nameInputElement = screen.getByTestId('input-name');
            const addressInputElement = screen.getByTestId('input-address');
            const notesInputElement = screen.getByTestId('input-notes');
            const buttonElement = screen.queryAllByText('t_addressBook.updateContact')[1];
            fireEvent.changeText(nameInputElement, nameToBeInputted);
            fireEvent.changeText(addressInputElement, addressToBeInputted);
            fireEvent.changeText(notesInputElement, notesToBeInputted);
            fireEvent.press(buttonElement);
            await new Promise(setImmediate);

            // Assert:
            const expectedContactToBeAdded = {
                id: 0,
                name: nameToBeInputted,
                address: addressToBeInputted,
                notes: notesToBeInputted,
                isBlackListed: false,
            };
            const expectedFirstDispatchedAction = {
                type: 'addressBook/selectContact',
                payload: expectedContactToBeAdded,
            };
            const expectedSecondDispatchedAction = {
                type: 'addressBook/updateContact',
                payload: expectedContactToBeAdded,
            };
            expect(mockDispatchAction).nthCalledWith(1, expectedFirstDispatchedAction);
            expect(mockDispatchAction).nthCalledWith(2, expectedSecondDispatchedAction);
            expect(mockGoBack).toHaveBeenCalledTimes(1);
        });
    });
});
