import React from 'react';
import type { MosaicAliasTransactionModel } from '@src/storage/models/TransactionModel';
import BaseTransactionItem from '@src/components/organisms/transaction/BaseTransactionItem';
import { Text } from '@src/components';
import { View } from 'react-native';
import TableView from '@src/components/organisms/TableView';
import { connect } from 'react-redux';

type Props = {
    transaction: MosaicAliasTransactionModel,
};

class MosaicAliasTransaction extends BaseTransactionItem<Props> {
    renderAction = () => {
        const { transaction } = this.props;

        return (
            <Text type="bold" theme="light">
                {transaction.aliasAction ? 'v_link' : 'Unlink'}
            </Text>
        );
    };

    renderDetails = () => {
        const { transaction } = this.props;
        return (
            <View>
                <TableView
                    data={{
                        namespace: 'Name: ' + transaction.namespaceName + '\n' + 'ID: ' + transaction.namespaceId,
                        mosaicId: transaction.mosaicId,
                    }}
                />
            </View>
        );
    };
}

export default connect(state => ({
    network: state.network.selectedNetwork,
}))(MosaicAliasTransaction);
