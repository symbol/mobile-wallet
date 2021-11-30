/**
 * @format
 * @flow
 */
import Realm from 'realm';
import Observable, { from } from 'rxjs';
import { AccountInfo, AccountType } from 'symbol-sdk';

// eslint-disable-next-line
import Mosaic from './Mosaic';

import AccountMosaicBalance from './AccountMosaicBalance';

class Account extends Realm.Object {
    mockCurrency = 'XEM';

    // $FlowFixMe
    get accountID() {
        return this.address;
    }

    // $FlowFixMe
    get alias() {
        return `Account ${this.bipIndex + 1}`;
    }

    // $FlowFixMe
    get currencyCode() {
        // This has to be get from the network, mosaic name ?
        return this.mockCurrency;
    }

    // $FlowFixMe
    get networkCurrency() {
        const lookupID = AccountMosaicBalance.CreateAccountMosaicID(this.address, this.networkCurrencyHex);
        return this.mosaicBalances.filtered('accountMosaicId = $0', lookupID)[0];
    }

    // $FlowFixMe
    get currencyBalance() {
        const { networkCurrency } = this;

        // TODO: delegate this to container or repository than calculating it
        const divisibility = networkCurrency && networkCurrency.mosaic ? 10 ** networkCurrency.mosaic.divisibility : 1;
        return networkCurrency ? networkCurrency.balance / divisibility : 0;
    }

    // $FlowFixMe
    get currencyDivisibility() {
        const { networkCurrency } = this;

        return networkCurrency && networkCurrency.mosaic ? networkCurrency.mosaic.divisibility : 2;
    }
}

Account.schema = {
    name: 'Account',
    primaryKey: 'address',
    properties: {
        label: 'string',
        bipIndex: 'int',
        bipDerivationPath: 'string',
        address: 'string',
        hidden: { type: 'bool', default: false },
        networkType: 'int',
        networkCurrencyHex: 'string',
        linkedAccount: 'bool',
        linkedAccountPrivateKey: 'string',
        delegationStatus: 'bool',
        mosaicBalances: 'AccountMosaicBalance[]',
        transactions: 'Transaction[]',
        multisigInfo: 'MultisigAccountInfo?',
        publicKey: 'string',
        importance: 'int',
        importanceHeight: 'int',
        order: 'int',
    },
};

const createAccount = async (
    realmInstance: any,
    label: string,
    bipIndex: number,
    bipDerivationPath: string,
    address: string,
    networkType: number,
    networkCurrency: string,
    publicKey: string
) => {
    return from(
        realmInstance.then(realm => {
            try {
                const accountLength = realm.objects('Account').filtered(`networkType == ${networkType}`).length;
                realm.write(() => {
                    realm.create('Account', {
                        label: label,
                        bipIndex: bipIndex,
                        bipDerivationPath: bipDerivationPath,
                        address: address,
                        networkType: networkType,
                        networkCurrencyHex: networkCurrency,
                        mosaicBalances: [],
                        transactions: [],
                        publicKey: publicKey,
                        linkedAccount: false,
                        delegationStatus: false,
                        linkedAccountPrivateKey: '',
                        importance: 0,
                        importanceHeight: 0,
                        order: accountLength + 1,
                    });
                });
                return { isAccountCreated: true };
            } catch (err) {
                throw err;
            }
        })
    );
};

const getLocalAccounts = (realmInstance: any): Observable<Account[]> => {
    return from(
        realmInstance.then(realm => {
            try {
                return realm.objects('Account');
            } catch (err) {
                throw err;
            }
        })
    );
};

const getLocalAccountByAddress = (realmInstance: any, plainAddress: string): Observable<Account[]> => {
    return from(
        realmInstance.then(realm => {
            try {
                return realm.objectForPrimaryKey('Account', plainAddress);
            } catch (err) {
                throw err;
            }
        })
    );
};

const getLocalAccountByNetwork = (realmInstance: any, type: number): Observable<Account[]> => {
    return from(
        realmInstance.then(realm => {
            try {
                return realm
                    .objects('Account')
                    .filtered(`networkType == ${type}`)
                    .sorted('order');
            } catch (err) {
                throw err;
            }
        })
    );
};

const updateLocalAccounts = (realmInstance: any, accounts: Array<AccountInfo>) => {
    return from(
        realmInstance.then(realm => {
            realm.write(() => {
                try {
                    accounts.forEach(account => {
                        const tempAccount: Account = realm.objectForPrimaryKey('Account', account.address.plain());
                        tempAccount.networkType = account.address.networkType;
                        tempAccount.multisigInfo = account.multisigInfo;
                        tempAccount.linkedAccount = account.accountType === (AccountType.Main || AccountType.Remote);
                        tempAccount.mosaicBalances = asMosaicBalances(account);
                        tempAccount.importance = account.importance.compact();
                        tempAccount.importanceHeight = account.importanceHeight.compact();
                    });
                } catch (err) {
                    throw err;
                }
            });

            return true;
        })
    );
};

const updateAllAccountsIndices = (realmInstance: any, accounts: Array<Account>) => {
    return from(
        realmInstance.then(realm => {
            const updatedAddresses = [];
            realm.write(() => {
                try {
                    accounts.forEach((account, index) => {
                        const tempAccount: Account = realm.objectForPrimaryKey('Account', account.address);
                        tempAccount.order = index;
                        updatedAddresses.push(account.address);
                    });
                } catch (err) {
                    throw err;
                }
            });
            const updatedAccounts = realm.objects('Account').sorted('order');
            return updatedAccounts;
        })
    );
};

const updateAccountName = (realmInstance: any, label: string, address: string) => {
    return from(
        realmInstance.then(realm => {
            try {
                realm.write(() => {
                    realm.create(
                        'Account',
                        {
                            label: label,
                            address: address,
                        },
                        true
                    );
                });
                return { isAccountUpdated: true };
            } catch (err) {
                throw err;
            }
        })
    );
};

// TODO: update to a generalised method
const updateAccountStatus = (realmInstance: any, status: boolean, address: string) => {
    return from(
        realmInstance.then(realm => {
            try {
                realm.write(() => {
                    realm.create(
                        'Account',
                        {
                            hidden: status,
                            address: address,
                        },
                        true
                    );
                });
                return { isAccountUpdated: true };
            } catch (err) {
                throw err;
            }
        })
    );
};

const updateAccount = (realmInstance: any, updateField: string, value: any, address: string) => {
    return from(
        realmInstance.then(realm => {
            try {
                realm.write(() => {
                    realm.create(
                        'Account',
                        {
                            [updateField]: value,
                            address: address,
                        },
                        true
                    );
                });
                return { isAccountUpdated: true };
            } catch (err) {
                throw err;
            }
        })
    );
};

const asMosaicBalances = (account: AccountInfo) => {
    return account.mosaics.map((mosaic: Mosaic) => {
        const accountMosaicId = AccountMosaicBalance.CreateAccountMosaicID(account.address.plain(), mosaic.id.toHex());

        return {
            accountMosaicId: accountMosaicId,
            mosaic: { hexId: mosaic.id.toHex() },
            amountLower: mosaic.amount.lower,
            amountHigher: mosaic.amount.higher,
        };
    });
};

export {
    createAccount,
    getLocalAccounts,
    getLocalAccountByAddress,
    updateLocalAccounts,
    updateAccountName,
    updateAccountStatus,
    getLocalAccountByNetwork,
    updateAccount,
    updateAllAccountsIndices,
};

export default Account;
