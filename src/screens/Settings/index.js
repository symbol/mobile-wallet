import React, { Component } from 'react';
import { View, Text } from 'react-native';
import translate from '@src/locales/i18n';
import styles from './Settings.styl';
import { Router } from '@src/Router';

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
import SettingsNIS1NodeSelector from "@src/components/settings/SettingsNIS1NodeSelector";

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
				onBack={() => {Router.goBack(this.props.componentId)}}
			>
				<View style={styles.listContainer}>
					<SettingsLanguageSelector />
					<SettingsNIS1NodeSelector />
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
