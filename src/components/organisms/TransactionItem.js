import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { Col, Icon, LinkExplorer, Row, TableView, Text, Trunc } from '@src/components';
import GlobalStyles from '@src/styles/GlobalStyles';
import type { TransactionModel } from '@src/storage/models/TransactionModel';
import translate from '@src/locales/i18n';
import { filterCurrencyMosaic } from '@src/utils/filter';
import { getMosaicRelativeAmount } from '@src/utils/format';
import { transactionAwaitingSignatureByAccount } from '@src/utils/transaction';
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
 * enum PreviewValueType
 **/
const PreviewValueType = {
    AmountIncoming: 'amountIncoming',
    AmountOutgoing: 'amountOutgoing',
    HasMessage: 'hasMessage',
    HasCustomMosaic: 'hasCustomMosaic',
    AggregateInner: 'aggregateInner',
    AggregatePendingSignature: 'AggregatePendingSignature',
    Other: 'other',
};

interface PreviewValue {
    type: PreviewValueType;
    value?: string | number;
}

type Props = {
    transaction: TransactionModel,
    showDetails: boolean,
};

function TransactionItem(props: Props) {
    const { transaction, currentAddress, selectedAccount, network, showDetails, isMultisig, cosignatoryOf } = props;
    let transactionType = transaction.transactionType;
    let address = transaction.signerAddress;
    let previewValues: PreviewValue[] = [];

    if (transactionType === TransactionType.TRANSFER) {
        const incomingTransaction = transaction.recipientAddress === currentAddress;
        const mosaics = transaction.mosaics;
        const currencyMosaic = filterCurrencyMosaic(mosaics, network);
        const hasCustomMosaic = (currencyMosaic && mosaics.length > 1) || (!currencyMosaic && mosaics.length > 0);
        const hasMessage = !!transaction.messageText;

        transactionType = transactionType + (incomingTransaction ? '_incoming' : '_outgoing');
        address = incomingTransaction ? transaction.signerAddress : transaction.recipientAddress;

        if (currencyMosaic && incomingTransaction) {
            previewValues.push({
                type: PreviewValueType.AmountIncoming,
                value: getMosaicRelativeAmount(currencyMosaic),
            });
        }
        if (currencyMosaic && !incomingTransaction) {
            previewValues.push({
                type: PreviewValueType.AmountOutgoing,
                value: getMosaicRelativeAmount(currencyMosaic),
            });
        }
        if (hasCustomMosaic) {
            previewValues.push({
                type: PreviewValueType.HasCustomMosaic,
            });
        }
        if (hasMessage) {
            previewValues.push({
                type: PreviewValueType.HasMessage,
            });
        }
    } else if (transactionType === TransactionType.AGGREGATE_BONDED || transactionType === TransactionType.AGGREGATE_COMPLETE) {
        const needsSignature = !isMultisig && transactionAwaitingSignatureByAccount(transaction, selectedAccount, cosignatoryOf);

        if (needsSignature) {
            previewValues.push({
                type: PreviewValueType.AggregatePendingSignature,
            });
        } else {
            previewValues.push({
                type: PreviewValueType.AggregateInner,
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
        previewValues.push({
            type: PreviewValueType.Other,
            value: transaction.namespaceName,
        });
    } else if (transactionType === TransactionType.HASH_LOCK) {
        const currencyMosaic = filterCurrencyMosaic(transaction.mosaics, network);

        previewValues.push({
            type: PreviewValueType.Other,
            value: getMosaicRelativeAmount(currencyMosaic),
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
                            {previewValues.map((previewValue, index) => (
                                <View style={styles.valueContainer} key={'tx-i-v' + index}>
                                    {previewValue.type === PreviewValueType.HasCustomMosaic && <Icon size="mini" name="mosaics_filled" />}
                                    {previewValue.type === PreviewValueType.HasMessage && <Icon size="mini" name="message_filled" />}
                                    {previewValue.type === PreviewValueType.AmountIncoming && (
                                        <Text type="bold" theme="light" style={styles.valueAmountIncoming}>
                                            {previewValue.value}
                                        </Text>
                                    )}
                                    {previewValue.type === PreviewValueType.AmountOutgoing && (
                                        <Text type="bold" theme="light" style={styles.valueAmountOutgoing}>
                                            -{previewValue.value}
                                        </Text>
                                    )}
                                    {previewValue.type === PreviewValueType.Other && (
                                        <Text type="bold" theme="light" style={styles.valueOther}>
                                            {previewValue.value}
                                        </Text>
                                    )}
                                    {previewValue.type === PreviewValueType.AggregatePendingSignature && (
                                        <Text type="regular" theme="light" style={styles.valuePendingSignature}>
                                            {translate('history.transaction.waitingSignature')}
                                        </Text>
                                    )}
                                    {previewValue.type === PreviewValueType.AggregateInner && (
                                        <Row align="center" style={styles.valueAggregateInner}>
                                            <Text type="regular" theme="light" style={styles.valueOther}>
                                                {previewValue.value.txCount}
                                            </Text>
                                            {previewValue.value.txIcons.map((txIcon, key) => (
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
