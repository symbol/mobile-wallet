import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Row, Col, Text } from '../../components';
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
				<Col style={{backgroundColor: '#f005'}}>
					<Row style={{backgroundColor: '#0f05'}}>
						<Text>
							First
						</Text>
						<Text>
							First
						</Text>
					</Row>
					<Row style={{backgroundColor: '#00f5'}}>
						<Text align="center">
							Second
						</Text>
					</Row>
				</Col>
			</View>
		);
	};
}
