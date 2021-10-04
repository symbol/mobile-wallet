import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, Linking } from 'react-native';
import { Col, Row, Text, Trunc, Icon, TableView } from '@src/components';
import GlobalStyles from '@src/styles/GlobalStyles';
import type { TransactionModel } from '@src/storage/models/TransactionModel';
import { filterCurrencyMosaic } from '@src/utils/filter';
import { getFinanceBotPublicKeys } from '@src/config/environment';
import { TransactionType, UInt64, AggregateTransaction as SdkAggregateTransaction } from 'symbol-sdk';
import TransactionService from '@src/services/TransactionService';

const styles = StyleSheet.create({
    transactionPreview: {
        width: '100%',
        borderRadius: 6,
        backgroundColor: GlobalStyles.color.WHITE
	},
	date: {
		fontSize: 10
	},
	iconContainer: {
		marginRight: 14,
	},
	amounteOutgoing: {
        color: GlobalStyles.color.RED,
    },
    amountIncoming: {
        color: GlobalStyles.color.GREEN,
	},
	address: {
		fontSize: 11
	},
	bold: {
		fontSize: 11
	}
});

type Props = {
    transaction: TransactionModel,
};

export class TransactionItem extends Component<Props> {
	state: {
        fullTransaction: null,
    };

	componentDidMount() {
        const { selectedNode, transaction } = this.props;
        TransactionService.getTransaction(transaction.hash, selectedNode).then(async tx => {
            this.setState({ fullTransaction: tx });
        });
    }

	renderValue = value => {
		switch(value.type) {
			case 'nativeMosaicIncoming':
				return <Text type="bold" theme="light" style={[styles.amountIncoming, {marginLeft: 5}]}>{value.value}</Text>;
			case 'nativeMosaicOutgoing':
				return <Text type="bold" theme="light" style={[styles.amounteOutgoing, {marginLeft: 5}]}>{'-'+value.value}</Text>;
			case 'otherMosaics':
				return <Icon size="mini" name="mosaics_filled" style={{marginLeft: 5}}/>
			case 'message':
				return <Icon size="mini" name="message_filled" style={{marginLeft: 5}}/>
		}
	};

    render = () => {
		const { transaction, showDetails, currentAddress, network } = this.props;
		let transactionType = transaction.type;
		let date = transaction.deadline;
		let iconName = transaction.type;
		let info = transaction.signerAddress;
		let values = [];

		switch(transaction.type) {
			case 'transfer':  // TODO: replace with SDK.TransactionType.TRANSFER
				const transferType = transaction.recipientAddress === currentAddress ? 'incoming' : 'outgoing';
				const currencyMosaic = filterCurrencyMosaic(transaction.mosaics, network);
				iconName = transferType === 'incoming' ? 'incoming_light' : 'outgoing_light';
				transactionType = transferType === 'incoming' ? 'Transfer from' : 'Transfer to';
				info = transferType === 'incoming' ? transaction.signerAddress : transaction.recipientAddress;
				
				if (!currencyMosaic) {
					values.push({ type: 'nativeMosaicIncoming', value: 0 });
				} else {
					if (currencyMosaic && transferType === 'incoming')
						values.push({ type: 'nativeMosaicIncoming', value: currencyMosaic.amount / Math.pow(10, currencyMosaic.divisibility) });
					if (currencyMosaic && transferType === 'outgoing')
						values.push({ type: 'nativeMosaicOutgoing', value: currencyMosaic.amount / Math.pow(10, currencyMosaic.divisibility) });
				}
				if ((transaction.mosaics.length > 1 && currencyMosaic) || (transaction.mosaics.length > 0 && !currencyMosaic)) {
					values.push({ type: 'otherMosaics' });
				}
				if (transaction.messageText) values.push({ type: 'message' });
			break;
			case 'aggregate':
				const isPostLaunchOptIn = getFinanceBotPublicKeys(network.type)
					.indexOf(transaction.signTransactionObject.signer.publicKey) >= 0;
				let postLaunchOptinAmount = '';

				if (this.state) {
					const transaction: SdkAggregateTransaction = this.state.fullTransaction;
					const innerTransactions = transaction && transaction.innerTransactions ? transaction.innerTransactions: [];
					const _currentAddress = currentAddress.replace(/-/g, '');
					const filteredTransactions = innerTransactions.filter(innerTransaction => {
						return (
							innerTransaction.type === TransactionType.TRANSFER &&
							innerTransaction.recipientAddress &&
							innerTransaction.recipientAddress?.plain() === _currentAddress &&
							innerTransaction.mosaics?.length
						);
					});
					const mosaics = filteredTransactions.map(transaction => transaction.mosaics[0]);
					let sumAmount = UInt64.fromNumericString('0');
					mosaics.forEach(mosaic => (sumAmount = sumAmount.add(mosaic.amount)));
					postLaunchOptinAmount = sumAmount.compact() / Math.pow(10, 6);
				}

				iconName = isPostLaunchOptIn ? 'postLaunchOptIn' : transaction.type;

			break;

		}
		
		
		return (
			<View style={styles.transactionPreview}>
				<Row justify="start" fullWidth>
					<Col justify="center" align="center" style={styles.iconContainer}>
						<Icon size="small" name={iconName} style={styles.icon} />
					</Col>
					<Col grow>
						<Row justify="space-between">
							<Text type="regular" theme="light">
								{transactionType}
							</Text>
							<Text type="regular" theme="light" style={styles.date}>
								{date}
							</Text>
						</Row>
						<Row justify="space-between" align="center">
							<Text type="bold" theme="light" style={styles.address}>
								<Trunc type="address">
									{info}
								</Trunc>
							</Text>
							<Row style={styles.value} align="center">
								{values.map(value => this.renderValue(value))}
							</Row>
						</Row>
					</Col>
				</Row>
				{showDetails && (
					<Text type="bold" theme="light">
						{JSON.stringify(transaction.innerTransactions)}
					</Text>
                    // <View style={{paddingTop: 17}}>
                    //     <TableView data={transaction} />
                    // </View>
                )}
			</View>
		);
    }
}

export default connect(state => ({
	selectedNode: state.network.selectedNetwork,
    isLoading: state.transfer.isLoading,
	isMultisig: state.account.isMultisig,
    network: state.network.selectedNetwork,
    selectedAccount: state.wallet.selectedAccount,
    selectedAccountAddress: state.account.selectedAccountAddress,
    currentAddress: state.transaction.addressFilter,
}))(TransactionItem);
