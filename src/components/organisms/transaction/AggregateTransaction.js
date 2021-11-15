import React from 'react';
import { Text, Row, Button } from '@src/components';
import { View, StyleSheet } from 'react-native';
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
import { TransactionType, UInt64, AggregateTransaction as SdkAggregateTransaction } from 'symbol-sdk';
import TransactionService from '@src/services/TransactionService';
import _ from 'lodash';
import { Router } from '@src/Router';
import GlobalStyles from '@src/styles/GlobalStyles';

const styles = StyleSheet.create({
    waitingSignature: {
        color: GlobalStyles.color.BLUE
    }
});

type Props = {
    transaction: AggregateTransactionModel,
};

class AggregateTransaction extends BaseTransactionItem<Props> {
    state = {
        fullTransaction: null,
    };

    async componentDidMount() {
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
                this.showCosignatureMessage(translate('notification.newCosignatureAdded'));
                store.dispatchAction({ type: 'transaction/changeFilters', payload: {} });
            });
        });
    }

    // check if the transaction needs to be Signed from current signer
    needsSignature = () => {
        if (this.isPostLaunchOptIn()) return false;
        const { transaction, selectedAccount, isMultisig, cosignatoryOf  } = this.props;
        const accountPubKey = getPublicKeyFromPrivateKey(selectedAccount.privateKey);
        const cosignerAddresses = transaction.innerTransactions.map((t) => t.signerAddress);
        const cosignRequired = cosignerAddresses.find((c) => {
            if (c) {
                return (
                    (cosignatoryOf && cosignatoryOf.some((address) => address === c))
                );
            }
            return false;
        });        
        return !isMultisig && (((transaction.cosignaturePublicKeys.indexOf(accountPubKey) === -1 && transaction.status !== 'confirmed'))|| (this.hasMissSignatures() && cosignRequired!==undefined));
    };

    // check if the transaction misses cosignatories
    hasMissSignatures=()=> {
        const {transaction}= this.props;
        return (
            transaction?.transactionInfo != null &&
            transaction?.transactionInfo.merkleComponentHash !== undefined &&
            transaction?.transactionInfo.merkleComponentHash.startsWith('000000000000')
        );
    }

    renderAction = () => {
        if (this.needsSignature()) {
            return (
                <Text type="regular" theme="light" style={styles.waitingSignature}>
                    {translate('history.transaction.waitingSignature')}
                </Text>
            );
        }
    };

    // show notification for transaction signing  
    showCosignatureMessage = (message: string) => {
        Router.showMessage({
            message: message,
            type: 'success',
        });
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
    cosignatoryOf: state.account.cosignatoryOf,
}))(AggregateTransaction);
