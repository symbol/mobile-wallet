/**
 * @format
 * @flow
 */
import Realm from 'realm';
import Observable, { from } from 'rxjs';
import { getDefaultSyncInterval } from '../../../config/environment';

class Wallet extends Realm.Object {}

Wallet.schema = {
    name: 'Wallet',
    primaryKey: 'networkType',
    properties: {
        name: 'string',
        isMnemonicExported: 'bool',
        lastBipIndex: { type: 'int', optional: true },
        networkType: 'int',
        networkCurrency: 'string',
        accounts: 'Account[]',
        language: 'string',
        nodeURL: 'string',
        currency: 'string',
        notification: 'string',
        securityMode: 'string',
    },
};

const createWallet = (
    realmInstance: any,
    name: string,
    isMnemonicExported: boolean,
    nodeURL: string,
    lastBipIndex: ?number,
    networkType: number,
    networkCurrency: string
): Observable => {
    const defaultSyncInterval = getDefaultSyncInterval();
    return from(
        realmInstance.then(realm => {
            try {
                realm.write(() => {
                    realm.create(
                        'Wallet',
                        {
                            name: name,
                            isMnemonicExported: isMnemonicExported,
                            lastBipIndex: lastBipIndex,
                            networkType: networkType,
                            networkCurrency: networkCurrency,
                            language: '',
                            nodeURL: nodeURL,
                            currency: '',
                            notification: defaultSyncInterval, // default to 15 min
                            securityMode: 'none',
                        },
                        true
                    );
                });
                return { isWalletCreated: true };
            } catch (err) {
                throw err;
            }
        })
    );
};

const getWallets = (realmInstance: any): Observable<Wallet[]> => {
    return from(
        realmInstance.then(realm => {
            try {
                return realm.objects('Wallet');
            } catch (err) {
                throw err;
            }
        })
    );
};

const getWalletByNetwork = (
    realmInstance: any,
    type: number
): Observable<Wallet[]> => {
    return from(
        realmInstance.then(realm => {
            try {
                return realm
                    .objects('Wallet')
                    .filtered(`networkType == ${type}`);
            } catch (err) {
                throw err;
            }
        })
    );
};

const updateWalletBipIndex = (
    realmInstance: any,
    type: number,
    index: number
) => {
    return from(
        realmInstance.then(realm => {
            try {
                realm.write(() => {
                    realm.create(
                        'Wallet',
                        {
                            lastBipIndex: index,
                            networkType: type,
                        },
                        true
                    );
                });
                return { isWalletUpdated: true };
            } catch (err) {
                throw err;
            }
        })
    );
};

const updateMnemonicBackupStatus = (
    realmInstance: any,
    type: number,
    isMnemonicExported: boolean
) => {
    return from(
        realmInstance.then(realm => {
            try {
                realm.write(() => {
                    realm.create(
                        'Wallet',
                        {
                            isMnemonicExported: isMnemonicExported,
                            networkType: type,
                        },
                        true
                    );
                });
                return { isWalletUpdated: true };
            } catch (err) {
                throw err;
            }
        })
    );
};

const updateWallet = (
    realmInstance: any,
    updateField: string,
    value: any,
    type: string
) => {
    return from(
        realmInstance.then(realm => {
            try {
                realm.write(() => {
                    realm.create(
                        'Wallet',
                        {
                            [updateField]: value,
                            networkType: type,
                        },
                        true
                    );
                });
                return { isWalletUpdated: true };
            } catch (err) {
                throw err;
            }
        })
    );
};

export {
    createWallet,
    getWallets,
    getWalletByNetwork,
    updateWalletBipIndex,
    updateMnemonicBackupStatus,
    updateWallet,
};

export default Wallet;
