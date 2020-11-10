/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Text, View, Image, PermissionsAndroid, ToastAndroid, Platform } from 'react-native';

import { SvgXml } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';
import { captureRef } from 'react-native-view-shot';
import RNFetchBlob from 'rn-fetch-blob';
import styles from './ShowQRCode.styl';
import translate from '@src/locales/i18n';
import { generateMnemonicQR } from '@src/utils/SymbolQR';
import WizardStepView from '@src/components/organisms/WizardStepView';
import Warning from '@src/components/atoms/Warning';
import { Router } from '@src/Router';
import store from '@src/store';

const testIDs = {
    qrImage: 'image-qr-code',
    downloadButton: 'button-submit',
    dashboardButton: 'button-dashboard',
    error: 'error-view',
    errorMessage: 'error-message',
};

class ShowQRCode extends Component {
    state = {
        base64QRData: '',
        showWarning: false,
        warningMessage: '',
        isButtonLoading: false,
        showErrorView: false,
        isQrDownloaded: false,
    };

    viewShotRef: any;

    requestWritePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                title: translate('CreateWallet.ShowQRCode.permissionTitle'),
                message: translate('CreateWallet.ShowQRCode.permissionMessage'),
                buttonNegative: translate('CreateWallet.ShowQRCode.permissionTextCancel'),
                buttonPositive: translate('CreateWallet.ShowQRCode.permissionTextOk'),
            });
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return this.downloadFile();
            } else {
                ToastAndroid.showWithGravityAndOffset(translate('CreateWallet.ShowQRCode.downloadFailed'), ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50);
            }
        } catch (err) {
            console.log(err);
        }
    };

    handleDownloadQR = async () => {
        if (Platform.OS === 'ios') {
            this.downloadFileIOS().then(() => (this.state.isQrDownloaded ? this.handleSubmit() : 0));
        } else {
            await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
                .then(value => {
                    if (value) return this.downloadFile();
                    else return this.requestWritePermission();
                })
                .then(() => (this.state.isQrDownloaded ? this.handleSubmit() : 0));
        }
    };

    downloadFile = () => {
        this.setState({
            isButtonLoading: true,
        });
        const { dirs } = RNFetchBlob.fs;

        return this.viewShotRef
            .capture()
            .then(async uri => {
                this.setState({
                    isButtonLoading: false,
                });
                RNFetchBlob.fs.writeFile(`${dirs.DownloadDir}/symbol-wallet-access-qr.png`, uri, 'uri');
            })
            .then(() => {
                ToastAndroid.showWithGravityAndOffset(
                    `Wallet Mnemonic QR code has saved to ${dirs.DownloadDir}`,
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );
                this.setState({
                    isQrDownloaded: true,
                });
            })
            .catch(err => {
                this.setState({
                    isButtonLoading: false,
                });

                console.log(err);
                ToastAndroid.showWithGravityAndOffset(
                    translate('CreateWallet.ShowQRCode.unableToCreateSnapShot'),
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );
            });
    };

    downloadFileIOS = () => {
        this.setState({
            isButtonLoading: true,
        });
        const { dirs } = RNFetchBlob.fs;

        return captureRef(this.viewShotRef)
            .then(async uri => {
                this.setState({
                    isButtonLoading: false,
                });
                RNFetchBlob.fs.writeFile(`${dirs.DocumentDir}/symbol-wallet-access-qr.png`, uri, 'uri');
            })
            .then(() => {
                this.setState({
                    isQrDownloaded: true,
                });
            })
            .catch(err => {
                this.setState({
                    isButtonLoading: false,
                });

                console.log(err);
            });
    };

    handleSubmit = () => {
        Router.goToWalletLoading({});
    };

    componentDidMount = () => {
        const { mnemonic, password } = store.getState().wallet;
        generateMnemonicQR(mnemonic, password).subscribe(
            base64Data => {
                if (base64Data !== null) {
                    this.setState({
                        base64QRData: base64Data,
                    });
                } else {
                    this.setState({
                        showErrorView: true,
                    });
                }
            },
            () =>
                this.setState({
                    showErrorView: true,
                })
        );
    };

    onViewShotRef = (ref: any) => {
        if (ref) {
            this.viewShotRef = ref;
        }
    };

    renderQR = () => {
        const { base64QRData } = this.state;
        const imgProps = base64QRData === '' ? { source: require('@src/assets/loader.gif'), resizeMode: 'center' } : { xml: base64QRData };
        return (
            <View style={styles.contentContainer}>
                {imgProps.xml ? (
                    <ViewShot ref={this.onViewShotRef}>
                        <SvgXml testID={testIDs.qrImage} style={styles.qr} xml={imgProps.xml} width="240px" height="240px" />
                    </ViewShot>
                ) : (
                    <Image testID={testIDs.qrImage} style={styles.qr} {...imgProps} />
                )}
                <Text style={styles.textContent}>{translate('CreateWallet.ShowQRCode.description')}</Text>
            </View>
        );
    };

    hideWarning = () => {
        this.setState({ showWarning: false });
    };

    renderError = () => {
        const imgProps = { source: require('@src/assets/sad.png'), resizeMode: 'center' };
        return (
            <View style={styles.contentContainer}>
                <Image style={styles.qr} {...imgProps} />
                <Text style={styles.textContent} testID={testIDs.errorMessage}>
                    Unable to load QR code
                </Text>
            </View>
        );
    };

    render() {
        const { showWarning, warningMessage, isButtonLoading, showErrorView } = this.state;
        const buttons = [
            {
                testID: testIDs.downloadButton,
                title: translate('CreateWallet.ShowQRCode.downloadButton'),
                style: styles.button,
                onPress: this.handleDownloadQR,
                loading: isButtonLoading,
                disabled: isButtonLoading,
            },
        ];
        return (
            <WizardStepView title={translate('CreateWallet.ShowQRCode.title')} buttons={buttons} onBack={() => Router.goBack(this.props.componentId)}>
                {showWarning && (
                    <Warning
                        hideWarning={this.hideWarning}
                        onIgnore={this.hideWarning}
                        message={warningMessage}
                        okButtonText={translate('ImportWallet.EnterMnemonics.ignoreWarning')}
                    />
                )}
                {showErrorView ? this.renderError() : this.renderQR()}
            </WizardStepView>
        );
    }
}

export { testIDs };

export default ShowQRCode;
