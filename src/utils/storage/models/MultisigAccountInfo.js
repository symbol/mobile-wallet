/**
 * @format
 * @flow
 */

import Realm from 'realm';

class MultisigAccountInfo extends Realm.Object {}

MultisigAccountInfo.schema = {
  name: 'MultisigAccountInfo',
  properties: {
    account: 'PublicAccount',
    minApproval: { type: 'int', default: 0 },
    minRemoval: { type: 'int', default: 0 },
    cosignatories: 'PublicAccount[]',
    multisigAccounts: 'PublicAccount[]',
  },
};

export default MultisigAccountInfo;
