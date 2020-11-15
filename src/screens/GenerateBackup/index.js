/**
 * @format
 * @flow
 */
import React, { Component } from 'react';
import { Text } from 'react-native';

import styles from './GenerateBackup.styl';
import translate from '@src/locales/i18n';
import SymbolPageView from '@src/components/organisms/SymbolPageView';
import { Router } from '@src/Router';

const testIDs = {
    buttonMnemonic: 'button-mnemonic',
    buttonQR: 'button-qr',
    buttonDashboard: 'button-dashboard',
};

class GenerateBackup extends Component {
    handleMnemonicBackup = () => {
        const { isBackup } = this.props;
        Router.goToShowMnemonics({ isBackup }, this.props.componentId);
    };

    handleQRBackup = () => {
        const { isBackup } = this.props;
        Router.goToCreateQRPassword({ isBackup }, this.props.componentId);
    };

    render() {
        const buttons = [
            {
                title: translate('CreateWallet.GenerateBackup.mnemonicButton'),
                style: styles.button,
                onPress: this.handleMnemonicBackup,
                testID: testIDs.buttonMnemonic,
                icon: require('@src/assets/icons/mnemonics_light.png'),
            },
            {
                title: translate('CreateWallet.GenerateBackup.QRButton'),
                style: styles.button,
                onPress: this.handleQRBackup,
                testID: testIDs.buttonQR,
                icon: require('@src/assets/icons/qr_light.png'),
            },
        ];

        return (
            <SymbolPageView title={translate('CreateWallet.GenerateBackup.title')} buttons={buttons} separateButtons icon="security" theme="dark">
                <Text style={styles.textContent}>{translate('CreateWallet.GenerateBackup.description')}</Text>
            </SymbolPageView>
        );
    }
}

export { testIDs };

export default GenerateBackup;
