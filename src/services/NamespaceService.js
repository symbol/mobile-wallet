import { 
    Address, 
    NamespaceHttp, 
    NamespaceId,
    MosaicId, 
} from 'symbol-sdk';
import type { NetworkModel } from '@src/storage/models/NetworkModel';

export default class NamespaceService {
    static async resolveAddress(unResolvedAddress: NamespaceId | Address, network: NetworkModel): Promise<string> {
        if (!(unResolvedAddress instanceof NamespaceId)) return unResolvedAddress.address;

		const address = await new NamespaceHttp(network.node)
            .getLinkedAddress(unResolvedAddress)
            .toPromise();

		return address.plain();
    }

    static async resolveMosaicId(unresolvedMosaicId: NamespaceId | MosaicId, network: NetworkModel): Promise<string> {
        if (!(unresolvedMosaicId instanceof NamespaceId)) return unresolvedMosaicId.id;

		const mosaicId = await new NamespaceHttp(network.node)
            .getLinkedMosaicId(unresolvedMosaicId)
            .toPromise();

		return mosaicId.id;
    }
}
