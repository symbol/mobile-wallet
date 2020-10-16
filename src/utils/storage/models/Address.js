/**
 * @format
 * @flow
 */
import Realm from 'realm';

class Address extends Realm.Object {}
Address.schema = {
  name: 'Address',
  properties: {
    address: { type: 'string', default: '', optional: true },
    networkType: { type: 'int', default: 0, optional: true },
  },
};

export default Address;
