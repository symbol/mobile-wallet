import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { 
	Section, 
	ImageBackground,
	Text,
	Row,
	TitleBar
} from '@src/components';
import translate from "@src/locales/i18n";
import { Router } from "@src/Router";
import store from '@src/store';


const styles = StyleSheet.create({
	transactionPreview: {
		width: '100%',
		height: 60,
		borderRadius: 6,
		marginTop: 4,
		marginBottom: 4,
		padding: 17,
		paddingTop: 8,
		backgroundColor: '#fff5'
	},
	list: {
		marginTop: 30
	}
});

type Props = {};

type State = {};


export default class History extends Component<Props, State> {
	state = {};

    render() {
		const {} = this.props;
		const {} = this.state;
		
        return (
			<ImageBackground name="tanker">
				<TitleBar
					theme="light"
					title="Transactions"
				/>
				<Section type="list" style={styles.list}>
					{/* TODO: move transaction preview to a separate component. Mockup */}
					<View style={styles.transactionPreview}>
						<Row justify="space-between">
							<Text type="regular" theme="light">Transfer</Text>
							<Text type="regular" theme="light">23.10.2020 11:00</Text>
						</Row>
						<Row justify="space-between">
							<Text type="bold" theme="light">Seed Account 1</Text>
							<Text type="bold" theme="light">-228</Text>
						</Row>
					</View>
					<View style={styles.transactionPreview}>
					<Row justify="space-between">
							<Text type="regular" theme="light">Transfer</Text>
							<Text type="regular" theme="light">23.10.2020 10:59</Text>
						</Row>
						<Row justify="space-between">
							<Text type="bold" theme="light">*A7DAE</Text>
							<Text type="bold" theme="light">133,567</Text>
						</Row>
					</View>
				</Section>
			</ImageBackground>
        );
    };
}
