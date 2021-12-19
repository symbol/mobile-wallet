import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Col, LinkExplorer, Row, Text, Trunc } from '@src/components';
import GlobalStyles from '@src/styles/GlobalStyles';
import type { TransactionModel } from '@src/storage/models/TransactionModel';
import translate from '@src/locales/i18n';
import TransactionIcon from '@src/components/controls/TransactionIcon';

const styles = StyleSheet.create({
    transactionPreview: {
        width: '100%',
        borderRadius: 6,
    },
    date: {
        fontSize: 10,
    },
    iconContainer: {
        marginRight: 14,
    },
    amounteOutgoing: {
        color: GlobalStyles.color.RED,
    },
    amountIncoming: {
        color: GlobalStyles.color.GREEN,
    },
    address: {
        fontSize: 11,
    },
    bold: {
        fontSize: 11,
    },
});

type Props = {
    transaction: TransactionModel,
};

export default class BaseTransactionItem extends Component<Props, State> {
    iconName = () => {
        return this.props.transaction.type;
    };

    title = () => {
        return translate('transactionTypes.' + this.props.transaction.type);
    };

    renderAction = () => {
        return;
    };

    renderDetails = () => {
        return;
    };

    renderAddress = () => {
        const { transaction } = this.props;
        return <Trunc type="address">{transaction.signerAddress}</Trunc>;
    };

    render = () => {
        const { transaction, showDetails } = this.props;
        let date = transaction.deadline;

        return (
            <View style={styles.transactionPreview}>
                <Row justify="start" fullWidth>
                    <Col justify="center" align="center" style={styles.iconContainer}>
                        <TransactionIcon size="small" name={this.iconName()} style={styles.icon} />
                    </Col>
                    <Col grow>
                        <Row justify="space-between">
                            <Text type="regular" theme="darkmode">
                                {this.title()}
                            </Text>
                            <Text type="regular" theme="darkmode" style={styles.date}>
                                {transaction.status === 'unconfirmed' ? 'Unconfirmed' : date}
                            </Text>
                        </Row>
                        <Row justify="space-between" align="center">
                            <Text type="bold" theme="darkmode" style={styles.address}>
                                {this.renderAddress()}
                            </Text>
                            <Row style={styles.value} align="center">
                                {this.renderAction()}
                            </Row>
                        </Row>
                    </Col>
                </Row>
                {showDetails && (
                    <View style={{ paddingVertical: 16 }}>
                        {this.renderDetails()}
                        <View justify="space-between" style={{ paddingBottom: 16 }}>
                            <Text type="bold" theme="darkmode">
                                {translate('history.transaction.hash')}:
                            </Text>
                            <Text type="regular" theme="darkmode">
                                {transaction.hash.slice(0, 24)}...
                            </Text>
                        </View>
                        <Row justify="start" style={{ alignItems: 'flex-end' }}>
                            <LinkExplorer type="transaction" value={transaction.hash} />
                        </Row>
                    </View>
                )}
            </View>
        );
    };
}
