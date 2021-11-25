import { AddressBook, IContact } from 'symbol-address-book';
import { AddressBookSecureStorage } from '@src/storage/persistence/AddressBookSecureStorage';

type AddressBookState = {
    initialized: boolean,
    addressBook: AddressBook,
    selectedContact: IContact,
};

const addressBookState: AddressBookState = {
    initialized: false,
    addressBook: null,
    selectedContact: null,
};

export default {
    namespace: 'addressBook',
    state: addressBookState,
    mutations: {
        setInitialized: (state, payload) => {
            state.addressBook.initialized = payload;
            return state;
        },
        setAddressBook: (state, payload) => {
            state.addressBook.addressBook = payload;
            return state;
        },
        setSelectedContact: (state, payload) => {
            state.addressBook.selectedContact = payload;
            return state;
        },
    },
    actions: {
        loadAddressBook: async ({ commit }) => {
            const addressBook = await AddressBookSecureStorage.retrieveAddressBook();
            commit({
                type: 'addressBook/setAddressBook',
                payload: addressBook,
            });
        },

        addContact: async ({ commit, dispatchAction, state }, contact) => {
            let addressBook = state.addressBook.addressBook;
            addressBook.addContact(contact);
            await AddressBookSecureStorage.saveAddressBook(addressBook);
            commit({
                type: 'addressBook/setAddressBook',
                payload: addressBook,
            });
            await dispatchAction({ type: 'addressBook/loadAddressBook' });
        },

        selectContact: async ({ commit }, contact) => {
            await commit({
                type: 'addressBook/setSelectedContact',
                payload: contact,
            });
        },

        updateContact: async ({ commit, dispatchAction, state }, contact) => {
            let addressBook = state.addressBook.addressBook;
            addressBook.updateContact(contact.id, contact);
            await AddressBookSecureStorage.saveAddressBook(addressBook);
            commit({
                type: 'addressBook/setAddressBook',
                payload: addressBook,
            });
            await dispatchAction({ type: 'addressBook/loadAddressBook' });
        },

        removeContact: async ({ commit, dispatchAction, state }, id) => {
            let addressBook = state.addressBook.addressBook;
            addressBook.removeContact(id);
            await AddressBookSecureStorage.saveAddressBook(addressBook);
            commit({
                type: 'addressBook/setAddressBook',
                payload: addressBook,
            });
            await dispatchAction({ type: 'addressBook/loadAddressBook' });
        },
    },
};
