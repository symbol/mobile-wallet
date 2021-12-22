import { TransactionType } from 'symbol-sdk';
import { getPublicKeyFromPrivateKey } from '@src/utils/account';

export const transactionAwaitingSignatureByAccount = (transaction, account, multisigAddresses) => {
    if (transaction.transactionType === TransactionType.AGGREGATE_BONDED) {
        const accountPublicKey = getPublicKeyFromPrivateKey(account.privateKey);
        const transactionSignerAddresses = transaction.innerTransactions.map(innerTransaction => innerTransaction.signerAddress);
        const cosignRequired = !!transactionSignerAddresses.find(
            transactionSignerAddress => transactionSignerAddress && multisigAddresses?.some(address => address === transactionSignerAddress)
        );
        const transactionHasMissingSignatures = transaction?.transactionInfo?.merkleComponentHash.startsWith('000000000000');
        const signedByCurrentAccount = !!transaction.cosignaturePublicKeys.find(publicKey => publicKey === accountPublicKey);

        return (!signedByCurrentAccount && transaction.status !== 'confirmed') || (transactionHasMissingSignatures && cosignRequired);
    }

    return false;
};
