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


export default class BalanceWidget extends Component<Props, State> {
	state = { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]};

	// TODO: move http reqest to Services
	componentDidMount() {
		
	};

	render() {
		const { } = this.props;
		const { data } = this.state;

		const labels = [];

		return (
			<View style={styles.root}>
				
			</View>
		);
	};
}
