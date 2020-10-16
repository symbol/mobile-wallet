/**
 * @format
 * @flow
 */
import Realm from 'realm';
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';
import Observable, { from } from 'rxjs';
import AsyncCache from './AsyncCache';

import Wallet, * as WalletModel from './models/Wallet';
import Account, * as AccountModel from './models/Account';
import Mosaic, * as MosaicModel from './models/Mosaic';
import Network, * as NetworkModel from './models/Network';
import MosaicAlias from './models/MosaicAlias';
import AccountMosaicBalance from './models/AccountMosaicBalance';
import Transaction from './models/Transaction';
import TransactionMosaic from './models/TransactionMosaic';
import MultisigAccountInfo from './models/MultisigAccountInfo';
import PublicAccount from './models/PublicAccount';
import Address from './models/Address';
import Block from './models/Block';
import AddressBook, * as AddressBookModel from './models/AddressBook';

import type { NetworkInfo } from './models/Network';

const secureSaveAsync = async (key: string, value: string) => {
  return RNSecureStorage.set(key, value, {
    accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY, // iOS only
  });
};

const secureRetrieveAsync = async (key: string) => {
  return RNSecureStorage.get(key);
};

const secureRetrieveObservable = (key: string): Observable<string> => {
  return from(RNSecureStorage.get(key));
};

const saveAsync = async (data: Object = {}) => {
  const metadataArray = Object.entries(data).map(([key, value]) => [key, value]);
  return AsyncCache.multiSet(metadataArray);
};

/**
 * Define's a realm instance with all schemas
 *
 */
const realmInstance = Realm.open({
  schema: [
    Wallet,
    Mosaic,
    MosaicAlias,
    Block,
    Transaction,
    TransactionMosaic,
    Account,
    AccountMosaicBalance,
    Network,
    MultisigAccountInfo,
    PublicAccount,
    Address,
    AddressBook,
  ],
  schemaVersion: 4, // add a version number
  migration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 2) {
      const oldWalletObjects = oldRealm.objects('Wallet');
      const newWalletObjects = newRealm.objects('Wallet');
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < oldWalletObjects.length; index++) {
        newWalletObjects[index].securityMode = 'none';
        newWalletObjects[index].notification = '15 MIN';
      }

      // Migrate Account store
      const oldAccountObjects = oldRealm.objects('Account');
      const newAccountObjects = newRealm.objects('Account');
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < oldAccountObjects.length; index++) {
        newAccountObjects[index].importance = 0;
        newAccountObjects[index].importanceHeight = 0;
        newAccountObjects[index].order = 0;
      }
    }
  },
});

/**
 * Account modal methods with realm instance
 *
 */
const createAccount = (...params: Array<any>) =>
  AccountModel.createAccount(realmInstance, ...params);
const getLocalAccounts = (...params: Array<any>) =>
  AccountModel.getLocalAccounts(realmInstance, ...params);
const getLocalAccountByAddress = (...params: Array<any>) =>
  AccountModel.getLocalAccountByAddress(realmInstance, ...params);
const updateLocalAccounts = (...params: Array<any>) =>
  AccountModel.updateLocalAccounts(realmInstance, ...params);
const updateAccountName = (...params: Array<any>) =>
  AccountModel.updateAccountName(realmInstance, ...params);
const updateAccountStatus = (...params: Array<any>) =>
  AccountModel.updateAccountStatus(realmInstance, ...params);
const getLocalAccountByNetwork = (...params: Array<any>) =>
  AccountModel.getLocalAccountByNetwork(realmInstance, ...params);
const updateAccount = (...params: Array<any>) =>
  AccountModel.updateAccount(realmInstance, ...params);
const updateAllAccountsIndices = (...params: Array<any>) =>
  AccountModel.updateAllAccountsIndices(realmInstance, ...params);

/**
 * Mosaic modal methods with realm instance
 *
 */
const getLocalMosaics = (...params: Array<any>) =>
  MosaicModel.getLocalMosaics(realmInstance, ...params);
const updateMosaicInfo = (...params: Array<any>) =>
  MosaicModel.updateMosaicInfo(realmInstance, ...params);

/**
 * Network modal methods with realm instance
 *
 */
const addNetwork = (...params: Array<any>) => NetworkModel.addNetwork(realmInstance, ...params);
const getNetworks = (...params: Array<any>) => NetworkModel.getNetworks(realmInstance, ...params);
const getNetworkByKey = (...params: Array<any>) =>
  NetworkModel.getNetworkByKey(realmInstance, ...params);
const getNetworkByNodeURL = (...params: Array<any>) =>
  NetworkModel.getNetworkByNodeURL(realmInstance, ...params);

/**
 * Wallet modal methods with realm instance
 *
 */
const createWallet = (...params: Array<any>) => WalletModel.createWallet(realmInstance, ...params);
const getWalletByNetwork = (...params: Array<any>) =>
  WalletModel.getWalletByNetwork(realmInstance, ...params);
const getWallets = (...params: Array<any>) => WalletModel.getWallets(realmInstance, ...params);
const updateWalletBipIndex = (...params: Array<any>) =>
  WalletModel.updateWalletBipIndex(realmInstance, ...params);
const updateMnemonicBackupStatus = (...params: Array<any>) =>
  WalletModel.updateMnemonicBackupStatus(realmInstance, ...params);
const updateWallet = (...params: Array<any>) => WalletModel.updateWallet(realmInstance, ...params);

/**
 * AddressBook model methods with realm instance
 */
const addToAddressBook = (...params: Array<any>) =>
  AddressBookModel.addToAddressBook(realmInstance, ...params);
const getFromAddressBook = (...params: Array<any>) =>
  AddressBookModel.getFromAddressBook(realmInstance, ...params);
const getAliasFromAddressBook = (...params: Array<any>) =>
  AddressBookModel.getAliasFromAddressBook(realmInstance, ...params);

/**
 * Exports all modal methods
 *
 */
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
  createWallet,
  getWalletByNetwork,
  getWallets,
  updateWalletBipIndex,
  updateMnemonicBackupStatus,
  updateWallet,
  getLocalMosaics,
  updateMosaicInfo,
  addNetwork,
  getNetworks,
  getNetworkByNodeURL,
  getNetworkByKey,
  addToAddressBook,
  getFromAddressBook,
  getAliasFromAddressBook,
};

/**
 * Exports utility methods
 *
 */
export { secureSaveAsync, saveAsync, secureRetrieveAsync, secureRetrieveObservable };
