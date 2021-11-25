/**
 * @format
 * @flow
 */
import Realm from 'realm';
import Observable, { from } from 'rxjs';

class Mosaic extends Realm.Object {
    get label() {
        const firstNamespace = this.namespaces[0];
        return firstNamespace ? firstNamespace.name : null;
    }

    get namespaceHex() {
        const firstNamespace = this.namespaces[0];
        return firstNamespace ? firstNamespace.namespaceHex : null;
    }
}

Mosaic.schema = {
    name: 'Mosaic',
    primaryKey: 'hexId',
    properties: {
        hexId: 'string',
        namespaces: 'MosaicAlias[]',
        divisibility: { type: 'int', optional: true },
    },
};

type MosaicNameSpace = {
    name: string,
    parentId: string,
    namespaceHex: string,
};

const getLocalMosaics = (realmInstance: any): Observable<any> => {
    return from(
        realmInstance.then(realm => {
            try {
                return realm.objects('Mosaic');
            } catch (err) {
                throw err;
            }
        })
    );
};

const updateMosaicInfo = (
    realmInstance: any,
    hexId: string,
    divisbility: number,
    aliases: Array<MosaicNameSpace> = []
): Observable<boolean> => {
    return from(
        realmInstance.then(realm => {
            realm.write(() => {
                try {
                    let mosaic = realm.objectForPrimaryKey('Mosaic', hexId);
                    if (mosaic === undefined || mosaic === null) {
                        console.log(
                            `Unknown mosaic [${hexId}], adding entry...`
                        );
                        mosaic = realm.create('Mosaic', { hexId: hexId });
                    }

                    mosaic.divisibility = divisbility;
                    mosaic.namespaces = aliases;
                } catch (err) {
                    throw err;
                }
            });

            return true;
        })
    );
};

export { getLocalMosaics, updateMosaicInfo };
export default Mosaic;
