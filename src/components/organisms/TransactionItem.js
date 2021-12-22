import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { Col, Icon, LinkExplorer, Row, TableView, Text, Trunc } from '@src/components';
import GlobalStyles from '@src/styles/GlobalStyles';
import type { TransactionModel } from '@src/storage/models/TransactionModel';
import translate from '@src/locales/i18n';
import { filterCurrencyMosaic } from '@src/utils/filter';
import { getMosaicRelativeAmount } from '@src/utils/format';
import { getPublicKeyFromPrivateKey } from '@src/utils/account';
import { TransactionType } from 'symbol-sdk';
import _ from 'lodash';

const styles = StyleSheet.create({
    root: {
        width: '100%',
    },
    iconContainer: {
        marginRight: 14,
    },
    title: {
        fontSize: 11,
    },
    address: {
        fontSize: 11,
    },
    dateOrStatus: {
        fontSize: 10,
    },
    valueContainer: {
        marginLeft: 5,
    },
    valueAmountOutgoing: {
        color: GlobalStyles.color.RED,
    },
    valueAmountIncoming: {
        color: GlobalStyles.color.GREEN,
    },
    valuePendingSignature: {
        color: GlobalStyles.color.BLUE,
        fontSize: 11,
    },
    valueAggregateInner: {
        borderRadius: 6,
        backgroundColor: GlobalStyles.color.DARKWHITE,
        paddingHorizontal: 6,
    },
    table: {
        marginTop: 14,
    },
});

/*
 * enum ValueType
 **/
const ValueType = {
    AmountIncoming: 'amountIncoming',
    AmountOutgoing: 'amountOutgoing',
    HasMessage: 'hasMessage',
    HasCustomMosaic: 'hasCustomMosaic',
    AggregateInner: 'aggregateInner',
    AggregatePendingSignature: 'AggregatePendingSignature',
    Other: 'other',
};

interface Value {
    type: ValueType;
    value?: string | number;
}

type Props = {
    transaction: TransactionModel,
    showDetails: boolean,
};

