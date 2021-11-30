/**
 * @format
 * @flow
 */
import Relam from 'realm';
import Observable, { from } from 'rxjs';

class AddressBook extends Relam.Object {}

AddressBook.schema = {
    name: 'AddressBook',
    primaryKey: 'address',
    properties: {
        address: 'string',
        name: 'string',
        networkType: 'int',
    },
};

const getFromAddressBook = (realmInstance: any, name: string, networkType: number): Observable<AddressBook[]> => {
    return from(
        realmInstance.then(relam => {
            try {
                return relam
                    .objects('AddressBook')
                    .filtered(`networkType = ${networkType} AND address CONTAINS[c] $0 OR name CONTAINS[c]  $0`, name);
            } catch (error) {
                throw error;
            }
        })
    );
};

const getAliasFromAddressBook = (realmInstance: any, address: string): Observable<AddressBook> => {
    return from(
        realmInstance.then(relam => {
            try {
                return relam.objects('AddressBook').filtered('address CONTAINS[c] $0', address);
            } catch (error) {
                throw error;
            }
        })
    );
};

const addToAddressBook = (realmInstance: any, name: string, address: string, networkType: number): Observable => {
    return from(
        realmInstance.then(relam => {
            try {
                relam.write(() => {
                    relam.create(
                        'AddressBook',
                        {
                            name: name,
                            address: address,
                            networkType: networkType,
                        },
                        true
                    );
                });
            } catch (error) {
                throw error;
            }
        })
    );
};

export { addToAddressBook, getFromAddressBook, getAliasFromAddressBook };

export default AddressBook;
