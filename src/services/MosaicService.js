import { Mosaic, MosaicHttp, MosaicInfo, NamespaceHttp } from 'symbol-sdk';
import type { NetworkModel } from '@src/storage/models/NetworkModel';
import type { MosaicModel } from '@src/storage/models/MosaicModel';
import { durationToRelativeTime } from '@src/utils/format';

export default class MosaicService {
    /**
     * Gets MosaicModel from a Mosaic
     * @param mosaic
     * @param network
     * @return {Promise<{amount: string, mosaicId: string, mosaicName: *, divisibility: *}>}
     */
    static async getMosaicModelFromMosaicId(mosaic: Mosaic, network: NetworkModel): Promise<MosaicModel> {
        let mosaicInfo = {},
            mosaicName = {};
        try {
            mosaicInfo = await new MosaicHttp(network.node).getMosaic(mosaic.id).toPromise();
            [mosaicName] = await new NamespaceHttp(network.node).getMosaicsNames([mosaic.id]).toPromise();
        } catch (e) {
            console.log(e);
        }
        return {
            mosaicId: mosaic.id.toHex(),
            mosaicName: mosaicName && mosaicName.names && mosaicName.names.length > 0 ? mosaicName.names[0].name : mosaic.id.toHex(),
            amount: mosaic.amount.toString(),
            divisibility: mosaicInfo.divisibility,
            expired: this._checkExpirationDate(mosaicInfo, network),
        };
    }

    /**
     * Checks expiration date of a mosaic
     * @param mosaicInfo
     * @param network
     * @returns {string|boolean}
     * @private
     */
    static _checkExpirationDate(mosaicInfo: MosaicInfo, network: NetworkModel) {
        const duration = mosaicInfo.duration.compact();
        const startHeight = mosaicInfo.startHeight.compact();

        // unlimited duration mosaics are flagged as duration == 0
        if (duration === 0) {
            return false;
        }

        // get current height
        // calculate expiration
        const expiresIn = startHeight + duration - (network.chainHeight || 0);
        if (expiresIn <= 0) {
            return true;
        }
        return false;
        // number of blocks remaining
        return durationToRelativeTime(expiresIn, network.blockGenerationTargetTime);
    }
}
