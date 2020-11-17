import React, { Component } from 'react';
import { connect } from 'react-redux';
import BaseTransactionItem from '@src/components/organisms/transaction/BaseTransactionItem';
import translate from '@src/locales/i18n';
import type { TransactionModel, TransferTransactionModel } from '@src/storage/models/TransactionModel';
import { Button, Icon, Row, SecretView, Section, TableView, Text, Trunc } from '@src/components';
import { filterCurrencyMosaic } from '@src/utils/filter';
import { StyleSheet, View } from 'react-native';
import { Account } from 'symbol-sdk';
import NetworkService from '@src/services/NetworkService';
import TransactionService from '@src/services/TransactionService';

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
    state = {
        messageDecrypted: null,
        decrypting: false,
    };

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

    renderAddress = () => {
        const { transaction } = this.props;
        return <Trunc type="address">{this.isIncoming() ? transaction.signerAddress : transaction.recipientAddress}</Trunc>;
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

    decryptMessage = async () => {
        this.setState({ decrypting: true });
        const { selectedAccount, network, transaction } = this.props;
        const messageDecrypted = await TransactionService.decryptMessage(selectedAccount, network, transaction);
        this.setState({ messageDecrypted: messageDecrypted, decrypting: false });
    };

    renderDetails = () => {
        const { messageDecrypted, decrypting } = this.state;
        const { transaction, selectedAccountAddress } = this.props;
        const parsedData = {};

        if (this.hasCustomMosaics()) parsedData.mosaics = transaction.mosaics;
        if (!transaction.messageEncrypted) parsedData.messageText = transaction.messageText;

        return (
            <View>
                <TableView data={parsedData} />
                {!!transaction.messageEncrypted && (
                    <View justify="space-between">
                        <Section type="form-item">
                            <Text type="bold" theme="light">
                                Message:
                            </Text>
                            <Text type="regular" theme="light">
                                {messageDecrypted !== null ? messageDecrypted : 'Encrypted'}
                            </Text>
                        </Section>
                        {messageDecrypted === null && transaction.recipientAddress === selectedAccountAddress && this.isIncoming() && (
                            <Button theme="light" title="Decrypt" loading={decrypting} onPress={() => this.decryptMessage()} />
                        )}
                    </View>
                )}
            </View>
        );
    };
}

export default connect(state => ({
    network: state.network.selectedNetwork,
    selectedAccount: state.wallet.selectedAccount,
    selectedAccountAddress: state.account.selectedAccountAddress,
    address: state.transaction.addressFilter,
}))(TransferTransaction);
