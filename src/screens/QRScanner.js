import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown, Section, GradientBackground, TitleBar, Input, InputAddress, Text, Button } from '@src/components';
import { Router } from '@src/Router';
import { ContactQR, AddressQR, AccountQR, TransactionQR, QRCodeGenerator } from 'symbol-qr-library';
import { TransactionMapping, TransferTransaction } from "symbol-sdk";
import store from '@src/store';
import { isPrivateKeyValid } from '@src/utils/account';
import translate from "@src/locales/i18n";
import { connect } from 'react-redux';
import GlobalStyles from '@src/styles/GlobalStyles';

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
		hardcodedButtonCaption: ''
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

	parseScannedQR = res => {
		let text;
		let payload = {};
		let buttonCaption = '';
		let buttonAction;
		let hardcodedButtonCaption = '';

		this.setState({isLoading: true });

		try {
			console.log('res ==>', res)
			const data = JSON.parse(res.data);
			const type = data.type;
			
			switch(type) {
				case QR_TYPES.ADDRESS:
					payload = { recipientAddress: data.data.address, accountName: data.data.name };
					text = `This is  the Symbol Account Address QR code. The account name is: "${payload.accountName}". The address is: "${payload.recipientAddress}". Please select an action bellow.`
					buttonCaption = 'Send transfer';
					hardcodedButtonCaption = 'Add contact'
					buttonAction = () => { Router.goToSend(payload, this.props.componentId) };
				break;
				case QR_TYPES.TRANSACTION:
					//const parsed = TransactionQR.fromJSON(data, TransactionMapping.createFromPayload);
					const transaction: Transaction = TransactionMapping.createFromPayload(data.data.payload);
					const payload = {
						recipientAddress: transaction.recipientAddress.plain(),
						message: transaction.message.payload,
						mosaicName: transaction.mosaics[0].id.id.toHex(),
						amount: transaction.mosaics[0].amount.toString()
					};

					console.log('parsed ==>', payload)
					text = `This is the Transaction (Invoice) QR code. The recipient address is "${payload.recipientAddress}". Please select an action bellow.`
					buttonCaption = 'Send';
					buttonAction = () => { Router.goToSend(payload, this.props.componentId) };
				break;
				case QR_TYPES.PRIVAE_KEY:
					payload = { ...data, importMethod: 'privateKey' };
					text = `This is the Account Private Key QR code. You can add this account to the wallet by filling the Add Account Form.`
					buttonCaption = 'Open Form';
					buttonAction = () => { Router.goToCreateAccount(payload, this.props.componentId) };
				break;
				default: 
					text = 'Invalid QR code';
					buttonCaption = 'Go Back';
					buttonAction = () => { Router.goBack(this.props.componentId) };
			};

		} catch(e) {
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
			hardcodedButtonCaption
		} = this.state;


        return (
			<GradientBackground 
				dataManager={{ isLoading, isError, errorMessage }} 
				name="mesh_small_2" 
				theme="dark"
				titleBar={<TitleBar theme="dark" onBack={() => this.goBack()} title={'Scann QR'} />}
			>
                <Section type="form">
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
            </GradientBackground>
        );
    };
}

export default connect(state => ({
    accounts: state.wallet.accounts,
}))(CreateAccount);
