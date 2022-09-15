import { AccountNames, Address, MosaicId, NamespaceHttp, NamespaceId } from 'symbol-sdk';
import type { NetworkModel } from '@src/storage/models/NetworkModel';

export default class NamespaceService {
    static async resolveAddress(unResolvedAddress: NamespaceId | Address, network: NetworkModel): Promise<string> {
        if (!(unResolvedAddress instanceof NamespaceId)) return unResolvedAddress.plain();

        const address = await new NamespaceHttp(network.node).getLinkedAddress(unResolvedAddress).toPromise();

        return address.plain();
    }

    static async resolveMosaicId(unresolvedMosaicId: NamespaceId | MosaicId, network: NetworkModel): Promise<string> {
        if (!(unresolvedMosaicId instanceof NamespaceId)) return unresolvedMosaicId.id;

        const mosaicId = await new NamespaceHttp(network.node).getLinkedMosaicId(unresolvedMosaicId).toPromise();

        return mosaicId.id;
    }

    static async getMosaicAliasNames(mosaicId: MosaicId, network: NetworkModel): Promise<string[]> {
        const mosaicNames = await new NamespaceHttp(network.node).getMosaicsNames([mosaicId]).toPromise();

        const formattedMosaicNames = mosaicNames.map(mosaicName => ({
            ...mosaicName,
            mosaicId: mosaicName.mosaicId.toHex(),
        }));

        const mosaicInfo = { mosaicId: mosaicId.toHex() };
        const mosaicName = formattedMosaicNames.find(name => name.mosaicId === mosaicInfo.mosaicId);
        const aliasNames = mosaicName.names.map(names => names.name);
        const names = aliasNames.length > 0 ? aliasNames : [];

        return names;
    }

    static getAccountsNames(addresses: Address[], network: NetworkModel): Promise<AccountNames[]> {
        return new NamespaceHttp(network.node).getAccountsNames(addresses).toPromise();
    }
}
