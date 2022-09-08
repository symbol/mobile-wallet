import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { AddressBookPage } from '@src/screens/AddressBook';
import { Router } from '@src/Router';
import store from '@src/store';
import { AddressBook } from 'symbol-address-book';

jest.mock('@src/locales/i18n', () => t => `t_${t}`);

const mockDispatchAction = jest.fn().mockResolvedValue(null);
const mockGoToAddContact = jest.fn();
const mockGoToContactProfile = jest.fn();

beforeEach(() => {
    store.dispatchAction = mockDispatchAction;
    Router.goToAddContact = mockGoToAddContact;
    Router.goToContactProfile = mockGoToContactProfile;
    mockDispatchAction.mockClear();
    mockGoToAddContact.mockClear();
    mockGoToContactProfile.mockClear();
});

describe('screens/AddressBook', () => {
    // Arrange:
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
    const addressBook = new AddressBook(contacts);

    test('renders whitelist', () => {
        // Act:
        const screen = render(<AddressBookPage addressBook={addressBook} />);

        // Assert:
        expect(screen.queryByText(contacts[0].name)).not.toBeNull();
        expect(screen.queryByText(contacts[1].name)).toBeNull();
        expect(screen.queryByText(contacts[2].name)).not.toBeNull();
    });

    test('renders blacklist', async () => {
        // Act:
        const screen = render(<AddressBookPage addressBook={addressBook} />);
        const tabBlacklistElement = screen.getByText('t_addressBook.blacklist');
        fireEvent.press(tabBlacklistElement);

        // Assert:
        expect(screen.queryByText(contacts[0].name)).toBeNull();
        expect(screen.queryByText(contacts[1].name)).not.toBeNull();
        expect(screen.queryByText(contacts[2].name)).toBeNull();
    });

    test('invoke "AddContact" screen when press on button', async () => {
        // Act:
        const screen = render(<AddressBookPage addressBook={addressBook} />);
        const buttonElement = screen.getByText('t_addressBook.addContact');
        fireEvent.press(buttonElement);
        await new Promise(setImmediate);

        // Assert:
        expect(mockDispatchAction).toBeCalledWith({
            type: 'addressBook/selectContact',
            payload: null,
        });
        expect(mockGoToAddContact).toHaveBeenCalledTimes(1);
        expect(mockGoToContactProfile).toHaveBeenCalledTimes(0);
    });

    test('invoke "ContactProfile" screen when press on item', async () => {
        // Act:
        const screen = render(<AddressBookPage addressBook={addressBook} />);
        const buttonElement = screen.getByText(contacts[0].name);
        fireEvent.press(buttonElement);
        await new Promise(setImmediate);

        // Assert:
        expect(mockDispatchAction).toBeCalledWith({
            type: 'addressBook/selectContact',
            payload: contacts[0],
        });
        expect(mockGoToAddContact).toHaveBeenCalledTimes(0);
        expect(mockGoToContactProfile).toHaveBeenCalledTimes(1);
    });
});
