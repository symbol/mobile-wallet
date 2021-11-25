import { BaseSecureStorage } from '@src/storage/persistence/BaseSecureStorage';
import { AddressBook } from 'symbol-address-book';

export class AddressBookSecureStorage extends BaseSecureStorage {
    /** ADDRESS_BOOK DB KEY **/
    static CONTACTS_KEY = 'CONTACTS';

    /**
     * Save addressBook
     * @returns AddressBook
     */

    static async saveAddressBook(addressBook: AddressBook) {
        return await this.secureSaveAsync(
            this.CONTACTS_KEY,
            addressBook.toJSON()
        );
    }

    /**
     * Get addressBook
     * @returns AddressBook
     */
    static async retrieveAddressBook(): AddressBook {
        try {
            const addressBook = await this.secureRetrieveAsync(
                this.CONTACTS_KEY
            );
            return AddressBook.fromJSON(addressBook);
        } catch {
            return new AddressBook();
        }
    }

    static clear() {
        return this.removeKey(this.CONTACTS_KEY);
    }
}
