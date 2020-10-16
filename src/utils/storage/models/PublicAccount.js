/**
 * @format
 * @flow
 */
import Realm from 'realm';

class PublicAccount extends Realm.Object {}

PublicAccount.schema = {
  name: 'PublicAccount',
  properties: {
    publicKey: { type: 'string', default: '', optional: true },
    address: 'Address',
  },
};

export default PublicAccount;
