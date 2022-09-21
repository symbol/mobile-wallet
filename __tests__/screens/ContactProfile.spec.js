import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import ContactProfile from '@src/screens/ContactProfile';
import { Router } from '@src/Router';
import { account1 } from '../../__mocks__/account';
import { mockStore } from '__mocks__/store';
import { mockSecureStorage } from '../../__mocks__/storage';
import { AddressBook } from 'symbol-address-book';

jest.mock('@src/locales/i18n', () => t => `t_${t}`);
jest.mock('react-native/Libraries/Modal/Modal', () => {
    const React = require('react');
    class Modal extends React.Component {
        render() {
            return React.createElement('Modal', this.props, this.props.visible ? this.props.children : null);
        }
    }

    return Modal;
});

const mockGoToAddContact = jest.fn();
const mockGoBack = jest.fn();
const name = 'Contact Name';
const address = account1.address.plain();
const notes = 'This is notes';
const contact = {
    id: 0,
    name,
    address,
    notes,
};
let store;

beforeEach(() => {
    store = mockStore({
        addressBook: {
            addressBook: new AddressBook([contact]),
            selectedContact: contact,
        },
    });
    mockSecureStorage({});
    Router.goBack = mockGoBack;
    Router.goToAddContact = mockGoToAddContact;
    mockGoToAddContact.mockClear();
    mockGoBack.mockClear();
});

describe('screens/ContactProfile', () => {
    describe('list type', () => {
        const renderListTypeTest = (isBlackListed, expectedTransactionAllowedText) => {
            // Arrange:
            const store = mockStore({
                addressBook: {
                    selectedContact: {
                        name,
                        address,
                        notes,
                        isBlackListed,
                    },
                },
            });

            // Act:
            const screen = renderConnected(<ContactProfile />, store);

            // Assert:
            expect(screen.queryByText(name)).not.toBeNull();
            expect(screen.queryByText(address)).not.toBeNull();
            expect(screen.queryByText(notes)).not.toBeNull();
            expect(screen.queryByText(expectedTransactionAllowedText)).not.toBeNull();
        };

        test('renders the transactions are allowed text when isBlackListed is false', () => {
            // Arrange:
            const isBlackListed = false;

            // Act + Assert:
            const expectedTransactionAllowedText = 't_addressBook.transactionsAllowed';
            renderListTypeTest(isBlackListed, expectedTransactionAllowedText);
        });

        test('renders the transactions are blocked text when isBlackListed is false', () => {
            // Arrange:
            const isBlackListed = true;

            // Act + Assert:
            const expectedTransactionAllowedText = 't_addressBook.transactionsBlocked';
            renderListTypeTest(isBlackListed, expectedTransactionAllowedText);
        });
    });

    describe('edit', () => {
        test('navigates to AddContact screen when press on edit button', () => {
            // Act:
            const screen = renderConnected(<ContactProfile />, store);
            const editButton = screen.getByText('t_addressBook.editContact');
            fireEvent.press(editButton);

            // Assert:
            expect(mockGoToAddContact).toBeCalledTimes(1);
        });
    });

    describe('remove', () => {
        test('shows confirmation modal when press on remove button', async () => {
            // Act:
            const screen = renderConnected(<ContactProfile />, store);
            const removeButton = screen.getByText('t_addressBook.removeContact');
            fireEvent.press(removeButton);
            await new Promise(setImmediate);
            const selectedContact = store.getState().addressBook.addressBook.getContactByAddress(address);

            // Assert:
            expect(selectedContact).toStrictEqual(contact);
            expect(screen.queryByText('t_addressBook.removeContactModalBody')).not.toBeNull();
        });

        test('hides confirmation modal when press on discard button', async () => {
            // Act:
            const screen = renderConnected(<ContactProfile />, store);
            const removeButton = screen.getByText('t_addressBook.removeContact');
            fireEvent.press(removeButton);
            const discardButton = screen.getByText('t_Settings.passcode.alertTextCancel');
            fireEvent.press(discardButton);
            await new Promise(setImmediate);
            const selectedContact = store.getState().addressBook.addressBook.getContactByAddress(address);

            // Assert:
            expect(selectedContact).toStrictEqual(contact);
            expect(screen.queryByText('t_addressBook.removeContactModalBody')).toBeNull();
        });

        test('removes contact when press on confirm button', async () => {
            // Act:
            const screen = renderConnected(<ContactProfile />, store);
            const removeButton = screen.getByText('t_addressBook.removeContact');
            fireEvent.press(removeButton);
            const confirmButton = screen.getByText('t_unsortedKeys.confirmButton');
            fireEvent.press(confirmButton);
            await new Promise(setImmediate);
            const removedContact = store.getState().addressBook.addressBook.getContactByAddress(address);

            // Assert:
            expect(removedContact).toBe(undefined);
            expect(mockGoBack).toBeCalledTimes(1);
        });
    });
});
