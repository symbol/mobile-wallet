import React, { Props, Component } from 'react';
import { View,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity
} from 'react-native';
import translate from "@src/locales/i18n";
import GradientButton from "@src/components/atoms/GradientButton";
import GradientButtonLight from "@src/components/atoms/GradientButtonLight";
import SymbolGradientContainer from "@src/components/organisms/SymbolGradientContainer";
import FadeView from "@src/components/organisms/FadeView";
import Input from "@src/components/atoms/Input";
import {Router} from "@src/Router";
import store from '@src/store';
import AccountService from '@src/services/AccountService';

const styles = StyleSheet.create({
	mesh: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		width: '100%',
		height: undefined,
		resizeMode: 'contain',
		aspectRatio: 1
	},

	center: {
		alignSelf: 'center',
	},

	container: {
		flex: 1,
		width: '100%',
		justifyContent: 'space-between',
		color: '#ffffff',
		fontFamily: 'NotoSans',
		backgroundColor: '#f2f4f8'
	},

	pageContainer: {
		flex: 1,
		width: '100%',
		//padding: 34,
		justifyContent: 'space-between',
		color: '#ffffff',
		fontFamily: 'NotoSans'
	},

	scrollView: {
		paddingLeft: 34,
		paddingRight: 34,
	},

	simpleView: {
		paddingLeft: 34,
		paddingRight: 34,
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-around'
	},

	topBar: {
		marginTop: 42,
		marginBottom: 0,
		paddingLeft: 34,
		paddingRight: 34,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},

	topButtonContainer: {
		paddingTop: 20,
		paddingBottom: 20,
	},

	topButtons: {
		resizeMode: 'contain',
		width: 20,
		height: 20
	},

	settingsButton: {
		width: 16,
		height: 16,
		backgroundColor: '#0f05'
	},

	titleContainerRow: {
		marginBottom: 34,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end'
	},

	titleContainerColumn: {
		marginBottom: 34,
		width: '100%',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'flex-start'
	},

	titleTextDark: {
		color: '#ffffff',
		width: '100%',
		fontSize: 24,
		fontWeight: '100',
		fontFamily: 'NotoSans-SemiBold',
		flexWrap: 'wrap'
	},

	titleTextLight: {
		color: '#44004e',
		width: '70%',
		fontWeight: '100',
		fontSize: 24,
		fontFamily: 'NotoSans-SemiBold',
	},

	titleTextNoIcon: {
		width: '100%',
	},

	icon: {
		resizeMode: 'contain',
		width: 55,
		height: 55,
		alignSelf: 'center',
		//backgroundColor: '#f2000055'
	},

	iconAlignLeft: {
		marginTop: 65,
		marginBottom: 15,
		alignSelf: 'flex-start',
	},



	content: {
		width: '100%',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around'
	},

	footerEmpty: {
		margin: 0,
		marginTop: 34
	},

	footerBigger: {
		marginBottom: 68
	},

	footer: {
		margin: 34,
		marginTop: 32,
		marginBottom: 34
	},

	footerTitle: {
		textAlign: 'center',
		color: '#fff',
		marginTop: 10,
		marginBottom: 20,
		fontFamily: 'NotoSans-Regular',
		fontSize: 16,
	},

	button: {
		marginTop: 20,
	},

	loading: {
		height: 32,
		width: 32
	},

	error: {
		color: '#fffa',
		fontFamily: 'NotoSans-Bold',
		textAlign: 'center'
	}
});

const testIDs = {
	walletName: 'input-wallet-name',
	submitButton: 'button-submit',
};

class WalletName extends Component {
	state = {
		walletName: ''
	};

	handleInputChange = (walletName: string) => {
		this.setState({walletName})
	};

	handleSubmit = () => {
		const mnemonicModel = AccountService.createRandomMnemonic();
		store.dispatch({type: 'wallet/setName', payload: this.state.walletName });
		store.dispatch({type: 'wallet/setMnemonic', payload: mnemonicModel.mnemonic });
		Router.goToGenerateBackup({}, this.props.componentId);
	};

