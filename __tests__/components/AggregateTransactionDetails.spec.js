import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { AggregateTransactionDetails } from '@src/components';
import { Router } from '@src/Router';
import { account1, account2, account3, account4, account5 } from '../../__mocks__/account';
import { mockStore } from '__mocks__/store';
import { mockSecureStorage } from '../../__mocks__/storage';
import { createAnnounceAggregateBondedCosignature, createGetTransaction } from '__mocks__/TransactionHttp';
import { createAggregateBondedTransaction, createTransferTransaction } from '__mocks__/transaction';
import { TransactionHttp } from 'symbol-sdk';
import { network } from '__mocks__/network';
import { AddressBook } from 'symbol-address-book';

jest.mock('@src/components/transaction-graphic/TransactionGraphic', () => {
    const React = require('react');
    const { Text } = require('react-native');
    const TransactionGraphicStub = () => <Text>Transaction Graphic</Text>;

    return TransactionGraphicStub;
});
jest.mock('@src/locales/i18n', () => t => `t_${t}`);

const currentAccount = account1;
const blacklistedAccount = account2;
const whitelistedAccount = account3;
const knownAccount = account4;
const unknownAccount = account5;
const transactionWithInnerTransfer = createAggregateBondedTransaction({
    signer: whitelistedAccount,
    innerTransactions: [createTransferTransaction({})],
});
const transactionUnknownSigner = createAggregateBondedTransaction({ signer: unknownAccount });
const transactionKnownSigner = createAggregateBondedTransaction({ signer: knownAccount });
const transactionBlacklistedSigner = createAggregateBondedTransaction({ signer: blacklistedAccount });
const transactionWhitelistedSigner = createAggregateBondedTransaction({ signer: whitelistedAccount });
const mockGoToAddContact = jest.fn();
const mockGoToContactProfile = jest.fn();
const mockShowMessage = jest.fn();
let store;

beforeEach(() => {
    store = mockStore({
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
        network: {
            selectedNetwork: network,
        },
        transaction: {
            addressFilter: currentAccount.address.plain(),
        },
        wallet: {
            selectedAccount: currentAccount,
        },
    });
    Router.goToAddContact = mockGoToAddContact;
    Router.goToContactProfile = mockGoToContactProfile;
    Router.showMessage = mockShowMessage;
    mockSecureStorage({});
});

