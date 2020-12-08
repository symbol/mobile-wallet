import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { 
	Dropdown, 
	Section, 
	GradientBackground, 
	TitleBar, 
	Icon,
	Input, 
	InputAddress, 
	Text, 
	Button,
	SymbolPageView,
	Row
} from '@src/components';
import { Router } from '@src/Router';
import QRService from '@src/services/QRService';
import store from '@src/store';
import { isPrivateKeyValid } from '@src/utils/account';
import translate from "@src/locales/i18n";
import { connect } from 'react-redux';
import GlobalStyles from '@src/styles/GlobalStyles';
import PasswordModal from '@src/components/molecules/PasswordModal';
import { showMessage } from 'react-native-flash-message';

const QR_TYPES = {
	PRIVAE_KEY: 2,
	TRANSACTION: 3,
	ADDRESS: 7
};

const styles = StyleSheet.create({
	warning: {
		color: GlobalStyles.color.RED
	},

	buttonWrapper: {
		width: '45%',
	},

	buttonWrapperLarger: {
		width: '60%',
	},

	button: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 6,
		backgroundColor: GlobalStyles.color.DARKWHITE,
		flexDirection: 'row',
		//marginHorizontal: 8,
		backgroundColor: GlobalStyles.color.DARKWHITE,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
		elevation: 2,
		alignItems: 'center'
	},
	buttonContent: {
		height: 40, 
	},
	buttonText: {
		lineHeight: 14,
		width: '80%'
	},
	buttonIcon: {
		marginRight: 12,
	}
});

class CreateAccount extends Component {
    state = {
		title: translate('qr.scannerTitle'),
        isLoading: false,
		isError: false,
		errorMessage: '',
		text: '',
		buttonCaption: '',
		buttonAction: () => {},
		hardcodedButtonCaption: '',
		showPasswordModal: false,
		res: null,
		buttons: [],
		payload: {}
	};
	
	componentDidMount = () => {
		this.startScanner();
	};

    goBack = () => {
        Router.goBack(this.props.componentId);
    };

	startScanner = () => {
		Router.scanQRCode(this.parseScannedQR, () => { Router.goBack(this.props.componentId); });
	};

	showDecryptErrorMessage = () => {
		Router.showFlashMessageOverlay().then(() => {
			showMessage({
				message: `Invalid private key QR or password!`,
				type: 'danger',
			});
		});
	};

	onSetPassword = (password) => {
		this.setState({showPasswordModal: false});
		this.parseScannedQR(this.state.res, password);
	};

	renderButton = (buttonName, payload, i, count) => {
		let text = '';
		let action = () => {};
		let icon;

		switch(buttonName) {
			case 'send':
				action = () => Router.goToSend(payload, this.props.componentId);
				text = 'Send Transfer';
				icon = 'history';
				break;
			case 'addAccount':
				action = () => Router.goToCreateAccount(payload, this.props.componentId);
				text = 'Add Account';
				icon = 'wallet_filled_light';
				break;
			case 'addContact':
				action = () => Router.goToAddContact(payload, this.props.componentId);
				text = 'Add Contact';
				icon = 'contact_light';
				break;
		}

		return (
			<Section type="form-item" style={count > 1 ? styles.buttonWrapper : styles.buttonWrapperLarger}>
				<TouchableOpacity style={styles.button} onPress={() => action()} activeOpacity={0.5}>
					<Row align="center" style={styles.buttonContent}>
						<Icon size="small" name={icon} style={styles.buttonIcon}/>
						<Text type="bold" theme="light" style={styles.buttonText} wrap>
							{text.toUpperCase()}
						</Text>
					</Row>
					
				</TouchableOpacity>
			</Section>
		)
	};

	parseScannedQR = async (res, password) => {
		let text;
		let title = translate('qr.scannerTitle');
		let payload = {};
		let buttons = [];

		this.setState({isLoading: true });

		try {
			const type = QRService.getQrType(res);
			console.log('QR response',res)
			const data = await QRService.parseQrJson(res, this.props.network, password);
			console.log(data);
			if(data.type === 'error')
				throw Error(data.error)
			switch(type) {
				case QRService.QRCodeType.AddContact:
				case QRService.QRCodeType.ExportAddress:
					payload = { 
						...data,
						recipientAddress: data.address, 
						accountName: data.name 
					};
					title = translate('qr.addressQr');
					text = `This is  the Symbol Account Address QR code. The account name is: "${payload.accountName}". The address is: "${payload.recipientAddress}". Please select an action bellow.`
					buttons = ['send', 'addContact'];
				break;
				case QRService.QRCodeType.RequestTransaction:
					payload = {
						...data,
						amount: '' + data.amount,
						mosaicName: data.mosaicId
					};
					title = translate('qr.transactionQr');
					text = `This is the Transaction (Invoice) QR code. Do you want to send ${data.amount} ${data.mosaicName} to an address "${payload.recipientAddress}"?`
					buttons = ['send'];
				break;
				case QRService.QRCodeType.ExportAccount:
					payload = { ...data, importMethod: 'privateKey' };
					title = translate('qr.privateKeyQr')
					text = `This is the Account Private Key QR code. You can add this account to the wallet by filling the Add Account Form.`
					buttons = ['addAccount'];
				break;
				default: 
					text = 'Unsupported QR code';
					buttonCaption = 'Go Back';
					buttonAction = () => { this.goBack() };
			};

		} catch(e) {
			if(e.message === 'No password')
				this.setState({showPasswordModal: true, res});
			else
			if(e.message === 'Invalid password') {
				this.setState({showPasswordModal: true, res});
				this.showDecryptErrorMessage();
			}
			else
				this.setState({isError: true, errorMessage: e.message});
		}
		this.setState({
			isLoading: false,
			title,
			text,
			buttons,
			payload
		});
	};

    render = () => {
		const {  
			title,
			isLoading,
			isError,
			errorMessage,
			text,
			showPasswordModal,
			buttons,
			payload
		} = this.state;
		const buttonsJustify = buttons.length > 1 ? 'space-between' : 'center';

        return (
			// <GradientBackground 
			// 	dataManager={{ isLoading, isError, errorMessage }} 
			// 	name="mesh_small_2" 
			// 	theme="dark"
			// 	titleBar={<TitleBar theme="dark" onBack={() => this.goBack()} title={'Scann QR'} />}
			// >
			<SymbolPageView
				theme="dark"
				isFade
				isLoading={isLoading}
				isError={isError}
				errorMessage={errorMessage}
				title={title}
				icon="qr_scanner"
				onBack={() => this.goBack()}
				noScroll
			>
                <Section type="form-without-padding" isScrollable>
                    <Section type="form-item">
						<Text theme="dark" type="regular">{text}</Text>
					</Section>
					<Section type="form-bottom">
						<Row wrap justify={buttonsJustify}>
							{buttons.map((button, index) => this.renderButton(button, payload, index, buttons.length))}
						</Row>
					</Section>
                </Section>
				<PasswordModal
					showModal={showPasswordModal}
					title={'Decrypt QR'}
					onSubmit={this.onSetPassword}
					onClose={() => this.goBack()}
				/> 
			</SymbolPageView> 
            // </GradientBackground>
        );
    };
}

export default connect(state => ({
	accounts: state.wallet.accounts,
	network: state.network.selectedNetwork,
}))(CreateAccount);
