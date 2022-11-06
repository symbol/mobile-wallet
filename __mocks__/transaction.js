import { Deadline, NetworkType, PlainMessage, TransferTransaction, UInt64 } from 'symbol-sdk';
import { account1, account2 } from './account';

const confirmedHeight = 1234;
const epochAdjustment = 1637848847;
const defaultNetworkType = NetworkType.TEST_NET;
const defaultSigner = account1;
const defaultRecipientAddress = account2.address;

const generateString = () => (Math.random() + 1).toString(36).substring(2);

export const createTransferTransaction = options => {
    const { signer, recipientAddress, messageText, networkType, mosaics, isConfirmed, hash } = options;
    const deadline = Deadline.create(epochAdjustment);
    const message = PlainMessage.create(messageText || '');
    const maxFee = UInt64.fromUint();
    const height = UInt64.fromUint(isConfirmed ? confirmedHeight : 0);
    const hashString = hash || generateString();

    const transaction = TransferTransaction.create(
        deadline,
        recipientAddress || defaultRecipientAddress,
        mosaics || [],
        message,
        networkType || defaultNetworkType,
        maxFee,
        '',
        signer || defaultSigner
    );

    transaction.transactionInfo = {
        id: hashString,
        hash: hashString,
        height,
    };

    return transaction;
};
