import React, { Component } from 'react';
import { Text } from '@src/components';
import type { NamespaceRegistrationTransactionModel } from '@src/storage/models/TransactionModel';
import BaseTransactionItem from '@src/components/organisms/transaction/BaseTransactionItem';

type Props = {
    transaction: NamespaceRegistrationTransactionModel,
};

export default class NamespaceRegistrationTransaction extends BaseTransactionItem<Props> {

    renderAction = () => {
        const { transaction } = this.props;
        return (
            <Text type="bold" theme="light">
                {transaction.namespaceName}
            </Text>
        );
    };
}
