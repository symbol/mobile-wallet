import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Row, Col, Text, PriceChart } from '../../components';
import GlobalStyles from '../../styles/GlobalStyles';


const styles = StyleSheet.create({
	root: {
		marginTop: 168
	},	
	priceChart: {
		position: 'absolute',
		top: -30,
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

type Props = {};

type State = { data: any };


export default class BalanceWidget extends Component<Props, State> {
	state = { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]};

	// TODO: move http reqest to Services
	componentDidMount() {
		
	};

	render() {
		const { } = this.props;
		const { data } = this.state;

		const currency = 'XYM';
		const balance = '12000';
		const fiat = '68,148 USD';
		const priceChange = '+1.20% /////';

		return (
			<View style={styles.root}>
				<PriceChart style={styles.priceChart}/>
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
