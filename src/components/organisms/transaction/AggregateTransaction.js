import React, { Component } from 'react';
import { View, Image, StyleSheet, Linking } from 'react-native';
import { Text, Row, Button } from '@src/components';
import type { AggregateTransactionModel, FundsLockTransactionModel } from '@src/storage/models/TransactionModel';
import store from '@src/store';
import { connect } from 'react-redux';
import { getPublicKeyFromPrivateKey } from '@src/utils/account';

const styles = StyleSheet.create({
    transactionPreview: {
        width: '100%',
        borderRadius: 6,
        marginTop: 4,
        marginBottom: 4,
        padding: 17,
        paddingTop: 8,
        backgroundColor: '#fff5',
    },
});

type Props = {
    transaction: AggregateTransactionModel,
};

class AggregateTransaction extends Component<Props> {
    sign() {
        const { transaction } = this.props;
        store.dispatchAction({ type: 'transfer/signAggregateBonded', payload: transaction }).then(_ => {
            store.dispatchAction({ type: 'account/loadAllData' });
        });
    }

    render() {
        const { transaction, isLoading, selectedAccount } = this.props;
        const accountPubKey = getPublicKeyFromPrivateKey(selectedAccount.privateKey);
        const needsSignature = transaction.cosignaturePublicKeys.indexOf(accountPubKey) === -1 && transaction.status !== 'confirmed';
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
                        Pending signature: {needsSignature ? 'yes' : 'no'}
                    </Text>
                    <Text type="bold" theme="light">
                        Inner tx: {transaction.innerTransactions.length}
                    </Text>
                </Row>
                <Row justify="space-between">
                    <Text type="bold" theme="light">
                        Status: {transaction.status}
                    </Text>
                </Row>
                {needsSignature && (
                    <Row justify="space-between">
                        <Button isLoading={isLoading} isDisabled={false} text="Sign" theme="light" onPress={() => this.sign()} />
                    </Row>
                )}
            </View>
        );
    }
}

export default connect(state => ({
    isLoading: state.transfer.isLoading,
    selectedAccount: state.wallet.selectedAccount,
}))(AggregateTransaction);
