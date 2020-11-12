import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Row } from '@src/components';
import { AddressComponent } from '@src/components/controls';
import type { TransferTransactionModel } from '@src/storage/models/TransactionModel';
import { connect } from 'react-redux';

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
    transaction: TransferTransactionModel,
    showDetails: boolean,
};

class TransferTransaction extends Component<Props> {

    render() {
        const { transaction, network, showDetails, openExplorer } = this.props;
        const currencyMosaic = transaction.mosaics.find(mosaic => mosaic.mosaicId === network.currencyMosaicId);
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
                    <AddressComponent type="bold" theme="light">
                        {transaction.signerAddress}
                    </AddressComponent>
                    <Text type="bold" theme="light">
                        Amount: {currencyMosaic ? currencyMosaic.amount / Math.pow(10, currencyMosaic.divisibility) : 0}
                    </Text>
                </Row>
                {showDetails && (
                    <View>
                        <Row justify="space-between">
                            <Text type="bold" theme="light">
                                Mosaics:
                            </Text>
                        </Row>
                        {transaction.mosaics.map(mosaic => {
                            return (
                                <Row justify="space-between">
                                    <Text type="regular" theme="light" align="right">
                                        {mosaic.mosaicName || mosaic.mosaicId}
                                    </Text>
                                    <Text type="regular" theme="light">
                                        {mosaic.amount / Math.pow(10, mosaic.divisibility)}
                                    </Text>
                                </Row>
                            );
                        })}
                        <Row justify="space-between">
                            <Text type="bold" theme="light">
                                Message:
                            </Text>
                            <Text type="bold" theme="light" onClick>
                                {transaction.messageEncrypted ? 'Encrypted' : transaction.messageText}
                            </Text>
                        </Row>
                        <Row justify="space-between">
                            <Text type="bold" theme="light">
                                Hash:
                            </Text>
                            <Text type="regular" theme="light">
                                {transaction.hash.slice(0, 24)}...
                            </Text>
                        </Row>

                        <TouchableOpacity onPress={openExplorer}>
                            <Row justify="end">
                                <Text type="regular" theme="light">
                                    Open in the explorer
                                </Text>
                            </Row>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }
}

export default connect(state => ({
    network: state.network.selectedNetwork,
    addressBook: state.addressBook.addressBook,
}))(TransferTransaction);
