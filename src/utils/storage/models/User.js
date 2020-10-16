/**
 * @format
 * @flow
 */
import Realm from 'realm';

class User extends Realm.Object {}

User.schema = {
  name: 'User',
  properties: {
    wallet: 'Wallet',
    mnemonicExported: { type: 'bool', default: false },
  },
};

export default User;
