import React, { Component } from 'react';
import type { TransactionModel } from '@src/storage/models/TransactionModel';
import TransferTransaction from '@src/components/organisms/transaction/TransferTransaction';
import FundsLockTransaction from '@src/components/organisms/transaction/FundsLockTransaction';
import AggregateTransaction from '@src/components/organisms/transaction/AggregateTransaction';
import NamespaceRegistrationTransaction from '@src/components/organisms/transaction/NamespaceRegistrationTransaction';
import MosaicAliasTransaction from '@src/components/organisms/transaction/MosaicAliasTransaction';
import BaseTransactionItem from '@src/components/organisms/transaction/BaseTransactionItem';

type Props = {
    transaction: TransactionModel,
    showDetails: boolean,
};

export default class Transaction extends Component<Props> {
    render() {
        const { transaction, showDetails, componentId } = this.props;
        switch (transaction.type) {
            case 'transfer':
                return <TransferTransaction transaction={transaction} showDetails={showDetails} componentId={componentId} />;
            case 'fundsLock':
                return <FundsLockTransaction transaction={transaction} showDetails={showDetails} />;
            case 'aggregate':
                return <AggregateTransaction transaction={transaction} showDetails={showDetails} componentId={componentId} />;
            case 'namespace':
                return <NamespaceRegistrationTransaction transaction={transaction} showDetails={showDetails} />;
            case 'mosaicAlias':
                return <MosaicAliasTransaction transaction={transaction} showDetails={showDetails} />;
            default:
                return <BaseTransactionItem transaction={transaction} showDetails={showDetails} />;
        }
    }
}
