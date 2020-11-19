/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import translate from '@src/locales/i18n';
import QRScanner from '@src/components/atoms/QRScanner';
import { Router } from '@src/Router';
import store from '@src/store';
import { MnemonicQR } from 'symbol-qr-library';
import Input from '@src/components/atoms/Input';
import { Button, Title } from '@src/components';
import SymbolPageView from '@src/components/organisms/SymbolPageView';
import FadeView from '@src/components/organisms/FadeView';
import SymbolGradientContainer from '@src/components/organisms/SymbolGradientContainer';
import {createPasscode} from "@src/utils/passcode";

type State = {
    showWarning: boolean,
    encryptedQR: string,
    showPassword: boolean,
    wrongPassword: boolean,
    password: string,
};

const styles = StyleSheet.create({
    mesh: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '100%',
        height: undefined,
        resizeMode: 'contain',
        aspectRatio: 1,
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
        backgroundColor: '#f2f4f8',
    },

    pageContainer: {
        flex: 1,
        width: '100%',
        //padding: 34,
        justifyContent: 'space-between',
        color: '#ffffff',
        fontFamily: 'NotoSans',
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
        justifyContent: 'space-around',
    },

    topBar: {
        marginTop: 42,
        marginBottom: 0,
        paddingLeft: 34,
        paddingRight: 34,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    topButtonContainer: {
        paddingTop: 20,
        paddingBottom: 20,
    },

    topButtons: {
        resizeMode: 'contain',
        width: 20,
        height: 20,
    },

    settingsButton: {
        width: 16,
        height: 16,
        backgroundColor: '#0f05',
    },

    titleContainerRow: {
        marginBottom: 34,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },

    titleContainerColumn: {
        marginBottom: 34,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },

    titleTextDark: {
        color: '#ffffff',
        width: '100%',
        fontSize: 24,
        fontWeight: '100',
		fontFamily: 'NotoSans-SemiBold',
		fontWeight: '600',
        flexWrap: 'wrap',
    },

    titleTextLight: {
        color: '#44004e',
        width: '70%',
        fontWeight: '100',
        fontSize: 24,
		fontFamily: 'NotoSans-SemiBold',
		fontWeight: '600',
    },

    wrongPassword: {
        color: '#ee0000',
        fontSize: 16,
		fontFamily: 'NotoSans-SemiBold',
		fontWeight: '600',
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
        justifyContent: 'space-around',
    },

    footerEmpty: {
        margin: 0,
        marginTop: 34,
    },

    footerBigger: {
        marginBottom: 68,
    },

    footer: {
        margin: 34,
        marginTop: 32,
        marginBottom: 34,
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
        width: 32,
    },

    error: {
        color: '#fffa',
        fontFamily: 'NotoSans-Bold',
        textAlign: 'center',
    },
});

class ScanQRCode extends Component<Props, State> {
    static defaultProps = {
        cameraFadeIn: true,
        errorTitle: translate('ImportWallet.ShowQRCode.errorTitle'),
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            showWarning: false,
            encryptedQR: null,
            showPassword: false,
            wrongPassword: false,
            password: '',
        };
    }

    onRead = (res: any) => {
        const mnemonicData = res.data;
        // FIXME: Workaround for including legacy opt in QRs
        let mnemonicFixed = mnemonicData;
        try {
            const mnemonicObj = JSON.parse(mnemonicData);
            if (mnemonicObj.type === 6) {
                mnemonicObj.type = 5;
                mnemonicFixed = JSON.stringify(mnemonicObj);
            }
        } catch {
            return this.setState({ showWarning: true });
        }
        try {
            const mnemonicQR = MnemonicQR.fromJSON(mnemonicFixed);
            store.dispatch({ type: 'wallet/setName', payload: 'Root account' });
            store.dispatch({ type: 'wallet/setMnemonic', payload: mnemonicQR.mnemonicPlainText });
            createPasscode(this.props.componentId);
        } catch (e) {
            if (e.message === 'Could not parse mnemonic pass phrase.') {
                this.setState({ encryptedQR: mnemonicFixed, showPassword: true });
            } else {
                this.setState({ showWarning: true });
            }
        }
    };

    onCloseQR = () => {
        Router.goBack(this.props.componentId);
    };

    decryptQR = () => {
        const { password, encryptedQR } = this.state;
        try {
            const decryptedQR = MnemonicQR.fromJSON(encryptedQR, password);
            store.dispatch({ type: 'wallet/setName', payload: 'Root account' });
            store.dispatch({ type: 'wallet/setMnemonic', payload: decryptedQR.mnemonicPlainText });
            createPasscode(this.props.componentId);
        } catch {
            this.setState({ wrongPassword: true, password: '' });
        }
    };

    render() {
        const { showWarning, wrongPassword, showPassword, password } = this.state;
        if (showPassword) {
            return (
                <SymbolGradientContainer noPadding style={styles.container}>
                    <Image style={styles.mesh} source={require('@src/assets/background1.png')} />
                    <FadeView style={styles.pageContainer}>
                        <View style={styles.topBar}>
                            <TouchableOpacity style={styles.topButtonContainer} onPress={() => Router.goBack(this.props.componentId)}>
                                <Image style={styles.topButtons} source={require('@src/assets/icons/back_dark.png')} resizeMode="center" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.scrollView}>
                            <View style={styles.titleContainer} />
                            <View style={styles.content}>
                                {/* Loading animation */}

                                {/* Content */}
                                <Input
                                    inputLabel={'Enter password'}
                                    placeholder={'Enter password for qr'}
                                    returnKeyType="next"
                                    secureTextEntry={true}
                                    onChangeText={password => this.setState({ password })}
                                    value={password}
                                />
                                {wrongPassword && <Text style={styles.wrongPassword}>Wrong password</Text>}
                            </View>
                        </ScrollView>

                        <View style={styles.footer}>
                            {/* Buttons */}
                            <Button
                                style={styles.button}
                                title={'Decrypt QR'}
                                icon={require('@src/assets/icons/qr_light.png')}
                                onPress={() => this.decryptQR()}
                            />
                        </View>
                    </FadeView>
                </SymbolGradientContainer>
            );
        }
        if (showWarning) {
            return (
                <SymbolPageView
                    theme="dark"
                    title={'Invalid QR Code'}
                    icon="import"
                    iconAlign="right"
                    separateButtons
                    onBack={() => Router.goBack(this.props.componentId)}
                    isError={false}
                    buttons={[
                        {
                            title: translate('ImportWallet.ImportOptions.buttonTitleQr'),
                            style: styles.button,
                            onPress: () => this.setState({ showWarning: false }),
                            icon: require('@src/assets/icons/qr_light.png'),
                        },
                    ]}
                />
            );
        } else {
            return <QRScanner onDataHandler={this.onRead} closeFn={this.onCloseQR} />;
        }
    }
}

export default ScanQRCode;
