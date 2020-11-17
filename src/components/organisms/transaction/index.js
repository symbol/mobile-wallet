import React, { Component } from 'react';
import { StyleSheet, Linking } from 'react-native';
import type { TransactionModel } from '@src/storage/models/TransactionModel';
import TransferTransaction from '@src/components/organisms/transaction/TransferTransaction';
import FundsLockTransaction from '@src/components/organisms/transaction/FundsLockTransaction';
import AggregateTransaction from '@src/components/organisms/transaction/AggregateTransaction';
import NamespaceRegistrationTransaction from '@src/components/organisms/transaction/NamespaceRegistrationTransaction';
import MosaicAliasTransaction from '@src/components/organisms/transaction/MosaicAliasTransaction';
import { getExplorerURL } from '@src/config/environment';
import BaseTransactionItem from '@src/components/organisms/transaction/BaseTransactionItem';


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
                return <TransferTransaction transaction={transaction} showDetails={showDetails} />;
            case 'fundsLock':
                return <FundsLockTransaction transaction={transaction} showDetails={showDetails} />;
            case 'aggregate':
                return <AggregateTransaction transaction={transaction} showDetails={showDetails} openExplorer={() => this.openExplorer()} />;
            case 'namespace':
                return <NamespaceRegistrationTransaction transaction={transaction} showDetails={showDetails} openExplorer={() => this.openExplorer()} />;
            case 'mosaicAlias':
                return <MosaicAliasTransaction transaction={transaction} showDetails={showDetails} openExplorer={() => this.openExplorer()} />;
            default:
                return <BaseTransactionItem transaction={transaction} showDetails={showDetails} />;
        }
    }
}
