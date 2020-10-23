import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { 
	Section, 
	GradientBackground,
	BalanceWidget,
	Text,
	PluginList,
	Col,
	Row
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
		backgroundColor: '#fffc'
	},
	list: {
		marginTop: 17,
		marginBottom: 80
	}
});

type Props = {};

type State = {};


export default class Home extends Component<Props, State> {
	state = {};

    render() {
		const {} = this.props;
		const {} = this.state;
		
        return (
			<GradientBackground name='mesh'>
				<Section type="title">
					<Text type='title'>Home</Text>
				</Section>
				<Section type="title">
					<Text type='subtitle'>Switch account button, qr, etc..</Text>
				</Section>
				<Col justify="space-around" style={{flex: 1}}>
					<Section type="center">
						<BalanceWidget/>
					</Section>
					<Section type="list">
						<PluginList />					
					</Section>
					<Section type="list" style={styles.list}>
						{/* TODO: move transaction preview to a separate component. Mockup */}
						<View style={styles.transactionPreview}>
							<Row justify="space-between">
								<Text type="regular" theme="light">Opt-in</Text>
								<Text type="regular" theme="light">23.10.2020 11:00</Text>
							</Row>
							<Row justify="space-between">
								<Text type="bold" theme="light">Post launch Opt-in</Text>
							</Row>
						</View>
						<View style={styles.transactionPreview}>
						<Row justify="space-between">
								<Text type="regular" theme="light">Multisig Transaction</Text>
								<Text type="regular" theme="light">23.10.2020 10:59</Text>
							</Row>
							<Row justify="space-between">
								<Text type="bold" theme="light">Awaiting your signature</Text>
							</Row>
						</View>
					</Section>
				</Col>
			</GradientBackground>
        );
    };
}