function TransactionItem(props: Props) {
    const { transaction, currentAddress, network, showDetails } = props;
    let transactionType = transaction.transactionType;
    let address = transaction.signerAddress;
    let values: Value[] = [];

    if (transactionType === TransactionType.TRANSFER) {
        const incomingTransaction = transaction.recipientAddress === currentAddress;
        const mosaics = transaction.mosaics;
        const nativeMosaic = filterCurrencyMosaic(mosaics, network);
        const hasCustomMosaic = (nativeMosaic && mosaics.length > 1) || (!nativeMosaic && mosaics.length > 0);
        const hasMessage = !!transaction.messageText;

        transactionType = transactionType + (incomingTransaction ? '_incoming' : '_outgoing');
        address = incomingTransaction ? transaction.signerAddress : transaction.recipientAddress;

        if (nativeMosaic && incomingTransaction) {
            values.push({
                type: ValueType.AmountIncoming,
                value: getMosaicRelativeAmount(nativeMosaic),
            });
        }
        if (nativeMosaic && !incomingTransaction) {
            values.push({
                type: ValueType.AmountOutgoing,
                value: getMosaicRelativeAmount(nativeMosaic),
            });
        }
        if (hasCustomMosaic) {
            values.push({
                type: ValueType.HasCustomMosaic,
            });
        }
        if (hasMessage) {
            values.push({
                type: ValueType.HasMessage,
            });
        }
    } else if (transactionType === TransactionType.AGGREGATE_BONDED || transactionType === TransactionType.AGGREGATE_COMPLETE) {
        const { transaction, selectedAccount, isMultisig, cosignatoryOf } = props;
        const accountPublicKey = getPublicKeyFromPrivateKey(selectedAccount.privateKey);
        const cosignerAddresses = transaction.innerTransactions.map(tx => tx.signerAddress);
        const cosignRequired = !!cosignerAddresses.find(
            cosignerAddress => cosignerAddress && cosignatoryOf && cosignatoryOf.some(address => address === cosignerAddress)
        );
        const hasMissingSignatures = transaction?.transactionInfo?.merkleComponentHash.startsWith('000000000000');
        const signedByCurrentAccount = !!transaction.cosignaturePublicKeys.find(publicKey => publicKey === accountPublicKey);
        const needsSignature =
            !isMultisig && ((!signedByCurrentAccount && transaction.status !== 'confirmed') || (hasMissingSignatures && cosignRequired));

        if (needsSignature) {
            values.push({
                type: ValueType.AggregatePendingSignature,
            });
        } else {
            values.push({
                type: ValueType.AggregateInner,
                value: {
                    txCount: transaction.innerTransactions.length,
                    txIcons: _.uniq(
                        transaction.innerTransactions.map(innerTransaction => 'transaction_' + innerTransaction.transactionType)
                    ).slice(0, 5),
                },
            });
        }
    } else if (
        transactionType === TransactionType.NAMESPACE_REGISTRATION ||
        transactionType === TransactionType.ADDRESS_ALIAS ||
        transactionType === TransactionType.MOSAIC_ALIAS
    ) {
        values.push({
            type: ValueType.Other,
            value: transaction.namespaceName,
        });
    } else if (transactionType === TransactionType.HASH_LOCK) {
        const nativeMosaic = filterCurrencyMosaic(transaction.mosaics, network);

        values.push({
            type: ValueType.Other,
            value: getMosaicRelativeAmount(nativeMosaic),
        });
    }

    const iconName = 'transaction_' + transactionType;
    const title = translate('transactionTypes.transactionDescriptor_' + transactionType);
    const dateOrStatus = transaction.status === 'unconfirmed' ? 'Unconfirmed' : transaction.deadline;
    const tableData = _.omit(transaction, ['deadline', 'transactionType', 'type', 'messageEncrypted']);

    return (
        <View style={styles.root}>
            <Row justify="start" fullWidth>
                <Col justify="center" align="center" style={styles.iconContainer}>
                    <Icon size="small" name={iconName} style={styles.icon} />
                </Col>
                <Col grow>
                    <Row justify="space-between">
                        <Text type="regular" theme="light" style={styles.title}>
                            {title}
                        </Text>
                        <Text type="regular" theme="light" style={styles.dateOrStatus}>
                            {dateOrStatus}
                        </Text>
                    </Row>
                    <Row justify="space-between" align="center">
                        <Text type="bold" theme="light" style={styles.address}>
                            <Trunc type="address">{address}</Trunc>
                        </Text>
                        <Row style={styles.value} align="center">
                            {values.map((value, index) => (
                                <View style={styles.valueContainer} key={'tx-i-v' + index}>
                                    {value.type === ValueType.HasCustomMosaic && <Icon size="mini" name="mosaics_filled" />}
                                    {value.type === ValueType.HasMessage && <Icon size="mini" name="message_filled" />}
                                    {value.type === ValueType.AmountIncoming && (
                                        <Text type="bold" theme="light" style={styles.valueAmountIncoming}>
                                            {value.value}
                                        </Text>
                                    )}
                                    {value.type === ValueType.AmountOutgoing && (
                                        <Text type="bold" theme="light" style={styles.valueAmountOutgoing}>
                                            -{value.value}
                                        </Text>
                                    )}
                                    {value.type === ValueType.Other && (
                                        <Text type="bold" theme="light" style={styles.valueOther}>
                                            {value.value}
                                        </Text>
                                    )}
                                    {value.type === ValueType.AggregatePendingSignature && (
                                        <Text type="regular" theme="light" style={styles.valuePendingSignature}>
                                            {translate('history.transaction.waitingSignature')}
                                        </Text>
                                    )}
                                    {value.type === ValueType.AggregateInner && (
                                        <Row align="center" style={styles.valueAggregateInner}>
                                            <Text type="regular" theme="light" style={styles.valueOther}>
                                                {value.value.txCount}
                                            </Text>
                                            {value.value.txIcons.map((txIcon, key) => (
                                                <Icon size="mini" name={txIcon} style={styles.valueContainer} key={'tx-inner-i' + key} />
                                            ))}
                                        </Row>
                                    )}
                                </View>
                            ))}
                        </Row>
                    </Row>
                </Col>
            </Row>
            {showDetails && (
                <>
                    <View style={styles.table}>
                        <TableView hideEmpty data={tableData} />
                    </View>
                    <LinkExplorer type="transaction" value={transaction.hash} />
                </>
            )}
        </View>
    );
}

export default connect(state => ({
    network: state.network.selectedNetwork,
    currentAddress: state.transaction.addressFilter,
    selectedAccount: state.wallet.selectedAccount,
    isMultisig: state.account.isMultisig,
    address: state.account.selectedAccountAddress,
    cosignatoryOf: state.account.cosignatoryOf,
}))(TransactionItem);
