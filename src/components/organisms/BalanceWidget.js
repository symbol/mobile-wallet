import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Section } from '../../components';
import GlobalStyles from '../../styles/GlobalStyles';


const styles = StyleSheet.create({
	root: {
		
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
