/**
 * @format
 * @flow
 */

import Realm from 'realm';
import { UInt64 } from 'symbol-sdk';

class TransactionMosaic extends Realm.Object {
    static CreateTransactionMosaicID = (
        transactionId: string,
        mosaicId: string
    ) => {
        return `${transactionId}-${mosaicId}`.toLowerCase();
    };

    // $FlowFixMe
    get balance() {
        const uint64 = new UInt64([this.amountLower, this.amountHigher]);
        return uint64.compact();
    }
}

TransactionMosaic.schema = {
    name: 'TransactionMosaic',
    primaryKey: 'transactionMosaicId',
    properties: {
        transactionMosaicId: 'string',
        mosaic: 'Mosaic',
        amountLower: 'double',
        amountHigher: 'double',
    },
};

export default TransactionMosaic;
