import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import History from '@src/screens/History';
import { account1, account2, account3, account4 } from '../../__mocks__/account';
import { mockStore } from '__mocks__/store';
import { mockSecureStorage } from '../../__mocks__/storage';
import { createGetAccountInfo } from '__mocks__/AccountHttp';
import { createGetTransaction, createSearch } from '__mocks__/TransactionHttp';
import { createTransferTransaction } from '__mocks__/transaction';
import { AccountHttp, TransactionGroup, TransactionHttp } from 'symbol-sdk';
import { AddressBook } from 'symbol-address-book';

jest.mock('@src/locales/i18n', () => t => `t_${t}`);

const currentAccount = account1;
const blacklistedAccount = account2;
const whitelistedAccount = account3;
const knownAccount = account4;
const transactionPageAddressBookAll = [
    createTransferTransaction({ signer: currentAccount, recipientAddress: currentAccount.address }),
    createTransferTransaction({ signer: blacklistedAccount, recipientAddress: currentAccount.address }),
    createTransferTransaction({ signer: currentAccount, recipientAddress: whitelistedAccount.address }),
];
const transactionPageAddressBookSent = [
    createTransferTransaction({ signer: currentAccount, recipientAddress: whitelistedAccount.address }),
];
const transactionPageAddressBookReceived = [
    createTransferTransaction({ signer: currentAccount, recipientAddress: currentAccount.address }),
    createTransferTransaction({ signer: whitelistedAccount, recipientAddress: currentAccount.address }),
];
let store;

beforeEach(() => {
    store = mockStore({
        account: {
            selectedAccountAddress: currentAccount.address.plain(),
            cosignatoryOf: [],
            multisigGraphInfo: undefined,
            multisigTreeAccounts: [
                {
                    accountAddress: knownAccount.address,
                },
            ],
        },
        addressBook: {
            addressBook: new AddressBook([
                {
                    id: 0,
                    name: 'Blocked One',
                    address: blacklistedAccount.address.plain(),
                    isBlackListed: true,
                },
                {
                    id: 1,
                    name: 'Contact Name',
                    address: whitelistedAccount.address.plain(),
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
        wallet: {
            selectedAccount: currentAccount,
        },
    });
    mockSecureStorage({});
});

describe('screens/History', () => {
    const mockFetchTransactions = transactionPage => {
        jest.spyOn(AccountHttp.prototype, 'getAccountInfo').mockImplementation(createGetAccountInfo(currentAccount));
        const mockSearch = jest
            .spyOn(TransactionHttp.prototype, 'search')
            .mockImplementation(createSearch(transactionPage, TransactionGroup.Confirmed));
        jest.spyOn(TransactionHttp.prototype, 'getTransaction').mockImplementation(createGetTransaction(transactionPage));

        return mockSearch;
    };

    const selectTransactionFilter = async (screen, filterTextToPress) => {
        const dropdownSelectorElement = screen.getAllByText('t_history.all')[0];
        fireEvent.press(dropdownSelectorElement);
        const dropdownItemElement = screen.getAllByText(filterTextToPress).pop();
        fireEvent.press(dropdownItemElement);
        await new Promise(setImmediate);
    };

    describe('filter transactions', () => {
        const runFilterTest = async (filterTextToPress, transactionPage, expectations) => {
            // Arrange:
            const mockSearch = mockFetchTransactions(transactionPage);
            const numberOfCallsPerFetchAction = 3;

            // Act:
            await store.dispatchAction({ type: 'transaction/init' });
            await new Promise(setImmediate);
            const screen = renderConnected(<History />, store);
            await selectTransactionFilter(screen, filterTextToPress);

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
                    address: currentAccount.address,
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
                    signerPublicKey: currentAccount.publicKey,
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
                    recipientAddress: currentAccount.address,
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
                    address: currentAccount.address,
                },
            };
            await runFilterTest(filterTextToPress, transactionPage, expectations);
        });
    });
});
