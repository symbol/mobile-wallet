import React, { Component } from 'react';
import { View, Image, StyleSheet, Linking } from 'react-native';
import { Text, Row } from '@src/components';
import type { TransactionModel, TransferTransactionModel } from '@src/storage/models/TransactionModel';

const styles = StyleSheet.create({
    transactionPreview: {
        width: '100%',
        height: 60,
        borderRadius: 6,
        marginTop: 4,
        marginBottom: 4,
        padding: 17,
        paddingTop: 8,
        backgroundColor: '#fff5',
    },
});

type Props = {
    transaction: TransferTransactionModel,
};

export default class TransferTransaction extends Component<Props> {
    render() {
        const { transaction } = this.props;
        return (
            <View style={styles.transactionPreview}>
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
                    <Text type="bold" theme="light">
                        {transaction.amount}
                    </Text>
                </Row>
            </View>
        );
    }
}
