import React, { Component } from 'react';
import { View, Text } from 'react-native';
import translate from '@src/locales/i18n';
import styles from './Settings.styl';
import { 
	SymbolPageView,
	SettingsCurrencySelector,
	SettingsLanguageSelector,
	SettingsNotificationSelector,
	SettingsPasscodeSelector,
	SettingsBackup,
	SettingsAboutNem,
	SettingsLogout,
	SettingsNodeSelector 
} from '@src/components';

export default class Settings extends Component {
    render() {
		const isLoading = false;
        return (
            <SymbolPageView
				theme="dark2"
				isFade
				isLoading={isLoading}
				title={ translate('Settings.title') }
				icon="settings"
				onBack={() => {}}
			>
                <SettingsCurrencySelector />
                <SettingsLanguageSelector />
                <SettingsNotificationSelector />
                <SettingsPasscodeSelector />
                <SettingsNodeSelector />
                <SettingsBackup {...this.props} />
                <SettingsAboutNem />
                <SettingsLogout />
            </SymbolPageView>
        );
    }
}
