import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, Linking } from 'react-native';
import { Row } from '@src/components';
import type { TransactionModel } from '@src/storage/models/TransactionModel';
import TransferTransaction from '@src/components/organisms/transaction/TransferTransaction';
import FundsLockTransaction from '@src/components/organisms/transaction/FundsLockTransaction';
import AggregateTransaction from '@src/components/organisms/transaction/AggregateTransaction';
import { getExplorerURL } from '@src/config/environment';

const styles = StyleSheet.create({
    root: {
        width: '100%',
        borderRadius: 6,
        marginTop: 0,
        marginBottom: 8,
        padding: 17,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: '#fffd',
    },
});

type Props = {
    transaction: TransactionModel,
    showDetails: boolean,
};

export default class Transaction extends Component<Props> {
    openExplorer() {
        const { transaction } = this.props;
        Linking.openURL(`${getExplorerURL()}transactions/${transaction.hash}`);
    }

    render() {
        const { transaction, showDetails } = this.props;
        switch (transaction.type) {
            case 'transfer':
                return <TransferTransaction transaction={transaction} showDetails={showDetails} openExplorer={() => this.openExplorer()} />;
            case 'fundsLock':
                return <FundsLockTransaction transaction={transaction} showDetails={showDetails} openExplorer={() => this.openExplorer()} />;
            case 'aggregate':
                return <AggregateTransaction transaction={transaction} showDetails={showDetails} openExplorer={() => this.openExplorer()} />;
            default:
                return (
                    <View style={styles.root}>
                        <Row justify="space-between">
                            <Text type="regular" theme="light">
                                {transaction.type}
                            </Text>
                            <Text type="regular" theme="light">
                                {transaction.deadline}
                            </Text>
                        </Row>
                        <Row justify="space-between">
                            <Text type="bold" theme="light">
                                {transaction.signerAddress}
                            </Text>
                        </Row>
                    </View>
                );
        }
    }
}
