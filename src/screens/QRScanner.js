import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { 
	Dropdown, 
	Section, 
	GradientBackground, 
	TitleBar, 
	Input, 
	InputAddress, 
	Text, 
	Button,
	SymbolPageView
} from '@src/components';
import { Router } from '@src/Router';
import { ContactQR, AddressQR, AccountQR, TransactionQR, QRCodeGenerator } from 'symbol-qr-library';
import { TransactionMapping, TransferTransaction } from "symbol-sdk";
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
	}
});

class CreateAccount extends Component {
    state = {
        isLoading: false,
		isError: false,
		errorMessage: '',
		text: '',
		buttonCaption: '',
		buttonAction: () => {},
		hardcodedButtonCaption: '',
		showPasswordModal: false,
		res: null
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

	parseScannedQR = async (res, password) => {
		let text;
		let payload = {};
		let buttonCaption = '';
		let buttonAction;
		let hardcodedButtonCaption = '';

		this.setState({isLoading: true });

		try {
			const type = QRService.getQrType(res);
			console.log('start', type, QRService.QRCodeType.ExportAccount)
			const data = await QRService.parseQrJson(res, this.props.network, password);
			console.log(data);
			if(data.type === 'error')
				throw Error(data.error)
			switch(type) {
				case QRService.QRCodeType.AddContact:
				case QRService.QRCodeType.ExportAddress:
					payload = { 
						recipientAddress: data.address, 
						accountName: data.name 
					};
					text = `This is  the Symbol Account Address QR code. The account name is: "${payload.accountName}". The address is: "${payload.recipientAddress}". Please select an action bellow.`
					buttonCaption = 'Send transfer';
					hardcodedButtonCaption = 'Add contact'
					buttonAction = () => { Router.goToSend(payload, this.props.componentId) };
				break;
				case QRService.QRCodeType.RequestTransaction:
					payload = {
						...data,
						amount: '' + data.amount
					};
					console.log('transaction ==>', payload)
					text = `This is the Transaction (Invoice) QR code. Do you want to send ${payload.amount} ${payload.mosaicName} to an address "${payload.recipientAddress}"?`
					buttonCaption = 'Send';
					buttonAction = () => { Router.goToSend(payload, this.props.componentId) };
				break;
				case QRService.QRCodeType.ExportAccount:
					payload = { ...data, importMethod: 'privateKey' };
					text = `This is the Account Private Key QR code. You can add this account to the wallet by filling the Add Account Form.`
					buttonCaption = 'Open Form';
					buttonAction = () => { Router.goToCreateAccount(payload, this.props.componentId) };
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
			buttonCaption,
			buttonAction,
			hardcodedButtonCaption,
			text,
		});
	};

    render = () => {
		const {  
			isLoading,
			isError,
			errorMessage,
			text,
			buttonCaption,
			buttonAction,
			hardcodedButtonCaption,
			showPasswordModal
		} = this.state;


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
				title={ 'Invoice QR' }
				icon="qr_scanner"
				onBack={() => this.goBack()}
				noScroll

			>
                <Section type="form" style={{padding: 0}}>
                    <Section type="form-item">
						<Text theme="dark" type="regular">{text}</Text>
					</Section>
					<Section type="form-bottom">
						{!!hardcodedButtonCaption && <Section type="form-item">
							<Button
								text={hardcodedButtonCaption}
								theme="dark"
								isDisabled={true}
							/>
						</Section>}
						<Button
							text={buttonCaption}
							theme="dark"
							onPress={() => buttonAction()}
						/>
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