	isEmpty = (name: ?string) => {
		return name === null || name === '';
	};

	render() {
		const { walletName } = this.state;
		const buttons = [
			{
				disabled: this.isEmpty(walletName),
				testID: testIDs.submitButton,
				title: translate('CreateWallet.WalletName.submitButton'),
				onPress: this.handleSubmit,
			}
		];

		const theme ="dark";
		const title = translate('CreateWallet.WalletName.title');
		const icon = "wallet";
		const iconAlign = "left";
		const onBack = null;
		const onSettings = null;
		const footerTitle = null;



		const iconBackSrc = theme === 'light'
			? require('@src/assets/icons/back_light.png')
			: require('@src/assets/icons/back_dark.png');
		const iconSettingsSrc = theme === 'light'
			? require('@src/assets/icons/settings_light.png')
			: require('@src/assets/icons/settings_dark.png');


		const Title = (props) => {
			const titleContainertStyle = iconAlign === 'left'
				? styles.titleContainerColumn
				: styles.titleContainerRow;
			const titleTextStyle = theme === 'light'
				? styles.titleTextLight
				: styles.titleTextDark;

			let iconSrc;
			let iconSize = { width: 55, height: 55 };
			switch(icon) {
				case 'wallet':
					iconSrc = require('@src/assets/icons/wallet.png');
					iconSize.width = 55;
					iconSize.height = 40;
					break;
			}

			return (
				<View style={titleContainertStyle}>
					{iconSrc && iconAlign ==='left' && <Image style={[styles.icon, styles.iconAlignLeft, iconSize]} source={iconSrc} />}
					<Text style={[titleTextStyle, !iconSrc && styles.titleTextNoIcon]}>{title}</Text>
					{iconSrc && iconAlign !=='left' && <Image style={[styles.icon, iconSize]} source={iconSrc} />}
				</View>
			)
		}

		const Button = (props) => {
			if(theme === 'light')
				return <GradientButtonLight {...props} />
			return <GradientButton {...props} />
		};

		const footerStyle = buttons && buttons.length === 1 && [styles.footer, styles.footerBigger]

		return (
			<SymbolGradientContainer style={ styles.container }>
			<Image
				style={styles.mesh}
				source={require('@src/assets/background1.png')}
			/>
			<FadeView style={ styles.pageContainer }>
				<View style={styles.topBar}>
					{onBack && <TouchableOpacity style={styles.topButtonContainer} onPress={onBack}>
						<Image style={styles.topButtons} source={iconBackSrc} resizeMode="center" />
					</TouchableOpacity>}

					{onSettings && <TouchableOpacity style={styles.topButtonContainer} onPress={onSettings}>
						<Image style={[styles.topButtons]} source={iconSettingsSrc} resizeMode="center" />
					</TouchableOpacity>}
				</View>
				<ScrollView style={styles.scrollView}>
					<Title/>
					<View style={ styles.titleContainer }>
						{/* Title */}
					</View>
					<View style={ styles.content }>
						{/* Loading animation */}


						{/* Content */}
						<Input
							inputLabel={translate('CreateWallet.WalletName.inputLabel')}
							placeholder={translate('CreateWallet.WalletName.inputPlaceholder')}
							returnKeyType="next"
							onChangeText={this.handleInputChange}
							testID={testIDs.walletName}
							value={walletName}
						/>
					</View>
				</ScrollView>


				<View style={footerStyle}>
					{/* Footer title */}
					<Text style={styles.footerTitle}>{ footerTitle }</Text>

					{/* Buttons */}
					<Button
						style={ styles.buttons }
						title={ buttons[0].title }
						disabled={ buttons[0].disabled }
						isLoading={ buttons[0].isLoading }
						testID={ buttons[0].testID }
						icon={ buttons[0].icon }
						onPress={ buttons[0].onPress }
					/>
				</View>

			</FadeView>
			</SymbolGradientContainer>
		);
	}
}

export { testIDs };
export default WalletName;
