import React  from 'react';
import { Text, Row, Button } from '@src/components';
import { View } from 'react-native';
import type { AggregateTransactionModel } from '@src/storage/models/TransactionModel';
import BaseTransactionItem from '@src/components/organisms/transaction/BaseTransactionItem';
import { connect } from 'react-redux';
import { getPublicKeyFromPrivateKey } from '@src/utils/account';
import store from "@src/store";
import TableView from "@src/components/organisms/TableView";

type Props = {
    transaction: AggregateTransactionModel,
};

class AggregateTransaction extends BaseTransactionItem<Props> {
    sign() {
        const { transaction } = this.props;
        store.dispatchAction({ type: 'transfer/signAggregateBonded', payload: transaction }).then(_ => {
            store.dispatchAction({ type: 'account/loadAllData' });
        });
    }

    needsSignature = () => {
        const { transaction, selectedAccount } = this.props;
        const accountPubKey = getPublicKeyFromPrivateKey(selectedAccount.privateKey);
        return transaction.cosignaturePublicKeys.indexOf(accountPubKey) === -1 && transaction.status !== 'confirmed';
    };

    renderAction = () => {
        if (this.needsSignature()) {
            return (
                <Text type="regular" theme="light">
                    Waiting your signature
                </Text>
            );
        }
    };

    renderDetails = () => {
        const { transaction, isLoading } = this.props;
        return (
            <View>
                <TableView
                    data={{
                        innerTxs: transaction.innerTransactions.length,
                    }}
                />
                {this.needsSignature() && (
                    <Row justify="space-between">
                        <Button isLoading={isLoading} isDisabled={false} text="Sign" theme="light" onPress={() => this.sign()} />
                    </Row>
                )}
            </View>
        );
    };
}

export default connect(state => ({
    isLoading: state.transfer.isLoading,
    selectedAccount: state.wallet.selectedAccount,
}))(AggregateTransaction);
