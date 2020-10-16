/**
 * @format
 * @flow
 */
import Realm from 'realm';

class Transaction extends Realm.Object {}

Transaction.schema = {
  name: 'Transaction',
  primaryKey: 'id',
  properties: {
    id: 'string',
    type: 'int',
    hash: 'string',
    fee: 'string',
    message: 'string',
    messageType: 'int',
    senderAddress: 'string',
    senderPublic: 'string',
    recepientAddress: 'string',
    block: 'Block',
    mosaics: 'TransactionMosaic[]',
  },
};

export default Transaction;
