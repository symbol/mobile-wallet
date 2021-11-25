import React from 'react';
import { Text } from '@src/components';
import type { FundsLockTransactionModel } from '@src/storage/models/TransactionModel';
import BaseTransactionItem from '@src/components/organisms/transaction/BaseTransactionItem';
import translate from '@src/locales/i18n';

type Props = {
    transaction: FundsLockTransactionModel,
};

export default class FundsLockTransaction extends BaseTransactionItem<Props> {
    renderAction = () => {
        const { transaction } = this.props;
        return (
            <Text type="regular" theme="light">
                {translate('history.transaction.amountLocked')}:{' '}
                {transaction.mosaic.amount /
                    Math.pow(10, transaction.mosaic.divisibility)}
            </Text>
        );
    };
}
