import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, Linking } from 'react-native';
import { Row, Trunc } from '@src/components';
import type { TransactionModel } from '@src/storage/models/TransactionModel';
import TransferTransaction from '@src/components/organisms/TransferTransaction';

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
    transaction: TransactionModel,
};

export default class Transaction extends Component<Props> {
    render() {
        const { transaction } = this.props;
        switch (transaction.type) {
            case 'transfer':
                return <TransferTransaction transaction={transaction} />;
            default:
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
								<Trunc type="address">
                                	{transaction.signerAddress}
								</Trunc>
                            </Text>
                        </Row>
                    </View>
                );
        }
    }
}
