import React, { Component } from 'react';
import { View } from 'react-native';
import translate from '@src/locales/i18n';
import styles from './Settings.styl';
import { Router } from '@src/Router';

import {
    SettingsAboutNem,
    SettingsBackup,
    SettingsLanguageSelector,
    SettingsLogout,
    SettingsNodeSelector,
    SettingsPasscodeSelector,
    SymbolPageView,
} from '@src/components';

export default class Settings extends Component {
    render() {
        const isLoading = false;
        return (
            <SymbolPageView
                theme="dark2"
                isFade
                isLoading={isLoading}
                title={translate('Settings.title')}
                icon="settings"
                onBack={() => {
                    Router.goBack(this.props.componentId);
                }}
            >
                <View style={styles.listContainer}>
                    <SettingsLanguageSelector />
                    <SettingsPasscodeSelector {...this.props} />
                    <SettingsNodeSelector />
                    <SettingsBackup {...this.props} />
                    <SettingsAboutNem />
                    <SettingsLogout {...this.props} />
                </View>
            </SymbolPageView>
        );
    }
}
