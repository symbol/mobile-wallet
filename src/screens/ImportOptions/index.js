/**
 * @format
 * @flow
 */

import React, { Component } from 'react';

import { Text } from 'react-native';

import styles from './ImportOptions.styl';
import translate from '@src/locales/i18n';
import SymbolPageView from '@src/components/organisms/SymbolPageView';
import { Router } from '@src/Router';

class ImportOptions extends Component<Props, State> {
    state = {
        error: '',
    };

    scanQR = () => {
        Router.goToScanQRCode({}, this.props.componentId);
    };

    enterMnemonic = () => {
        Router.goToEnterMnemonics({}, this.props.componentId);
    };

    render() {
        const { isLoading, error } = this.state;
        const buttons = [
            {
                title: translate(
                    'ImportWallet.ImportOptions.buttonTitleRestoreMnemonics'
                ),
                style: styles.button,
                onPress: this.enterMnemonic,
                icon: require('@src/assets/icons/mnemonics_light.png'),
            },
            {
                title: translate('ImportWallet.ImportOptions.buttonTitleQr'),
                style: styles.button,
                onPress: this.scanQR,
                icon: require('@src/assets/icons/qr_light.png'),
            },
        ];

        return (
            <SymbolPageView
                theme="dark"
                title={translate('ImportWallet.ImportOptions.title')}
                icon="import"
                iconAlign="right"
                buttons={buttons}
                onBack={() => Router.goBack(this.props.componentId)}
                separateButtons
                isError={!!error}
                errorMessage={error}
            >
                <Text style={styles.textContent}>
                    {translate('ImportWallet.ImportOptions.contentPlaceholder')}
                </Text>
            </SymbolPageView>
        );
    }
}

export default ImportOptions;
