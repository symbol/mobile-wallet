import React, { Component } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import store from '@src/store';
import GlobalStyles from '@src/styles/GlobalStyles';

const styles = StyleSheet.create({
	root: {
		marginLeft: 0,
		opacity: 0.8
	}
});

type Props = {};

type State = { data: any };


export default class PriceChart extends Component<Props, State> {
	state = { data: []};

	componentDidMount = () => {
		store.dispatchAction({type: 'market/loadMarketData'});
		store.subscribe(() => this.updateData());
	};

	updateData = () => {
		const data = store.getState().market.priceChartData;
		this.setState({
			data
		});
	};

	render() {
		const { style = {} } = this.props;
		const { data } = this.state;

		const labels = [];

		return (
			<View style={[styles.root, style]}>
				{!!data.length && <LineChart
					data={{
						labels,
						datasets: [{ data }]
					}}
					width={Dimensions.get("window").width + 30}
					height={220}
					chartConfig={{
						paddingRight: 300,
						fillShadowGradientOpacity: 0.3,
						//useShadowColorFromDataset: true,
						backgroundGradientTo:`rgba(255, 255, 255, 0)`,
						backgroundGradientFromOpacity: 0,
						backgroundGradientToOpacity: 0,
						decimalPlaces: 2,
						color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						labelColor: () => `rgba(255, 255, 255, 0)`,
						strokeWidth: 1.5,
						style: {
							borderRadius: 0
						},
						propsForDots: {
							r: 0,
							strokeWidth: 0,
						},
						propsForBackgroundLines: {
							strokeWidth: 0
						},
					}}
					bezier
					style={{
						marginVertical: 0,
						borderRadius: 0,
						paddingRight: 0,
					}}
				/>}
			</View>
		);
	};
}
