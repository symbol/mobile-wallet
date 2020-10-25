/**
 * @format
 * @flow
 */
import React, { Component } from 'react';
import { Text } from 'react-native';

import styles from './GenerateBackup.styl';
import translate from "../locales/i18n";
import SymbolPageView from "../components/organisms/SymbolPageView";
import {Router} from "../Router";

const testIDs = {
	buttonMnemonic: 'button-mnemonic',
	buttonQR: 'button-qr',
	buttonDashboard: 'button-dashboard',
};

class GenerateBackup extends Component {

	handleMnemonicBackup = () => {
		Router.goToShowMnemonics({}, this.props.componentId);
	};

	handleQRBackup = () => {
		Router.goToCreateQRPassword({}, this.props.componentId);
	};

	render() {
		const buttons = [
			{
				title: translate('CreateWallet.GenerateBackup.mnemonicButton'),
				style: styles.button,
				onPress: this.handleMnemonicBackup,
				testID: testIDs.buttonMnemonic,
				icon: require('../assets/icons/mnemonics_light.png'),
			},
			{
				title: translate('CreateWallet.GenerateBackup.QRButton'),
				style: styles.button,
				onPress: this.handleQRBackup,
				testID: testIDs.buttonQR,
				icon: require('../assets/icons/qr_light.png'),
			}
		];

		return (
			<SymbolPageView
				title={ translate('CreateWallet.GenerateBackup.title') }
				buttons={ buttons }
				separateButtons
				icon="security"
				theme="dark"
			>
				<Text style={styles.textContent}>
					{translate('CreateWallet.GenerateBackup.description')}
				</Text>
			</SymbolPageView>
		);
	}
}

export { testIDs };

export default GenerateBackup;
