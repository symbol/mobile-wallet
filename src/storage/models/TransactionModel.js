export type TransactionType = 'transfer' | 'mosaicTransfer';
export type TransactionStatus = 'confirmed' | 'unconfirmed';

/**
 * Wallet transaction
 */
export interface TransactionModel {
    type: TransactionType;
    status: TransactionStatus;
    deadline: string;
    hash: string;
}

/**
 * Transfer transaction model
 */
export interface TransferTransactionModel extends TransactionModel {
    type: 'transfer';
    signerAddress: string;
    recipientAddress: string;
    messageText: string;
    messageEncrypted: boolean;
    amount: number;
    fee: number;
}

/**
 * Transfer transaction model
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
