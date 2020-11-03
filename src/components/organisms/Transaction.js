import React, { Component } from 'react';
import { View, Image, StyleSheet, Linking } from 'react-native';
import { Row, Text, Trunc } from '@src/components';
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
});

type Props = {
    transaction: TransactionModel,
};

export default class Transaction extends Component<Props> {
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
                    <Text type="bold" theme="light">
                        {(values[0] && values[0].value) || ''}
                    </Text>
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
