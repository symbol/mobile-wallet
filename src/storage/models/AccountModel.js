/**
 * Account Origin Type
 */
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
    isPersistentDelReqSent: boolean;
    harvestingNode: string;
}
