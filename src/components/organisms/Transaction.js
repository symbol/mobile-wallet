import React, { Component } from 'react';
import { View, Image, StyleSheet, Linking } from 'react-native';
import { Row, Text, Trunc } from '@src/components';
import GlobalStyles from '../../styles/GlobalStyles';
import type { TransactionModel } from '@src/storage/models/TransactionModel';

const styles = StyleSheet.create({
    transactionPreview: {
        width: '100%',
        height: 60,
        borderRadius: 6,
        marginTop: 4,
        marginBottom: 4,
        padding: 17,
        paddingTop: 8,
        backgroundColor: '#fff5',
	},
	value: {
		// paddingHorizontal: 5,
		// borderRadius: 10,
		// backgroundColor: GlobalStyles.color.DARKWHITE
	},
	amounteOutgoing: {
		color: '#b30000' //GlobalStyles.color.RED
	},
	amountIncoming: {
		color: '#1bb300' //GlobalStyles.color.GREEN
	},
});

type Props = {
    transaction: TransactionModel,
};

export default class Transaction extends Component<Props> {
	renderValue = value => {
		//const value = props.children;
		switch(value.type) {
			case 'nativeMosaic':
				const textStyle = value.amount < 0 
					? styles.amounteOutgoing
					: styles.amountIncoming;
				return <Text type="bold" theme="light" style={textStyle}>{''+value.value}</Text>
		}
	};

    render = () => {
		const { transaction } = this.props;
		let transactionType = transaction.type;
		let date = transaction.deadline;
		let iconName = '';
		let info = transaction.signerAddress;
		let values = [];

		switch(transaction.type) {
			case 'transfer':  // TODO: replace with SDK.TransactionType.TRANSFER
				iconName = transaction.transferType === 'incoming' ? 'incoming' : 'outgoing';
				info = transaction.transferType === 'incoming' ? transaction.signerAddress : transaction.recipientAddress;

				if(transaction.customMosaics)
					values.push({type: 'customMosaics', value: transaction.customMosaics});
				if(transaction.message)
					values.push({type: 'message', value: transaction.message});
				if(transaction.amount)
					values.push({type: 'nativeMosaic', value: transaction.amount});
				break;
		}
		
		
		return (
			<View style={styles.transactionPreview}>
				<Row justify="space-between">
					<Text type="regular" theme="light">
						{transactionType}
					</Text>
					<Text type="regular" theme="light">
						{date}
					</Text>
				</Row>
				<Row justify="space-between">
                    <Text type="bold" theme="light">
						<Trunc type="address">
							{info}
						</Trunc>
                    </Text>
					<View style={styles.value}>
						{values.map(value => this.renderValue(value))}
					</View>
                    {/* <Text type="bold" theme="light">
                        {(values[0] && values[0].value) || ''}
                    </Text> */}
                </Row>
			</View>
		);
        // switch (transaction.type) {
        //     case 'transfer':
        //         return <TransferTransaction transaction={transaction} />;
        //     default:
        //         return (
        //             <View style={styles.transactionPreview}>
        //                 <Row justify="space-between">
        //                     <Text type="regular" theme="light">
        //                         {transaction.type}
        //                     </Text>
        //                     <Text type="regular" theme="light">
        //                         {transaction.deadline}
        //                     </Text>
        //                 </Row>
        //                 <Row justify="space-between">
        //                     <Text type="bold" theme="light">
		// 						<Trunc type="address">
        //                         	{transaction.signerAddress}
		// 						</Trunc>
        //                     </Text>
        //                 </Row>
        //             </View>
        //         );
        // }
    }
}
