import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Row, Col, Text, PriceChart } from '../../components';
import GlobalStyles from '../../styles/GlobalStyles';

// TODO: Remove font styles. Use <Text type={} /> instead
const styles = StyleSheet.create({
	root: {
		marginTop: 60
	},	
	priceChart: {
		position: 'absolute',
		top: -50,
		left: -64
	},
	currencyText: {
		fontSize: 15,
		marginBottom: 8,
		color: GlobalStyles.color.onDark.TEXT,
	},	
	balanceText: {
		fontFamily: 'NotoSans-SemiBold',
		fontSize: 36,
		color: GlobalStyles.color.onDark.TEXT,
	},	
	bottomContainer: {
		marginTop: 3,
		opacity: 0.5
	},
	fiatText: {
		fontSize: 15,
		color: GlobalStyles.color.onDark.TEXT,
	},
	priceChange: {
		fontSize: 15,
		color: GlobalStyles.color.GREEN,
	}
});

type Props = {
	showChart: boolean
};

type State = {
	currency: string,
	balance: string,
	fiat: string,
	priceChange: string
};


export default class BalanceWidget extends Component<Props, State> {
	// TODO: Replace with data from Store
	state = {
		currency: 'XYM',
		balance: '12000',
		fiat: '68,148 USD',
		priceChange: '+1.20% /////',
	};

	render() {
		const { 
			showChart = true
		} = this.props;
		const { 
			currency,
			balance,
			fiat,
			priceChange
		} = this.state;

		return (
			<View style={styles.root}>
				{!!showChart && <PriceChart style={styles.priceChart}/>}
				<Col>
					<Row justify="center" align="end">
						<Text style={styles.currencyText}>
							{currency}
						</Text>
						<Text style={styles.balanceText}>
							{balance}
						</Text>
					</Row>
					<Row justify="center" style={styles.bottomContainer}>
						<Text style={styles.fiatText}>
							{fiat} | 
						</Text>
						<Text style={styles.priceChange}>
							{priceChange}
						</Text>
					</Row>
				</Col>
			</View>
		);
	};
}
