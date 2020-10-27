import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { 
	Section, 
	GradientBackground,
	Text,
	Row,
	TitleBar,
	Input
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
			<GradientBackground name="connector_small" theme="light">
				<TitleBar
					theme="light"
					onBack={()=>Router.goBack(this.props.componentId)}
					title="Send"
				/>
				<Section type="list" style={styles.list}>
					<Input 
						value="TDHGSJHDHJJDJ"
						placeholder="Recipient Address"
						theme="light"
					/>
					<Input 
						value="Symbol.XYM"
						placeholder="Mosaic"
						theme="light"
					/>
					<Input 
						value="121,456.18"
						placeholder="Amount"
						theme="light"
					/>
					<Input 
						value="0.5"
						placeholder="Fee"
						theme="light"
					/>
	
				</Section>
			</GradientBackground>
        );
    };
}
