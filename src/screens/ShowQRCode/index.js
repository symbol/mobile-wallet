/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { View, Image } from 'react-native';
import styles from './ShowQRCode.styl';
import translate from '@src/locales/i18n';
import WizardStepView from '@src/components/organisms/WizardStepView';
import { Text } from '@src/components';
import { Router } from '@src/Router';
import store from '@src/store';
import { downloadFile } from '@src/utils/donwload';
import AccountService from '@src/services/AccountService';
import { getDefaultNetworkType } from '@src/config/environment';

class ShowQRCode extends Component {
    state = {
        base64QRData: '',
        showWarning: false,
        warningMessage: '',
        isButtonLoading: false,
        showErrorView: false,
        isLoading: false,
    };

    handleDownloadPaperWallet = async () => {
        const network = store.getState().network.selectedNetwork
            ? store.getState().network.selectedNetwork
            : { type: getDefaultNetworkType(), generationHash: 'no-chain-id' };
        this.setState({ isLoading: true });
        try {
            const paperWallet = await AccountService.generatePaperWallet(store.getState().wallet.mnemonic, [], network);
            const uniqueVal = new Date()
                .getTime()
                .toString()
                .slice(9);
            downloadFile(paperWallet, `symbol-wallet-${uniqueVal}.pdf`, 'base64')
                .then(() => {
                    this.setState({ isLoading: false });
                    this.handleSubmit();
                })
                .catch(() => {
                    this.setState({ isLoading: false });
                });
        } catch (e) {
            console.log(e);
            this.setState({ showErrorView: true });
        }
    };

    handleSubmit = () => {
        const { isBackup } = this.props;
        if (isBackup) {
            Router.goToDashboard({});
        } else {
            Router.goToWalletLoading({});
        }
    };

    hideWarning = () => {
        this.setState({ showWarning: false });
    };

    renderError = () => {
        const imgProps = { source: require('@src/assets/sad.png'), resizeMode: 'center' };
        return (
            <View style={styles.contentContainer}>
                <Image style={styles.qr} {...imgProps} />
                <Text style={styles.textContent}>
                    Unable to save paper wallet
                </Text>
            </View>
        );
    };

    render() {
        const { isLoading, showErrorView } = this.state;
        const buttons = [
            {
                title: translate('CreateWallet.ShowQRCode.downloadButton'),
                style: styles.button,
                onPress: this.handleDownloadPaperWallet,
                loading: isLoading,
                disabled: isLoading,
            },
        ];
        return (
            <WizardStepView title={translate('CreateWallet.ShowQRCode.title')} buttons={buttons} onBack={() => Router.goBack(this.props.componentId)}>
                <Text theme="dark" type="regular" align="center">
                    {translate('CreateWallet.ShowQRCode.description')}
                </Text>
                {showErrorView && this.renderError()}
            </WizardStepView>
        );
    }
}

export default ShowQRCode;
