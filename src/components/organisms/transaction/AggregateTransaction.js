import React  from 'react';
import { Text, Row, Button } from '@src/components';
import { View } from 'react-native';
import type { AggregateTransactionModel } from '@src/storage/models/TransactionModel';
import BaseTransactionItem from '@src/components/organisms/transaction/BaseTransactionItem';
import { connect } from 'react-redux';
import { getPublicKeyFromPrivateKey } from '@src/utils/account';
import store from '@src/store';
import TableView from '@src/components/organisms/TableView';
import {showPasscode} from "@src/utils/passcode";
import translate from "@src/locales/i18n";

type Props = {
    transaction: AggregateTransactionModel,
};

class AggregateTransaction extends BaseTransactionItem<Props> {
    sign() {
        showPasscode(this.props.componentId, () => {
            const { transaction } = this.props;
            store.dispatchAction({ type: 'transfer/signAggregateBonded', payload: transaction }).then(_ => {
                store.dispatchAction({ type: 'transaction/changeFilters', payload: {} });
            });
        });
    }

    needsSignature = () => {
        const { transaction, selectedAccount, isMultisig } = this.props;
        const accountPubKey = getPublicKeyFromPrivateKey(selectedAccount.privateKey);
        return !isMultisig && transaction.cosignaturePublicKeys.indexOf(accountPubKey) === -1 && transaction.status !== 'confirmed';
    };

    renderAction = () => {
        if (this.needsSignature()) {
            return (
                <Text type="regular" theme="light">
                    {translate('history.transaction.waitingSignature')}
                </Text>
            );
        }
    };

    renderDetails = () => {
        const { transaction, isLoading, isMultisig } = this.props;
        return (
            <View>
                <TableView
                    data={{
                        innerTxs: transaction.innerTransactions.length,
                    }}
                />
                {this.needsSignature() && (
                    <Row justify="space-between">
                        <Button style={{ padding: 0 }} isLoading={isLoading} text={translate('history.transaction.sign')} theme="light" onPress={() => this.sign()} />
                    </Row>
                )}
            </View>
        );
    };
}

export default connect(state => ({
    isLoading: state.transfer.isLoading,
    selectedAccount: state.wallet.selectedAccount,
    isMultisig: state.account.isMultisig,
}))(AggregateTransaction);
