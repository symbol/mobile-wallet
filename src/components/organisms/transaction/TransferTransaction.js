import React from 'react';
import { connect } from 'react-redux';
import BaseTransactionItem from '@src/components/organisms/transaction/BaseTransactionItem';
import translate from '@src/locales/i18n';
import type { TransferTransactionModel } from '@src/storage/models/TransactionModel';
import { Icon, SecretView, Section, TableView, Text, Trunc } from '@src/components';
import { filterCurrencyMosaic } from '@src/utils/filter';
import { StyleSheet, View } from 'react-native';
import TransactionService from '@src/services/TransactionService';
import GlobalStyles from '@src/styles/GlobalStyles';

const styles = StyleSheet.create({
    amountOutgoing: {
        color: GlobalStyles.color.RED,
    },
    amountIncoming: {
        color: GlobalStyles.color.GREEN,
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
        return translate('transactionTypes.' + this.props.transaction.type + (this.isIncoming() ? 'From' : 'To'));
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
                values.push({
                    type: 'nativeMosaicIncoming',
                    value: currencyMosaic.amount / Math.pow(10, currencyMosaic.divisibility),
                });
            if (currencyMosaic && !this.isIncoming())
                values.push({
                    type: 'nativeMosaicOutgoing',
                    value: currencyMosaic.amount / Math.pow(10, currencyMosaic.divisibility),
                });
        }
        if ((transaction.mosaics.length > 1 && currencyMosaic) || (transaction.mosaics.length > 0 && !currencyMosaic)) {
            values.push({ type: 'otherMosaics' });
        }
        if (transaction.messageText) values.push({ type: 'message' });

        const items = [];
        for (let value of values) {
            switch (value.type) {
                case 'nativeMosaicIncoming':
                    if (value.value !== 0)
                        items.push(
                            <Text type="bold" theme="darkmode" style={[styles.amountIncoming, styles.bold, { marginLeft: 5 }]}>
                                {value.value}
                            </Text>
                        );
                    break;
                case 'nativeMosaicOutgoing':
                    if (value.value !== 0)
                        items.push(
                            <Text type="bold" theme="darkmode" style={[styles.amountOutgoing, styles.bold, { marginLeft: 5 }]}>
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
        const callback = async () => {
            this.setState({ decrypting: true });
            const { selectedAccount, network, transaction } = this.props;
            const messageDecrypted = await TransactionService.decryptMessage(selectedAccount, network, transaction);
            this.setState({
                messageDecrypted: messageDecrypted,
                decrypting: false,
            });
        };
        callback();
        //showPasscode(this.props.componentId, callback);
    };

    canBeDecrypted = () => {
        const { transaction, selectedAccountAddress } = this.props;
        //TODO: Check msig
        return true || transaction.recipientAddress === selectedAccountAddress;
    };

    renderDetails = () => {
        const { messageDecrypted } = this.state;
        const { transaction } = this.props;
        const parsedData = {};

        if (this.hasCustomMosaics()) parsedData.mosaics = transaction.mosaics;
        if (transaction.messageText && !transaction.messageEncrypted) parsedData.messageText = transaction.messageText;

        return (
            <View>
                <TableView data={parsedData} />
                {!!transaction.messageEncrypted && !!transaction.messageText && transaction.messageText.length > 0 && (
                    <View justify="space-between">
                        <Section type="form-item">
                            <Text type="bold" theme="darkmode" style={styles.bold}>
                                {translate('history.transaction.message')}:
                            </Text>
                            {this.canBeDecrypted() && (
                                <SecretView
                                    componentId={this.props.componentId}
                                    preShowFn={() => this.decryptMessage()}
                                    title={translate('history.transaction.decrypt')}
                                    theme="darkmode"
                                >
                                    {messageDecrypted}
                                </SecretView>
                            )}
                            {!this.canBeDecrypted() && (
                                <Text type="regular" theme="darkmode">
                                    {translate('history.transaction.encrypted')}
                                </Text>
                            )}
                        </Section>
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
