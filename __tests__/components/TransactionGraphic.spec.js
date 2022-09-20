import React from 'react';
import { TransactionGraphic } from '@src/components';
import { FormatTransaction } from '@src/services/FormatTransaction';
import { account1, account2, account3, account4 } from '../../__mocks__/account';
import { mockStore } from '__mocks__/store';
import { mockSecureStorage } from '../../__mocks__/storage';
import { createTransferTransaction } from '__mocks__/transaction';
import { network } from '__mocks__/network';
import { AddressBook } from 'symbol-address-book';

jest.mock('@src/locales/i18n', () => t => `t_${t}`);

let store;

beforeEach(() => {
    store = mockStore({
        account: {
            selectedAccountAddress: account1.address.plain(),
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
        network: {
            selectedNetwork: network,
        },
    });
    mockSecureStorage({});
});

describe('screens/TransactionGraphic', () => {
    describe('AccountIcon', () => {
        const runAccountIconTest = (transaction, expectedCaptionTextList) => {
            // Arrange:
            const props = {
                ...transaction,
                index: 0,
                expand: false,
            };

            // Act:
            const screen = renderConnected(<TransactionGraphic {...props} />, store);

            // Assert:
            expectedCaptionTextList.forEach(text => {
                expect(screen.queryAllByText(text)[0]).toBeDefined();
                expect(screen.queryAllByText(text)[1]).toBeDefined();
            });
        };

        test('renders account address', async () => {
            // Arrange:
            const transaction = await FormatTransaction.format(
                createTransferTransaction({ signer: account4, recipientAddress: account4.address }),
                network,
                []
            );

            // Act + Assert:
            const expectedCaptionTextList = ['TAP2M723AA4QZV2', '7P373IRXMLWENSX', 'YJ4EE3QYQ'];
            runAccountIconTest(transaction, expectedCaptionTextList);
        });

        test('renders contact name', async () => {
            // Arrange:
            const transaction = await FormatTransaction.format(
                createTransferTransaction({ signer: account3, recipientAddress: account3.address }),
                network,
                []
            );

            // Act + Assert:
            const expectedCaptionTextList = ['Contact Name'];
            runAccountIconTest(transaction, expectedCaptionTextList);
        });

        test('renders current account caption', async () => {
            // Arrange:
            const transaction = await FormatTransaction.format(
                createTransferTransaction({ signer: account1, recipientAddress: account1.address }),
                network,
                []
            );

            // Act + Assert:
            const expectedCaptionTextList = ['t_unsortedKeys.currentAccount'];
            runAccountIconTest(transaction, expectedCaptionTextList);
        });

        test('renders blocked account caption', async () => {
            // Arrange:
            const transaction = await FormatTransaction.format(
                createTransferTransaction({ signer: account2, recipientAddress: account2.address }),
                network,
                []
            );

            // Act + Assert:
            const expectedCaptionTextList = ['t_addressBook.addressBlocked'];
            runAccountIconTest(transaction, expectedCaptionTextList);
        });
    });
});
