import React, { Component } from 'react';
import { View, Image, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import {Col, Row, Text, Trunc, Icon, TableView, Section, LinkExplorer} from '@src/components';
import GlobalStyles from '@src/styles/GlobalStyles';
import type { TransactionModel } from '@src/storage/models/TransactionModel';
import translate from '@src/locales/i18n';
import { getExplorerURL } from '@src/config/environment';
import TransactionIcon from '@src/components/controls/TransactionIcon';

const styles = StyleSheet.create({
    transactionPreview: {
        width: '100%',
        // height: 60,
        borderRadius: 6,
        // marginTop: 0,
        // marginBottom: 8,
        // padding: 17,
        // paddingTop: 8,
        backgroundColor: GlobalStyles.color.WHITE,
    },
    date: {
        fontSize: 10,
    },
    iconContainer: {
        marginRight: 14,
    },
    amounteOutgoing: {
        color: '#b30000',
    },
    amountIncoming: {
        color: '#1bb300',
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

    openExplorer() {
        const { transaction } = this.props;
        Linking.openURL(`${getExplorerURL()}transactions/${transaction.hash}`);
    }

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
                            <Text type="regular" theme="light">
                                {this.title()}
                            </Text>
                            <Text type="regular" theme="light" style={styles.date}>
                                {transaction.status === 'unconfirmed' ? 'Unconfirmed' : date}
                            </Text>
                        </Row>
                        <Row justify="space-between" align="center">
                            <Text type="bold" theme="light">
                                {this.renderAddress()}
                            </Text>
                            <Row style={styles.value} align="center">
                                {this.renderAction()}
                            </Row>
                        </Row>
                    </Col>
                </Row>
                {showDetails && (
                    <View style={{ padding: 17 }}>
                        {this.renderDetails()}
                        <Row justify="space-between" style={{ paddingTop: 10, paddingBottom: 6 }}>
                            <Text type="bold" theme="light">
                                {translate('history.transaction.hash')}:
                            </Text>
                            <Text type="regular" theme="light">
                                {transaction.hash.slice(0, 24)}...
                            </Text>
                        </Row>
                        <Row justify="end" style={{ alignItems: 'flex-end' }}>
                            <LinkExplorer type="transaction" value={transaction.hash} />
                        </Row>
                    </View>
                )}
            </View>
        );
    };
}
