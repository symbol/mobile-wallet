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
    privateKey: string;
}
