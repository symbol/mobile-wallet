import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Row, CopyView, Text, Section, SymbolGradientContainer } from '@src/components';
import GlobalStyles from '../../styles/GlobalStyles';
import { connect } from 'react-redux';

// TODO: Remove font styles. Use <Text type={} /> instead
const styles = StyleSheet.create({
    root: {
		flex: null,
		margin: 0,
		padding: 0,
		borderRadius: 6,
        marginTop: 4,
        marginBottom: 4,
        padding: 17,
        paddingTop: 8,
    },
	address: {
		marginRight: -5,
		opacity: 0.7,
		color: GlobalStyles.color.WHITE,
		fontSize: 1 * 12,
        lineHeight: 1.75 * 12,
        marginBottom: 17,
	},
	mosaic: {
		fontSize: 1 * 12,
		lineHeight: 1.75 * 12,
		marginBottom: 2,
	},
	balance: {
		fontFamily: 'NotoSans-Light',
		fontSize: 2.5 * 12,
		lineHeight: 3.25 * 12,
		marginTop: 10
	},
	balanceLight: {
		fontFamily: 'NotoSans-Light',
		fontSize: 2.5 * 12,
		lineHeight: 3.25 * 12,
		marginTop: 10,
		opacity: 0.6
	}
});

type Props = {
    showChart: boolean,
	account: any
};

type State = {
    currency: string,
    balance: string,
    fiat: string,
    priceChange: string,
};

class BalanceWidget extends Component<Props, State> {
    // TODO: Replace with data from Store
    state = {
        currency: 'XYM',
        balance: '12000',
        fiat: '68,148 USD',
        priceChange: '+1.20%',
    };

    render() {
        const { showChart = true } = this.props;
        const { currency, fiat, priceChange } = this.state;
		const { 
			address,
			nativeMosaicNamespaceName,
			balance 
		} = this.props;

        return (
            <SymbolGradientContainer style={styles.root} noPadding>
                <View style={styles.content}>
					<CopyView style={styles.address} theme="dark">
						{address}
					</CopyView>
					<Row align="end" justify="space-between" fullWidth>
						<Text style={styles.mosaic} theme="dark">
						{nativeMosaicNamespaceName}
						</Text>
						<Row>
							<Text style={styles.balance} theme="dark">
								{(''+balance).split('.')[0]}.
							</Text>
							<Text style={styles.balanceLight} theme="dark">
								{(''+balance).split('.')[1]}
							</Text>
						</Row>
						
					</Row>	
				</View>
            </SymbolGradientContainer>
        );
    }
}

export default connect(state => ({
	address: state.account.selectedAccountAddress,
	nativeMosaicNamespaceName: 'XYM', //TODO: remove hardcode
	balance: state.account.balance,
}))(BalanceWidget);

