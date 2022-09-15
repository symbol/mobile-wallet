import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import AddressBookPage from '@src/screens/AddressBook';
import { Router } from '@src/Router';
import { AddressBook } from 'symbol-address-book';
import { mockStore } from '__mocks__/store';

jest.mock('@src/locales/i18n', () => t => `t_${t}`);

const mockGoToAddContact = jest.fn();
const mockGoToContactProfile = jest.fn();
const contacts = [
    {
        id: 0,
        name: 'Rynok Pryvoz',
        address: 'TBWKWT2HMH7ADCZO2GDZAXEXXDISOKQOFSD3YWA',
        isBlackListed: false,
    },
    {
        id: 1,
        name: 'Frantsuzky Bulvar',
        address: 'TAB4432XBEOOIZPVXAXKJZFULEC72FSREFVCHKY',
        isBlackListed: true,
    },
    {
        id: 2,
        name: 'Staroportofrankivska Vulytsya',
        address: 'TDWINZ6GNTUWNYCXZ6NJBJWMZ3QU43Q7RWK2P6I',
        isBlackListed: false,
    },
];
let store;

beforeEach(() => {
    store = mockStore({
        addressBook: {
            addressBook: new AddressBook(contacts),
            selectedContact: null,
        },
    });
    Router.goToAddContact = mockGoToAddContact;
    Router.goToContactProfile = mockGoToContactProfile;
    mockGoToAddContact.mockClear();
    mockGoToContactProfile.mockClear();
});

describe('screens/AddressBook', () => {
    describe('whitelist', () => {
        test('renders contact list', () => {
            // Act:
            const screen = renderConnected(<AddressBookPage />, store);

            // Assert:
            expect(screen.queryByText(contacts[0].name)).not.toBeNull();
            expect(screen.queryByText(contacts[1].name)).toBeNull();
            expect(screen.queryByText(contacts[2].name)).not.toBeNull();
        });

        test('invoke "AddContact" screen when press on button', async () => {
            // Act:
            const screen = renderConnected(<AddressBookPage />, store);
            const buttonElement = screen.getByText('t_addressBook.addContact');
            fireEvent.press(buttonElement);
            await new Promise(setImmediate);
            const selectedContact = store.getState().addressBook.selectedContact;

            // Assert:
            expect(selectedContact).toEqual(null);
            expect(mockGoToAddContact).toBeCalledWith({ isBlackListed: false }, undefined);
            expect(mockGoToContactProfile).toHaveBeenCalledTimes(0);
        });
    });

    describe('blacklist', () => {
        test('renders blacklist', async () => {
            // Act:
            const screen = renderConnected(<AddressBookPage />, store);
            const tabBlacklistElement = screen.getByText('t_addressBook.blacklist');
            fireEvent.press(tabBlacklistElement);

            // Assert:
            expect(screen.queryByText(contacts[0].name)).toBeNull();
            expect(screen.queryByText(contacts[1].name)).not.toBeNull();
            expect(screen.queryByText(contacts[2].name)).toBeNull();
        });

        test('invoke "AddContact" screen when press on button', async () => {
            // Act:
            const screen = renderConnected(<AddressBookPage />, store);
            const tabBlacklistElement = screen.getByText('t_addressBook.blacklist');
            fireEvent.press(tabBlacklistElement);
            const buttonElement = screen.getByText('t_addressBook.addContact');
            fireEvent.press(buttonElement);
            await new Promise(setImmediate);
            const selectedContact = store.getState().addressBook.selectedContact;

            // Assert:
            expect(selectedContact).toEqual(null);
            expect(mockGoToAddContact).toBeCalledWith({ isBlackListed: true }, undefined);
            expect(mockGoToContactProfile).toHaveBeenCalledTimes(0);
        });
    });

    test('invoke "ContactProfile" screen when press on item', async () => {
        // Act:
        const screen = renderConnected(<AddressBookPage />, store);
        const buttonElement = screen.getByText(contacts[0].name);
        fireEvent.press(buttonElement);
        await new Promise(setImmediate);
        const selectedContact = store.getState().addressBook.selectedContact;

        // Assert:
        expect(selectedContact).toEqual(contacts[0]);
        expect(mockGoToAddContact).toHaveBeenCalledTimes(0);
        expect(mockGoToContactProfile).toHaveBeenCalledTimes(1);
    });
});
