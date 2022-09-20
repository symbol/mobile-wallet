import { network } from './network';
import { Account } from 'symbol-sdk';

export const account1 = Account.createFromPrivateKey(
    '1111111111111111111111111111111111111111111111111111111111111111',
    network.networkType
);

export const account2 = Account.createFromPrivateKey(
    '0000000000000000000000000000000000000000000000000000000000000000',
    network.networkType
);

export const account3 = Account.createFromPrivateKey(
    '0000000000000000000000000000000000000000000000000000000000000003',
    network.networkType
);

export const account4 = Account.createFromPrivateKey(
    '0000000000000000000000000000000000000000000000000000000000000004',
    network.networkType
);
