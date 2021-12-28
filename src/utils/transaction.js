import _ from 'lodash';
import { TransactionType } from 'symbol-sdk';
import { getFinanceBotPublicKeys } from '@src/config/environment';
import { getPublicKeyFromPrivateKey } from '@src/utils/account';
import { filterCurrencyMosaic } from '@src/utils/filter';
import { getMosaicRelativeAmount } from '@src/utils/format';
import { TransactionInfoPreviewValueType } from '@src/storage/models/TransactionInfoPreviewModel';

export const transactionAwaitingSignatureByAccount = (transaction, account, multisigAddresses) => {
    if (transaction.transactionType === TransactionType.AGGREGATE_BONDED) {
        const accountPublicKey = getPublicKeyFromPrivateKey(account.privateKey);
        const transactionSignerAddresses = transaction.innerTransactions.map(innerTransaction => innerTransaction.signerAddress);
        const cosignRequired = transactionSignerAddresses.some(
            transactionSignerAddress => transactionSignerAddress && multisigAddresses?.some(address => address === transactionSignerAddress)
        );
        const transactionHasMissingSignatures = transaction.transactionInfo?.merkleComponentHash.startsWith('000000000000');
        const signedByCurrentAccount = transaction.cosignaturePublicKeys.some(publicKey => publicKey === accountPublicKey);

        return (!signedByCurrentAccount && transaction.status !== 'confirmed') || (transactionHasMissingSignatures && cosignRequired);
    }

    return false;
};

export const isPostLaunchOptInTransaction = (transaction, network) => {
    if (TransactionType.AGGREGATE_BONDED) {
        return getFinanceBotPublicKeys(network.type).some(publicKey => publicKey === transaction.signTransactionObject?.signer?.publicKey);
    }

    return false;
};

export const isOutgoingTransaction = (transaction, address) => {
    return transaction.signerAddress === address;
};

export const getAggregateTransactionInfoPreview = (transaction, account, isMultisigAccount, multisigAddresses) => {
    if (
        transaction.transactionType !== TransactionType.AGGREGATE_BONDED &&
        transaction.transactionType !== TransactionType.AGGREGATE_COMPLETE
    ) {
        throw Error(
            `Failed to getNamespaceTransactionInfoPreview. Expected transaction type "${TransactionType.AGGREGATE_BONDED}" or "${TransactionType.AGGREGATE_COMPLETE}" but got "${transaction.transactionType}"`
        );
    }

    if (!isMultisigAccount && transactionAwaitingSignatureByAccount(transaction, account, multisigAddresses)) {
        return [
            {
                type: TransactionInfoPreviewValueType.AggregatePendingSignature,
            },
        ];
    } else {
        return [
            {
                type: TransactionInfoPreviewValueType.AggregateInner,
                value: {
                    txCount: transaction.innerTransactions.length,
                    txIcons: _.uniq(
                        transaction.innerTransactions.map(innerTransaction => 'transaction_' + innerTransaction.transactionType)
                    ).slice(0, 5),
                },
            },
        ];
    }
};

export const getTransferTransactionInfoPreview = (transaction, address, network) => {
    if (transaction.transactionType !== TransactionType.TRANSFER) {
        throw Error(
            `Failed to getTransferTransactionInfoPreview. Expected transaction type "${TransactionType.TRANSFER}" but got "${transaction.transactionType}"`
        );
    }

    const infoPreview = [];
    const outgoingTransaction = isOutgoingTransaction(transaction, address);
    const mosaics = transaction.mosaics;
    const currencyMosaic = filterCurrencyMosaic(mosaics, network);
    const hasCustomMosaic = (currencyMosaic && mosaics.length > 1) || (!currencyMosaic && mosaics.length > 0);
    const hasMessage = !!transaction.messageText;
    let amount = 0;

    if (currencyMosaic) {
        amount = getMosaicRelativeAmount(currencyMosaic);
    }

    if (amount && !outgoingTransaction) {
        infoPreview.push({
            type: TransactionInfoPreviewValueType.AmountIncoming,
            value: amount,
        });
    }
    if (amount && outgoingTransaction) {
        infoPreview.push({
            type: TransactionInfoPreviewValueType.AmountOutgoing,
            value: amount,
        });
    }
    if (hasCustomMosaic) {
        infoPreview.push({
            type: TransactionInfoPreviewValueType.HasCustomMosaic,
        });
    }
    if (hasMessage) {
        infoPreview.push({
            type: TransactionInfoPreviewValueType.HasMessage,
        });
    }

    return infoPreview;
};

export const getNamespaceTransactionInfoPreview = transaction => {
    if (
        transaction.transactionType !== TransactionType.NAMESPACE_REGISTRATION &&
        transaction.transactionType !== TransactionType.ADDRESS_ALIAS &&
        transaction.transactionType !== TransactionType.MOSAIC_ALIAS
    ) {
        throw Error(
            `Failed to getNamespaceTransactionInfoPreview. Expected transaction type "${TransactionType.NAMESPACE_REGISTRATION}" or "${TransactionType.ADDRESS_ALIAS}" or "${TransactionType.MOSAIC_ALIAS}" but got "${transaction.transactionType}"`
        );
    }

    return [
        {
            type: TransactionInfoPreviewValueType.Other,
            value: transaction.namespaceName,
        },
    ];
};

export const getHashLockTransactionInfoPreview = (transaction, network) => {
    if (transaction.transactionType !== TransactionType.HASH_LOCK) {
        throw Error(
            `Failed to getNamespaceTransactionInfoPreview. Expected transaction type "${TransactionType.HASH_LOCK}" but got "${transaction.transactionType}"`
        );
    }

    const currencyMosaic = filterCurrencyMosaic(transaction.mosaics, network);

    return [
        {
            type: TransactionInfoPreviewValueType.Other,
            value: getMosaicRelativeAmount(currencyMosaic),
        },
    ];
};
