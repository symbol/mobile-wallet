import React from 'react';
import { Text, Row, Button } from '@src/components';
import { View } from 'react-native';
import type { AggregateTransactionModel } from '@src/storage/models/TransactionModel';
import BaseTransactionItem from '@src/components/organisms/transaction/BaseTransactionItem';
import { connect } from 'react-redux';
import { getPublicKeyFromPrivateKey } from '@src/utils/account';
import store from '@src/store';
import TableView from '@src/components/organisms/TableView';
import { showPasscode } from '@src/utils/passcode';
import translate from '@src/locales/i18n';
import { getFinanceBotPublicKeys } from '@src/config/environment';
import Icon from '@src/components/controls/Icon';
import { TransactionType, UInt64, AggregateTransaction as SdkAggregateTransaction, TransactionHttp } from 'symbol-sdk';
import TransactionService from '@src/services/TransactionService';

type Props = {
    transaction: AggregateTransactionModel,
};

class AggregateTransaction extends BaseTransactionItem<Props> {
    state: {
        fullTransaction: null,
    };

    componentDidMount() {
        const { selectedNode, transaction } = this.props;
        TransactionService.getTransaction(transaction.hash, selectedNode).then(async tx => {
            this.setState({ fullTransaction: tx });
        });
    }

    isPostLaunchOptIn = () => {
        return getFinanceBotPublicKeys(this.props.network).indexOf(this.props.transaction.signTransactionObject.signer.publicKey) >= 0;
    };

    postLaunchAmount = () => {
        if (!this.state) return 0;
        const transaction: SdkAggregateTransaction = this.state.fullTransaction;
        const innerTransactions = transaction && transaction.innerTransactions ? transaction.innerTransactions: [];
        const currentAddress = this.props.address.replace(/-/g, '');
        const filteredTransactions = innerTransactions.filter(innerTransaction => {
            return (
                innerTransaction.type === TransactionType.TRANSFER &&
                innerTransaction.recipientAddress &&
                innerTransaction.recipientAddress?.plain() === currentAddress &&
                innerTransaction.mosaics?.length
            );
        });
        const mosaics = filteredTransactions.map(transaction => transaction.mosaics[0]);
        let sumAmount = UInt64.fromNumericString('0');
        mosaics.forEach(mosaic => (sumAmount = sumAmount.add(mosaic.amount)));
        return sumAmount.compact() / Math.pow(10, 6);
    };

    iconName = () => {
        return this.isPostLaunchOptIn() ? 'postLaunchOptIn' : this.props.transaction.type;
    };

    title = () => {
        return this.isPostLaunchOptIn() ? translate('optin.title') : translate('transactionTypes.' + this.props.transaction.type);
    };

    sign() {
        showPasscode(this.props.componentId, () => {
            const { transaction } = this.props;
            store.dispatchAction({ type: 'transfer/signAggregateBonded', payload: transaction }).then(_ => {
                store.dispatchAction({ type: 'transaction/changeFilters', payload: {} });
            });
        });
    }

    needsSignature = () => {
        if (this.isPostLaunchOptIn()) return false;
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
        const table = { innerTxs: transaction.innerTransactions.length };
        if (this.needsSignature()) {
            table.signature = translate('table.signDescription'); //TODO: remove when inner transactions presentation is ready
        }

        if (this.isPostLaunchOptIn()) {
            const amount = this.postLaunchAmount();
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon style={{ width: 75, height: 50, marginBottom: 10 }} size="big" name="optin" />
                    <Text style={{ flex: 1 }} type="regular" align="right" theme="light">
                        {transaction.status === 'confirmed'
                            ? translate('optin.postLaunchTransactionText')
                            : translate('optin.postLaunchTransactionTextUnconfirmed')}{' '}
                        {amount}
                    </Text>
                </View>
            );
        }
        return (
            <View>
                <TableView data={table}/>
            </View>
        );
    };
}

export default connect(state => ({
    selectedNode: state.network.selectedNetwork,
    isLoading: state.transfer.isLoading,
    selectedAccount: state.wallet.selectedAccount,
    isMultisig: state.account.isMultisig,
    network: state.network.selectedNetwork.type,
    address: state.account.selectedAccountAddress,
}))(AggregateTransaction);
