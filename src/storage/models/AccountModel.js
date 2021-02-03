/**
 * Account Origin Type
 */
import type {AppNetworkType} from "@src/storage/models/NetworkModel";

export type AccountOriginType = 'hd' | 'privateKey';

/**
 * Account model
 */
export interface AccountModel {
    id: number;
    name: string;
    type: AccountOriginType;
    path?: string;
    privateKey: string;
    network: AppNetworkType;
    isPersistentDelReqSent: boolean;
    harvestingNode: string;
}