describe('components/AggregateTransactionDetails', () => {
    const mockFetchTransaction = transaction => {
        if (transaction) {
            jest.spyOn(TransactionHttp.prototype, 'getTransaction').mockImplementation(createGetTransaction([transaction]));
            return;
        }

        jest.spyOn(TransactionHttp.prototype, 'getTransaction').mockRejectedValue(Error('error'));
    };

    const renderComponent = async (transaction, changeProps = {}) => {
        mockFetchTransaction(transaction);
        const props = {
            transaction,
            onClose: jest.fn(),
            ...changeProps,
        };
        const screen = renderConnected(<AggregateTransactionDetails {...props} />, store);
        await new Promise(setImmediate);

        return screen;
    };

    describe('close', () => {
        const runCloseTest = async (shouldThrowError, shouldClickOnCloseButton, expectedOnErrorToBeCalled) => {
            // Arrange:
            const mockOnClose = jest.fn();
            const mockOnError = jest.fn();
            const props = {
                transaction: transactionWithInnerTransfer,
                onClose: mockOnClose,
                onError: mockOnError,
            };
            const transaction = shouldThrowError ? null : transactionWithInnerTransfer;

            // Act:
            const screen = await renderComponent(transaction, props);
            if (shouldClickOnCloseButton) {
                const closeButton = screen.getByTestId('button-close');
                fireEvent.press(closeButton);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Assert:
            expect(mockOnClose).toHaveBeenCalled();
            if (expectedOnErrorToBeCalled) {
                expect(mockOnError).toHaveBeenCalled();
                expect(mockShowMessage).toHaveBeenCalled();
            } else {
                expect(mockOnError).not.toHaveBeenCalled();
                expect(mockShowMessage).not.toHaveBeenCalled();
            }
        };

        test('emits onClose event when click on close button', async () => {
            // Arrange:
            const shouldThrowError = false;
            const shouldClickOnCloseButton = true;

            // Act + Assert:
            const expectedOnErrorToBeCalled = false;
            await runCloseTest(shouldThrowError, shouldClickOnCloseButton, expectedOnErrorToBeCalled);
        });

        test('emits onClose and onError events when error occurs', async () => {
            // Arrange:
            const shouldThrowError = true;
            const shouldClickOnCloseButton = false;

            // Act + Assert:
            const expectedOnErrorToBeCalled = true;
            await runCloseTest(shouldThrowError, shouldClickOnCloseButton, expectedOnErrorToBeCalled);
        });
    });

    describe('tabs', () => {
        const runTabsTest = async (tabTextToPress, expectedTextToBeRendered) => {
            // Act:
            const screen = await renderComponent(transactionWithInnerTransfer);
            const tab = screen.getByText(tabTextToPress);
            fireEvent.press(tab);
            await new Promise(setImmediate);

            // Assert:
            expectedTextToBeRendered.forEach(text => expect(screen.getByText(text, { exact: false })).not.toBeNull());
        };

        test('inner transactions', async () => {
            // Arrange:
            const tabTextToPress = 't_history.innerTransactionTab';

            // Act + Assert:
            const expectedTextToBeRendered = ['Transaction Graphic'];
            await runTabsTest(tabTextToPress, expectedTextToBeRendered);
        });

        test('info', async () => {
            // Arrange:
            const tabTextToPress = 't_history.infoTransactionTab';

            // Act + Assert:
            const expectedTextToBeRendered = [
                't_table.transactionType',
                't_transactionTypes.transactionDescriptor_16961',
                't_table.signerAddress',
                whitelistedAccount.address.plain(),
                't_table.hash',
                transactionWithInnerTransfer.transactionInfo.hash,
                't_link.blockExplorerTransaction',
            ];
            await runTabsTest(tabTextToPress, expectedTextToBeRendered);
        });
    });

    describe('transaction is awaiting signature signed by', () => {
        describe('unknown signer', () => {
            const runUnknownSignerTest = async (buttonTextToPress, expectedAddContactProps) => {
                // Arrange:
                const transaction = transactionUnknownSigner;

                // Act:
                const screen = await renderComponent(transaction);

                // Assert:
                expect(screen.queryByText('t_history.cosignFormTitleRequireSignatureUnknown')).not.toBeNull();

                // Act:
                const continueButtonElement = screen.getByText('t_history.cosignFormButtonContinue');
                fireEvent.press(continueButtonElement);

                // Assert:
                expect(screen.queryByText('t_history.cosignFormUnknownSignerCaution')).not.toBeNull();
                expect(screen.queryByText('t_history.cosignFormUnknownSignerExplanation')).not.toBeNull();

                // Act:
                const addressBookButtonElement = screen.getByText(buttonTextToPress);
                fireEvent.press(addressBookButtonElement);
                await new Promise(setImmediate);

                // Assert:
                expect(mockGoToAddContact).toBeCalledWith(expectedAddContactProps, undefined);
            };

            test('navigates to the add contact screen with preselected blacklist field when press on button', async () => {
                // Arrange:
                const buttonTextToPress = 't_history.cosignFormButtonBlacklist';

                // Act + Assert:
                const expectedAddContactProps = {
                    address: unknownAccount.address.plain(),
                    isBlackListed: true,
                };
                await runUnknownSignerTest(buttonTextToPress, expectedAddContactProps);
            });

            test('navigates to the add contact screen with preselected whitelist field when press on button', async () => {
                // Arrange:
                const buttonTextToPress = 't_history.cosignFormButtonWhitelist';

                // Act + Assert:
                const expectedAddContactProps = {
                    address: unknownAccount.address.plain(),
                    isBlackListed: false,
                };
                await runUnknownSignerTest(buttonTextToPress, expectedAddContactProps);
            });
        });

        describe('blacklisted signer', () => {
            test('navigates to contact profile when press on button', async () => {
                // Arrange:
                const transaction = transactionBlacklistedSigner;

                // Act:
                const screen = await renderComponent(transaction);

                // Assert:
                expect(screen.queryByText('t_history.cosignFormTitleRequireSignature')).not.toBeNull();
                expect(screen.queryByText('t_history.cosignFormBlockedSignerExplanation')).not.toBeNull();

                // Act:
                const viewContactButtonElement = screen.getByText('t_history.cosignFormButtonViewContact');
                fireEvent.press(viewContactButtonElement);
                await new Promise(setImmediate);

                // Assert:
                expect(mockGoToContactProfile).toBeCalledWith({}, undefined);
            });
        });

        describe('whitelisted signer', () => {
            test('signs transaction when press on button', async () => {
                // Arrange:
                const transaction = transactionWhitelistedSigner;
                const mockAnnouceTransaction = jest
                    .spyOn(TransactionHttp.prototype, 'announceAggregateBondedCosignature')
                    .mockImplementation(createAnnounceAggregateBondedCosignature());

                // Act:
                const screen = await renderComponent(transaction);

                // Assert:
                expect(screen.queryByText('t_history.cosignFormTitleRequireSignature')).not.toBeNull();

                // Act:
                const signButtonElement = screen.getByText('t_history.transaction.sign');
                fireEvent.press(signButtonElement);
                await new Promise(setImmediate);

                // Assert:
                expect(mockAnnouceTransaction).toBeCalledWith(
                    expect.objectContaining({
                        signerPublicKey: currentAccount.publicKey,
                    })
                );
            });
        });

        describe('known signer', () => {
            test('shows warning and signs transaction when press on button', async () => {
                // Arrange:
                const transaction = transactionKnownSigner;
                const mockAnnouceTransaction = jest
                    .spyOn(TransactionHttp.prototype, 'announceAggregateBondedCosignature')
                    .mockImplementation(createAnnounceAggregateBondedCosignature());

                // Act:
                const screen = await renderComponent(transaction);

                // Assert:
                expect(screen.queryByText('t_history.cosignFormTitleRequireSignatureUnknown')).not.toBeNull();

                // Act:
                const continueButtonElement = screen.getByText('t_history.cosignFormButtonGoToSign');
                fireEvent.press(continueButtonElement);

                // Assert:
                const signButtonElement = screen.getByText('t_history.transaction.sign');
                expect(screen.queryByText('t_history.cosignFormTitleLastWarning')).not.toBeNull();
                expect(signButtonElement).toBeDisabled();

                // Act:
                const checkboxElement = screen.getByText('t_history.cosignFormCheckbox');
                fireEvent.press(checkboxElement);
                fireEvent.press(signButtonElement);
                await new Promise(setImmediate);

                // Assert:
                expect(mockAnnouceTransaction).toBeCalledWith(
                    expect.objectContaining({
                        signerPublicKey: currentAccount.publicKey,
                    })
                );
            });

            test('navigates to previous view when press on back button', async () => {
                // Arrange:
                const transaction = transactionKnownSigner;

                // Act:
                const screen = await renderComponent(transaction);
                const continueButtonElement = screen.getByText('t_history.cosignFormButtonGoToSign');
                fireEvent.press(continueButtonElement);
                const buttonBackElement = screen.getByText('t_history.cosignFormButtonBack');
                fireEvent.press(buttonBackElement);

                // Assert:
                expect(screen.queryByText('t_history.cosignFormTitleRequireSignatureUnknown')).not.toBeNull();
            });

            test('navigates to the add contact screen with preselected blacklist field when press on block button', async () => {
                // Arrange:
                const transaction = transactionKnownSigner;

                // Act:
                const screen = await renderComponent(transaction);
                const blockButtonElement = screen.getByText('t_history.cosignFormButtonBlacklist');
                fireEvent.press(blockButtonElement);
                await new Promise(setImmediate);

                // Assert:
                expect(mockGoToAddContact).toBeCalledWith(
                    {
                        address: knownAccount.address.plain(),
                        isBlackListed: true,
                    },
                    undefined
                );
            });
        });
    });
});
