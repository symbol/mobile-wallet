import React, { Component } from 'react';
import { View } from 'react-native';
import translate from '@src/locales/i18n';
import styles from './Settings.styl';
import { Router } from '@src/Router';
import {
	Section,
	SymbolPageView,
	SettingsLanguageSelector,
	SettingsPasscodeSelector,
	SettingsBackup,
	SettingsAboutNem,
	SettingsLogout,
	SettingsNodeSelector,
	Text
} from '@src/components';
import SettingsNIS1NodeSelector from "@src/components/settings/SettingsNIS1NodeSelector";
import packageJson from '../../../package.json';
import symbolSdkPackageJson from 'symbol-sdk/package.json';

export default class Settings extends Component {
    render() {
		const isLoading = false;
        return (
			<>
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
				<Section type="form" style={styles.versions}>
					<Text style={styles.appVersion}>
						Release: v{packageJson.version}
					</Text>
					<Text style={styles.sdkVersion}>
						Symbol SDK: v{symbolSdkPackageJson.version}
					</Text>
				</Section>
			</>
        );
    }
}
