import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { Col, Icon, LinkExplorer, Row, TableView, Text, Trunc } from '@src/components';
import translate from '@src/locales/i18n';
import {
    getAggregateTransactionInfoPreview,
    getHashLockTransactionInfoPreview,
    getNamespaceTransactionInfoPreview,
    getTransferTransactionInfoPreview,
    isOutgoingTransaction,
    isPostLaunchOptInTransaction,
    isUnlinkActionTransaction,
} from '@src/utils/transaction';
import { TransactionType } from 'symbol-sdk';
import _ from 'lodash';
import GlobalStyles from '@src/styles/GlobalStyles';
import { TransactionInfoPreviewValueType } from '@src/storage/models/TransactionInfoPreviewModel';
import { Constants } from '@src/config/constants';
import type { TransactionInfoPreview } from '@src/storage/models/TransactionInfoPreviewModel';
import type { TransactionModel } from '@src/storage/models/TransactionModel';

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

type Props = {
    transaction: TransactionModel,
    showDetails: boolean,
};

function TransactionItem(props: Props) {
    const { transaction, currentAddress, selectedAccount, network, showDetails, isMultisig, cosignatoryOf } = props;
    let transactionType = transaction.transactionType;
    let address = transaction.signerAddress;
    let infoPreview: TransactionInfoPreview = [];

    switch (transaction.transactionType) {
        case TransactionType.TRANSFER: {
            const outgoingTransaction = isOutgoingTransaction(transaction, currentAddress);
            transactionType = transactionType + (outgoingTransaction ? '_outgoing' : '_incoming');
            address = outgoingTransaction ? transaction.recipientAddress : transaction.signerAddress;
            infoPreview = getTransferTransactionInfoPreview(transaction, currentAddress, network);

            break;
        }

        case TransactionType.AGGREGATE_BONDED:
        case TransactionType.AGGREGATE_COMPLETE: {
            const postLaunchOptInTransaction = isPostLaunchOptInTransaction(transaction, network);
            transactionType = postLaunchOptInTransaction ? 'postLaunchOptIn' : transactionType;
            infoPreview = getAggregateTransactionInfoPreview(transaction, selectedAccount, isMultisig, cosignatoryOf);

            break;
        }

        case TransactionType.NAMESPACE_REGISTRATION:
        case TransactionType.ADDRESS_ALIAS:
        case TransactionType.MOSAIC_ALIAS: {
            infoPreview = getNamespaceTransactionInfoPreview(transaction);
            transactionType = transactionType + (isUnlinkActionTransaction(transaction) ? '_unlink' : '');

            break;
        }

        case TransactionType.ACCOUNT_KEY_LINK:
        case TransactionType.NODE_KEY_LINK:
        case TransactionType.VOTING_KEY_LINK:
        case TransactionType.VRF_KEY_LINK: {
            transactionType = transactionType + (isUnlinkActionTransaction(transaction) ? '_unlink' : '');

            break;
        }

        case TransactionType.HASH_LOCK: {
            infoPreview = getHashLockTransactionInfoPreview(transaction, network);

            break;
        }
    }

    const iconName = 'transaction_' + transactionType;
    const title = translate('transactionTypes.transactionDescriptor_' + transactionType);
    const dateOrStatus = transaction.status === Constants.Message.UNCONFIRMED ? Constants.Message.UNCONFIRMED : transaction.deadline;
    const tableData = _.omit(transaction, ['deadline', 'status', 'transactionType', 'type', 'messageEncrypted']);

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
                            {infoPreview.map((previewValue, index) => (
                                <View style={styles.valueContainer} key={'tx-i-v' + index}>
                                    {previewValue.type === TransactionInfoPreviewValueType.HasCustomMosaic && (
                                        <Icon size="mini" name="mosaics_filled" />
                                    )}
                                    {previewValue.type === TransactionInfoPreviewValueType.HasMessage && (
                                        <Icon size="mini" name="message_filled" />
                                    )}
                                    {previewValue.type === TransactionInfoPreviewValueType.AmountIncoming && (
                                        <Text type="bold" theme="light" style={styles.valueAmountIncoming}>
                                            {previewValue.value}
                                        </Text>
                                    )}
                                    {previewValue.type === TransactionInfoPreviewValueType.AmountOutgoing && (
                                        <Text type="bold" theme="light" style={styles.valueAmountOutgoing}>
                                            -{previewValue.value}
                                        </Text>
                                    )}
                                    {previewValue.type === TransactionInfoPreviewValueType.Other && (
                                        <Text type="bold" theme="light" style={styles.valueOther}>
                                            {previewValue.value}
                                        </Text>
                                    )}
                                    {previewValue.type === TransactionInfoPreviewValueType.AggregatePendingSignature && (
                                        <Text type="regular" theme="light" style={styles.valuePendingSignature}>
                                            {translate('history.transaction.waitingSignature')}
                                        </Text>
                                    )}
                                    {previewValue.type === TransactionInfoPreviewValueType.AggregateInner && (
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
