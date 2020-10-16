/**
 * @format
 * @flow
 */
import Realm from 'realm';
import Observable, { from } from 'rxjs';

type NetworkInfo = {
  name: string,
  networkType: number, // same as networkType
  nodeURL: string,
  generationHash: string,
  networkCurrencyHex: string,
  nodeType: string,
};

class Network extends Realm.Object {}

Network.schema = {
  name: 'Network',
  primaryKey: 'nodeURL',
  properties: {
    name: 'string',
    networkID: 'int',
    nodeURL: 'string',
    generationHash: 'string',
    networkCurrency: 'string',
    nodeType: 'string',
  },
};

const PublicAttributes = {
  name: 'name',
  networkID: 'networkID',
  nodeURL: 'nodeURL',
  generationHash: 'generationHash',
  networkCurrency: 'networkCurrency',
  nodeType: 'nodeType',
};

const getNetworks = (realmInstance: any): Observable<Network[]> => {
  return from(
    realmInstance.then(realm => {
      try {
        return realm.objects('Network');
      } catch (err) {
        throw err;
      }
    })
  );
};

const addNetwork = (
  realmInstance: any,
  name: string,
  networkID: number,
  nodeURL: number,
  generationHash: string,
  networkCurrency: string,
  nodeType: ?string
): Observable => {
  return from(
    realmInstance.then(realm => {
      try {
        realm.write(() => {
          realm.create(
            'Network',
            {
              name: name,
              networkID: networkID,
              nodeURL: nodeURL,
              generationHash: generationHash,
              networkCurrency: networkCurrency,
              bip32Path: '0',
              nodeType: nodeType || 'custom', // TODO: This should be a constant
            },
            true
          );
        });
        return { isNetworkUpdated: true };
      } catch (err) {
        throw err;
      }
    })
  );
};

const getNetworkByNodeURL = (realmInstance: any, nodeURL: string): Observable<NetworkInfo> => {
  return from(
    realmInstance.then(realm => {
      try {
        return realm.objectForPrimaryKey('Network', nodeURL);
      } catch (err) {
        throw err;
      }
    })
  );
};

const getNetworkByKey = (realmInstance: any, key: string, value: any): Observable<Network> => {
  return from(
    realmInstance.then(realm => {
      try {
        return realm.objects('Network').filtered(`${key} = '${value}'`);
      } catch (err) {
        throw err;
      }
    })
  );
};

export type { NetworkInfo };
export { addNetwork, getNetworks, getNetworkByKey, getNetworkByNodeURL };

export default Network;
