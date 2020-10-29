/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { View, Alert, Keyboard } from 'react-native';

import styles from './CreateQRPassword.styl';
import translate from "@src/locales/i18n";
import GradientContainer from "@src/components/organisms/SymbolGradientContainer";
import Input from "@src/components/atoms/Input";
import GradientButton from "@src/components/atoms/GradientButton";
import {passwordValidation} from "@src/utils/SymbolQR";
import {Router} from "@src/Router";
import store from "@src/store";

const testIDs = {
	password: 'input-wallet-name',
	confirmPassword: 'input-confirm-password',
	submitButton: 'button-submit',
};

class SetPassword extends Component<Props, State> {
	state = {
		password: '',
		confirmPassword: '',
	};

	handleInputChange = (inputName: string) => (text: string) => {
		this.setState({
			[inputName]: text,
		});
	};

	hideKeyboard = () => {
		try {
			Keyboard.dismiss();
		} catch (e) {}
	};

	handleSubmit = () => {
		const { password, confirmPassword } = this.state;
		if (password !== confirmPassword) {
			// TODO: inline error
			// TODO: localize error
			Alert.alert(
				translate('CreateWallet.SetPassword.alert'),
				translate('CreateWallet.SetPassword.alertPasswordConfirmation'),
				[
					{
						text: translate('CreateWallet.SetPassword.alertTextBack'),
						onPress: () => { },
					},
				],
				{ cancelable: false }
			);
		} else {
			try {
				Keyboard.dismiss();
				const passwordObject = passwordValidation(password);
				store.dispatch({type: 'wallet/setPassword', payload: password });
				Router.goToShowQRCode({}, this.props.componentId);
			} catch (error) {
				// TODO: localize
				Alert.alert(
					translate('CreateWallet.SetPassword.alert'),
					(''+ error.message) === 'Password must be at least 8 characters'
						? translate('CreateWallet.SetPassword.errorPasswordTooShort')
						: error.message,
					[
						{
							text: translate('CreateWallet.SetPassword.alertTextCancel'),
							onPress: () => { },
						},
					],
					{ cancelable: false }
				);
			}
		}
	};

	render() {
		const { isPasswordEncryptChecked, password, confirmPassword } = this.state;
		return (
			<GradientContainer
				start={{ x: 1, y: 0 }}
				end={{ x: 0, y: 1 }}
				angle={135}
				useAngle
				style={styles.gradientContainer}>
				<View style={styles.contentContainer}>
					<View style={styles.formContainer}>
						<Input
							inputLabel={translate('CreateWallet.SetPassword.inputPassword')}
							placeholder={translate('CreateWallet.SetPassword.inputPassword')}
							testID={testIDs.password}
							returnKeyType="next"
							value={password}
							onChangeText={this.handleInputChange('password')}
							onSubmitEditing={this.hideKeyboard}
							secureTextEntry
							editable={!isPasswordEncryptChecked}
						/>
						<Input
							inputLabel={translate('CreateWallet.SetPassword.inputConfirmPassword')}
							placeholder={translate('CreateWallet.SetPassword.inputConfirmPassword')}
							testID={testIDs.confirmPassword}
							returnKeyType="next"
							value={confirmPassword}
							onChangeText={this.handleInputChange('confirmPassword')}
							onSubmitEditing={this.hideKeyboard}
							secureTextEntry
							editable={!isPasswordEncryptChecked}
						/>
					</View>
					<GradientButton
						title={translate('CreateWallet.SetPassword.submitButton')}
						style={styles.button}
						testID={testIDs.submitButton}
						onPress={this.handleSubmit}
					/>
				</View>
			</GradientContainer>
		);
	}
}

export { testIDs };


export default SetPassword;
