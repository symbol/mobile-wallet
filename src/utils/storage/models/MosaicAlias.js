/**
 * @format
 * @flow
 */
import Realm from 'realm';

class MosaicAlias extends Realm.Object {}

MosaicAlias.schema = {
    name: 'MosaicAlias',
    primaryKey: 'name',
    properties: {
        name: { type: 'string', optional: true },
        parentId: { type: 'string', optional: true },
        namespaceHex: { type: 'string', optional: true },
    },
};

export default MosaicAlias;
