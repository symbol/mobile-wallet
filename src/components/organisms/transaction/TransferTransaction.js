import React, { Component } from 'react';
import { View, Image, StyleSheet, Linking } from 'react-native';
import { Text, Row } from '@src/components';
import type { TransactionModel, TransferTransactionModel } from '@src/storage/models/TransactionModel';
import { connect } from 'react-redux';

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

class TransferTransaction extends Component<Props> {
    render() {
        const { transaction, network } = this.props;
        const currencyMosaic = transaction.mosaics.find(mosaic => mosaic.mosaicId === network.currencyMosaicId);
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
                        {transaction.signerAddress.slice(0, 9)}...
                    </Text>
                    <Text type="bold" theme="light">
                        Amount: {currencyMosaic ? (currencyMosaic.amount / Math.pow(10, currencyMosaic.divisibility)) : 0}
                    </Text>
                </Row>
            </View>
        );
    }
}

export default connect(state => ({
    network: state.network.selectedNetwork,
}))(TransferTransaction);
