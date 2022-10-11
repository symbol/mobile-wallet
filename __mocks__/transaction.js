import { AggregateTransaction, Deadline, NetworkType, PlainMessage, TransferTransaction, UInt64 } from 'symbol-sdk';
import { account1, account2 } from './account';

const confirmedHeight = 1234;
const epochAdjustment = 1637848847;
const deadline = Deadline.create(epochAdjustment);
const defaultNetworkType = NetworkType.TEST_NET;
const defaultSigner = account1;
const defaultRecipientAddress = account2.address;

const generateString = () => [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

export const createTransferTransaction = options => {
    const { signer, recipientAddress, messageText, networkType, mosaics, isConfirmed, hash } = options;

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

export const createAggregateBondedTransaction = options => {
    const { signer, innerTransactions, networkType, cosignatures, isConfirmed, hash } = options;

    const maxFee = UInt64.fromUint();
    const height = UInt64.fromUint(isConfirmed ? confirmedHeight : 0);
    const hashString = hash || generateString();
    const signature = '';

    const transaction = AggregateTransaction.createBonded(
        deadline,
        innerTransactions || [],
        networkType || defaultNetworkType,
        cosignatures || [],
        maxFee,
        signature,
        signer
    );

    transaction.transactionInfo = {
        id: hashString,
        hash: hashString,
        height,
    };

    return transaction;
};
