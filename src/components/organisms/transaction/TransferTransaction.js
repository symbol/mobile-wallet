import React, { Component } from 'react';
import { connect } from 'react-redux';
import BaseTransactionItem from '@src/components/organisms/transaction/BaseTransactionItem';
import translate from '@src/locales/i18n';
import type { TransactionModel, TransferTransactionModel } from '@src/storage/models/TransactionModel';
import { Icon, TableView, Text } from '@src/components';
import { filterCurrencyMosaic } from '@src/utils/filter';
import { StyleSheet } from 'react-native';
import GlobalStyles from '@src/styles/GlobalStyles';

const styles = StyleSheet.create({
    amountOutgoing: {
        color: '#b30000',
    },
    amountIncoming: {
        color: '#1bb300',
    },
});

type Props = {
    transaction: TransferTransactionModel,
};

class TransferTransaction extends BaseTransactionItem<Props> {
    isIncoming = () => {
        const { transaction, address } = this.props;
        return transaction.recipientAddress === address;
    };

    hasCustomMosaics = () => {
        const { transaction, network } = this.props;
        const currencyMosaic = filterCurrencyMosaic(transaction.mosaics, network);
        return (currencyMosaic && transaction.mosaics.length > 1) || (!currencyMosaic && transaction.mosaics.length > 0);
    };

    iconName = () => {
        return this.isIncoming() ? 'incoming' : 'outgoing';
    };

    title = () => {
        const title = translate('transactionTypes.' + this.props.transaction.type);
        return title + (this.isIncoming() ? ' from' : ' to');
    };

    renderAction = () => {
        const { transaction, network } = this.props;
        const values = [];
        const currencyMosaic = filterCurrencyMosaic(transaction.mosaics, network);
        if (!currencyMosaic) {
            values.push({ type: 'nativeMosaicIncoming', value: 0 });
        } else {
            if (currencyMosaic && this.isIncoming())
                values.push({ type: 'nativeMosaicIncoming', value: currencyMosaic.amount / Math.pow(10, currencyMosaic.divisibility) });
            if (currencyMosaic && !this.isIncoming())
                values.push({ type: 'nativeMosaicOutgoing', value: currencyMosaic.amount / Math.pow(10, currencyMosaic.divisibility) });
        }
        if ((transaction.mosaics.length > 1 && currencyMosaic) || (transaction.mosaics.length > 0 && !currencyMosaic)) {
            values.push({ type: 'otherMosaics' });
        }
        if (transaction.messageText) values.push({ type: 'message' });

        const items = [];
        for (let value of values) {
            switch (value.type) {
                case 'nativeMosaicIncoming':
                    items.push(
                        <Text type="bold" theme="light" style={[styles.amountIncoming, { marginLeft: 5 }]}>
                            {value.value}
                        </Text>
                    );
                    break;
                case 'nativeMosaicOutgoing':
                    items.push(
                        <Text type="bold" theme="light" style={[styles.amounteOutgoing, { marginLeft: 5 }]}>
                            {'-' + value.value}
                        </Text>
                    );
                    break;
                case 'otherMosaics':
                    items.push(<Icon size="mini" name="mosaics_filled" style={{ marginLeft: 5 }} />);
                    break;
                case 'message':
                    items.push(<Icon size="mini" name="message_filled" style={{ marginLeft: 5 }} />);
                    break;
            }
        }
        return items;
    };

    renderDetails = () => {
        const { transaction } = this.props;
        const parsedData = {};

        if (this.hasCustomMosaics()) parsedData.mosaics = transaction.mosaics;
        if (transaction.messageText && !transaction.messageEncrypted) parsedData.messageText = transaction.messageText;
        if (transaction.messageEncrypted) parsedData.messageEncrypted = transaction.messageEncrypted;
        return <TableView data={parsedData} />;
    };
}

export default connect(state => ({
    network: state.network.selectedNetwork,
    address: state.account.selectedAccountAddress,
}))(TransferTransaction);
