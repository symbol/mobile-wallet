import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import History from '@src/screens/History';
import { account1, account2, account3 } from '../../__mocks__/account';
import { mockStore } from '__mocks__/store';
import { mockSecureStorage } from '../../__mocks__/storage';
import { createGetAccountInfo } from '__mocks__/AccountHttp';
import { createGetTransaction, createSearch } from '__mocks__/TransactionHttp';
import { createTransferTransaction } from '__mocks__/transaction';
import { AccountHttp, TransactionGroup, TransactionHttp } from 'symbol-sdk';
import { AddressBook } from 'symbol-address-book';

jest.mock('@src/locales/i18n', () => t => `t_${t}`);

const transactionPageAddressBookAll = [
    createTransferTransaction({ signer: account1, recipientAddress: account1.address }),
    createTransferTransaction({ signer: account2, recipientAddress: account1.address }),
    createTransferTransaction({ signer: account1, recipientAddress: account3.address }),
];
const transactionPageAddressBookSent = [createTransferTransaction({ signer: account1, recipientAddress: account3.address })];
const transactionPageAddressBookReceived = [
    createTransferTransaction({ signer: account1, recipientAddress: account1.address }),
    createTransferTransaction({ signer: account3, recipientAddress: account1.address }),
];
let store;

beforeEach(() => {
    store = mockStore({
        account: {
            selectedAccountAddress: account1.address.plain(),
            cosignatoryOf: [],
            multisigGraphInfo: undefined,
        },
        addressBook: {
            addressBook: new AddressBook([
                {
                    id: 0,
                    name: 'Blocked One',
                    address: account2.address.plain(),
                    isBlackListed: true,
                },
                {
                    id: 1,
                    name: 'Contact Name',
                    address: account3.address.plain(),
                },
            ]),
        },
        transaction: {
            transactions: [],
            isLastPage: false,
            addressFilter: null,
            filter: 'ALL',
            loading: false,
            isNextLoading: false,
        },
    });
    mockSecureStorage({});
});

describe('screens/History', () => {
    describe('filter transactions', () => {
        const runFilterTest = async (filterTextToPress, transactionPage, expectations) => {
            // Arrange:
            jest.spyOn(AccountHttp.prototype, 'getAccountInfo').mockImplementation(createGetAccountInfo(account1));
            const mockSearch = jest
                .spyOn(TransactionHttp.prototype, 'search')
                .mockImplementation(createSearch(transactionPage, TransactionGroup.Confirmed));
            jest.spyOn(TransactionHttp.prototype, 'getTransaction').mockImplementation(createGetTransaction(transactionPage));
            const numberOfCallsPerFetchAction = 3;

            // Act:
            await store.dispatchAction({ type: 'transaction/init' });
            await new Promise(setImmediate);
            const screen = renderConnected(<History />, store);
            const dropdownSelectorElement = screen.getAllByText('t_history.all')[0];
            fireEvent.press(dropdownSelectorElement);
            const dropdownItemElement = screen.getAllByText(filterTextToPress).pop();
            fireEvent.press(dropdownItemElement);
            await new Promise(setImmediate);

            // Assert:
            const lastConfirmedGroupCall = mockSearch.mock.calls.length - numberOfCallsPerFetchAction + 1;
            expect(mockSearch).toHaveBeenNthCalledWith(lastConfirmedGroupCall, {
                group: 'confirmed',
                order: 'desc',
                pageNumber: 1,
                pageSize: 15,
                ...expectations.searchCriteria,
            });
            expectations.transactionAddressesToShow.forEach(address =>
                expect(screen.queryByText(address, { exact: false })).not.toBeNull()
            );
            expectations.transactionAddressesToHide.forEach(address => expect(screen.queryByText(address, { exact: false })).toBeNull());
        };

        test('renders transactions except blocked when filter value is "ALL"', async () => {
            // Arrange:
            const filterTextToPress = 't_history.all';
            const transactionPage = transactionPageAddressBookAll;

            // Act + Assert:
            const expectations = {
                transactionAddressesToShow: ['Contact Name', 't_unsortedKeys.currentAddress'],
                transactionAddressesToHide: ['Blocked One'],
                searchCriteria: {
                    address: account1.address,
                },
            };
            await runFilterTest(filterTextToPress, transactionPage, expectations);
        });

        test('renders outgoing transactions when filter value is "SENT"', async () => {
            // Arrange:
            const filterTextToPress = 't_history.sent';
            const transactionPage = transactionPageAddressBookSent;

            // Act + Assert:
            const expectations = {
                transactionAddressesToShow: ['Contact Name'],
                transactionAddressesToHide: ['Blocked One', 't_unsortedKeys.currentAddress'],
                searchCriteria: {
                    signerPublicKey: account1.publicKey,
                },
            };
            await runFilterTest(filterTextToPress, transactionPage, expectations);
        });

        test('renders incoming transactions when filter value is "RECEIVED"', async () => {
            // Arrange:
            const filterTextToPress = 't_history.received';
            const transactionPage = transactionPageAddressBookReceived;

            // Act + Assert:
            const expectations = {
                transactionAddressesToShow: ['Contact Name', 't_unsortedKeys.currentAddress'],
                transactionAddressesToHide: ['Blocked One'],
                searchCriteria: {
                    recipientAddress: account1.address,
                },
            };
            await runFilterTest(filterTextToPress, transactionPage, expectations);
        });

        test('renders blocked transactions when filter value is "BLOCKED"', async () => {
            // Arrange:
            const filterTextToPress = 't_history.blocked';
            const transactionPage = transactionPageAddressBookAll;

            // Act + Assert:
            const expectations = {
                transactionAddressesToShow: ['Blocked One'],
                transactionAddressesToHide: ['Contact Name', 't_unsortedKeys.currentAddress'],
                searchCriteria: {
                    address: account1.address,
                },
            };
            await runFilterTest(filterTextToPress, transactionPage, expectations);
        });
    });
});
