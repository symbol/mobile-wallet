/**
 * Account Origin Type
 */
export type AccountOriginType = 'hd' | 'privateKey';

/**
 * Network type
 */
export type AppNetwork = 'testnet' | 'mainnet';

/**
 * Account model
 */
export interface AccountModel {
    id: number;
    name: string;
    type: AccountOriginType;
    privateKey: string;
}
