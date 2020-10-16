/**
 * @format
 * @flow
 */
import Realm from 'realm';

class Block extends Realm.Object {}

Block.schema = {
  name: 'Block',
  primaryKey: 'height',
  properties: {
    height: 'string',
    dateTime: 'date',
  },
};

export default Block;
