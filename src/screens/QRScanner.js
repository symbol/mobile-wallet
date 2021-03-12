import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import {
	Section,
	Icon,
	Text,
	SymbolPageView,
	Row
} from '@src/components';
import { Router } from '@src/Router';
import QRService from '@src/services/QRService';
import translate from "@src/locales/i18n";
import { connect } from 'react-redux';
import GlobalStyles from '@src/styles/GlobalStyles';
import PasswordModal from '@src/components/molecules/PasswordModal';
import { showMessage } from 'react-native-flash-message';
import store from "@src/store";


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
		flexShrink: 1,
		flexWrap: 'wrap',
	},
	buttonTextSmaller: {
		marginRight: 17
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
		payload: {},
		warning: ''
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
				message: translate('unsortedKeys.invalidPrivateKeyQROrPassword'),
				type: 'danger',
			});
		});
	};

	onSetPassword = (password) => {
		this.setState({showPasswordModal: false});
		this.parseScannedQR(this.state.res, password);
	};

	renderButton = (buttonName, payload, i, count) => {
		const buttonJustify = count === 1 ? 'center' : 'start';
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
			case 'broadcastSignedQR':
				action = () => {
					store.dispatchAction({ type: 'transfer/broadcastSignedTransaction', payload });
					Router.showFlashMessageOverlay().then(() => {
						showMessage({
							message: translate('unsortedKeys.announce_success'),
							type: 'success',
						});
					});
					Router.goBack(this.props.componentId);
				}
				text = translate('unsortedKeys.announceSignedTransaction');
				icon = 'send';
				break;
			case 'broadcastCoSignedQR':
				action = () => {
					store.dispatchAction({ type: 'transfer/broadcastCosignatureSignedTransaction', payload });
					Router.showFlashMessageOverlay().then(() => {
						showMessage({
							message: translate('unsortedKeys.announce_success'),
							type: 'success',
						});
					});
					Router.goBack(this.props.componentId);
				}
				text = translate('unsortedKeys.announceSignedTransaction');
				icon = 'send';
				break;
		}

		return (
			<Section
				type="form-item"
				style={count > 1 ? styles.buttonWrapper : styles.buttonWrapperLarger}
			>
				<TouchableOpacity
					style={styles.button}
					onPress={() => action()}
					activeOpacity={0.5}
				>
					<Row
						align="center"
						justify={buttonJustify}
						style={styles.buttonContent}
						fullWidth={count === 1}
					>
						<Icon
							size="small"
							name={icon}
							style={styles.buttonIcon}
						/>
						<Text
							type="bold"
							theme="light"
							style={[styles.buttonText, count > 1 && styles.buttonTextSmaller]}
							align={count === 1 ? 'center' : 'left'}
							wrap
						>
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
		let warning = '';

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
					text = translate(
						'unsortedKeys.accountAddressQRInfo',
						{
							accountName: payload.accountName,
							recipientAddress: payload.recipientAddress
						}
					);
					buttons = ['send', 'addContact'];
				break;
				case QRService.QRCodeType.RequestTransaction:
					payload = {
						...data,
						amount: '' + data.amount,
						mosaicName: data.mosaicId
					};
					title = translate('qr.transactionQr');
					text = translate(
						'unsortedKeys.invoiceTransactionQRInfo',
						{
							amount: data.amount,
							mosaicName: data.mosaicName,
							recipientAddress: payload.recipientAddress,
						}
					);
					buttons = ['send'];
					warning = data.warning;
				break;
				case QRService.QRCodeType.ExportAccount:
					payload = { ...data, importMethod: 'privateKey' };
					title = translate('qr.privateKeyQr');
					text = translate('unsortedKeys.accountPKQRInfo');
					buttons = ['addAccount'];
				break;
				case QRService.QRCodeType.SignedTransaction:
					payload = { ...data };
					title = translate('qr.signedQR');
					text = translate('unsortedKeys.signedTransactionQRInfo');
					buttons = ['broadcastSignedQR'];
				break;
				case QRService.QRCodeType.CosignatureSignedTransaction:
					payload = { ...data };
					title = translate('qr.signedQR');
					text = translate('unsortedKeys.signedTransactionQRInfo');
					buttons = ['broadcastCoSignedQR'];
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
			payload,
			warning
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
			payload,
			warning
		} = this.state;
		const buttonsJustify = buttons.length > 1 ? 'space-between' : 'center';

        return (
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
					{!!warning && <Section type="form-item">
						<Text theme="dark" type="warning">{translate('qr.' + warning)}</Text>
					</Section>}
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
        );
    };
}

export default connect(state => ({
	accounts: state.wallet.accounts,
	network: state.network.selectedNetwork,
}))(CreateAccount);
