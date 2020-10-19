import React, { Component } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import GlobalStyles from '../../styles/GlobalStyles';


const styles = StyleSheet.create({
	root: {
		marginLeft: 0,
		opacity: 0.8
	}
});

type Props = {};

type State = { data: any };


export default class Dashboard extends Component<Props, State> {
	state = { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]};

	// TODO: move http reqest to Services
	componentDidMount() {
		fetch('https://min-api.cryptocompare.com/data/histohour?fsym=XEM&tsym=USD&limit=168', {method: 'GET'})
			.then((response) => response.json())
			.then((responseJson) => {
				const data = responseJson.Data.map(el => el.close);
				this.setState({data});
			})
			.catch((error) => {
				console.error(error);
			});
	};

	render() {
		const { } = this.props;
		const { data } = this.state;

		const labels = [];

		return (
			<View style={styles.root}>
				<LineChart
					data={{
						labels,
						datasets: [{ data }]
					}}
					width={Dimensions.get("window").width + 30}
					height={220}
					chartConfig={{
						paddingRight: 300,
						backgroundGradientFrom: GlobalStyles.color.PRIMARY,
						backgroundGradientTo: GlobalStyles.color.SECONDARY,
						backgroundGradientFromOpacity: 0,
						backgroundGradientToOpacity: 0,
						decimalPlaces: 2, // optional, defaults to 2dp
						color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						labelColor: (opacity = 1) => `rgba(255, 255, 255, 0)`,
						strokeWidth: 1,
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
				/>
			</View>
		);
	};
}
