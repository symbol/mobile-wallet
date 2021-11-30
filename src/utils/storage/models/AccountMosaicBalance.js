/**
 * @format
 * @flow
 */

import Realm from 'realm';
import { UInt64 } from 'symbol-sdk';

class AccountMosaicBalance extends Realm.Object {
    static CreateAccountMosaicID = (address: string, mosaicId: string) => {
        return `${address}-${mosaicId}`.toLowerCase();
    };

    // $FlowFixMe
    get balance() {
        const uint64 = new UInt64([this.amountLower, this.amountHigher]);
        return uint64.compact();
    }

    get currencyCode() {
        return (this.mosaic.namespaces.length > 0 && this.mosaic.namespaces[0].name.split('.').pop()) || '';
    }
}

AccountMosaicBalance.schema = {
    name: 'AccountMosaicBalance',
    primaryKey: 'accountMosaicId',
    properties: {
        accountMosaicId: 'string',
        mosaic: 'Mosaic',
        amountLower: 'double',
        amountHigher: 'double',
    },
};

export default AccountMosaicBalance;
