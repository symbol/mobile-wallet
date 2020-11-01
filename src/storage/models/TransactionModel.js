export type TransactionType = 'transfer' | 'mosaicTransfer';
export type TransactionStatus = 'confirmed' | 'unconfirmed';

/**
 * Wallet transaction
 */
export interface TransactionModel {
    type: TransactionType;
    status: TransactionStatus;
    signerAddress: string;
    deadline: string;
    hash: string;
    fee: number;
}

/**
 * Transfer transaction model
 */
export interface TransferTransactionModel extends TransactionModel {
    type: 'transfer';
    recipientAddress: string;
    messageText: string;
    messageEncrypted: boolean;
    amount: number;
}

/**
 * Mosaic Transfer transaction model
 */
export interface MosaicTransferTransactionModel extends TransactionModel {
    type: 'mosaicTransfer';
    signerAddress: string;
    recipientAddress: string;
    message: {
        text: string,
        encrypted: boolean,
    };
    amount: number;
    fee: number;
}
