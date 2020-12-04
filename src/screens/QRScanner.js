import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown, Section, GradientBackground, TitleBar, Input, InputAddress, Text, Button } from '@src/components';
import { Router } from '@src/Router';
import store from '@src/store';
import { isPrivateKeyValid } from '@src/utils/account';
import translate from "@src/locales/i18n";
import { connect } from 'react-redux';
import GlobalStyles from '@src/styles/GlobalStyles';


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
		buttonAction: () => {}
    };

    goBack = () => {
        Router.goBack(this.props.componentId);
    };

	startScanner = () => {
		Router.scanQRCode(this.parseScannedQR, () => { Router.goBack(this.props.componentId); });
	};

	parseScannedQR = res => {
		console.log({res})
	};

    render = () => {
		const {  
			isLoading,
			isError,
			errorMessage,
			text,
			buttonCaption,
			buttonCaption
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
						<Text theme="light">{text}</Text>
					</Section>
						<Section type="form-bottom">
							<Button
								text={buttonCaption}
								theme="dark"
								onPress={() => buttonCaption()}
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
