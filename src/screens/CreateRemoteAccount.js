/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {Text, View, BackHandler, StyleSheet} from 'react-native';
import RadioForm, { RadioButton, RadioButtonInput } from 'react-native-simple-radio-button';
import Input from "@src/components/atoms/Input";
import GradientButton from "@src/components/atoms/GradientButton";
import translate from "@src/locales/i18n";
import TitleBar from "@src/components/atoms/TitleBar";
import {Router} from "@src/Router";
import store from "@src/store";
import {linkRemoteAccount } from "@src/utils/SymbolHarvesting";
import {Account, NetworkType} from "symbol-sdk";
import {createAccountFromMnemonic} from "@src/utils/SymbolMnemonic";

type State = { nodeUrl: string, error: string };
let hardcodedNodeUrl = 'http://api-01.us-east-1.0.10.0.x.symboldev.network:3000';

const testIDs = {
	submitButton: 'register-button',
	account: 'account',
	fee: 'fee',
};

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		paddingTop: 20,
		marginTop: 10,
		flexDirection: 'column',
		width: '100%',
		backgroundColor: '#ffffff',
		height: '80%',
	},
	button: {
		margin: 'auto',
		marginTop: 120,
		marginBottom: 120,
	}

});

class CreateRemoteAccount extends Component<Props, State> {
	state: State;
	backHandler: any;

	constructor(props: Props) {
		super(props);

		this.state = {
			nodeUrl: '',
			error: '',
		};
	}

	handleInputChange = (textValue: string) => {
		this.setState({
			error: '',
			nodeUrl: textValue,
		});
	};

	handleSubmit = () => {
		const { nodeUrl } = this.state;
		const mnemonic = store.getState().wallet.mnemonic;
		const mainAccount = createAccountFromMnemonic(mnemonic, NetworkType.TEST_NET)
		const networkType = NetworkType.TEST_NET;
		const remoteAccount = Account.generateNewAccount(networkType); // TODO: save remoteAccount
		linkRemoteAccount(mainAccount, remoteAccount, hardcodedNodeUrl); // TODO: use nodeUrl
		console.log(mainAccount);
		console.log(remoteAccount);
		Router.goToStartHarvesting({ mainAccount, remoteAccount }, this.props.componentId);

	};

	render() {
		const {} = this.props;
		const { nodeUrl } = this.state;

		return (
			<View>
				<TitleBar
					showBack
					onBack={()=>Router.goBack(this.props.componentId)}
					title={translate('Harvest.CreateRemoteAccount.title')}
					theme="dark"
				/>
				<View tyle={styles.contentContainer}>
					<RadioForm >
						<RadioButton labelHorizontal>
							<Input
								placeholder="Enter custom IP"
								testID={testIDs.fee}
								returnKeyType="next"
								value={nodeUrl}
								keyboardType="default"
								onChangeText={value => this.handleInputChange(value)}
								align="left"
							/>
						</RadioButton>
					</RadioForm>
					<GradientButton
						testID={testIDs.submitButton}
						title={translate('Harvest.CreateRemoteAccount.submitButton')}
						style={styles.button}
						onPress={this.handleSubmit}
					/>
				</View>
			</View>
		);
	}
}

export default CreateRemoteAccount;