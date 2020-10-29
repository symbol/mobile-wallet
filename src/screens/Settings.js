import React, { Component } from 'react';
import { View, Text } from 'react-native';
import translate from '@src/locales/i18n';
import styles from './Settings.styl';
import SettingsCurrencySelector from '@src/components/settings/SettingsCurrencySelector';
import SettingsLanguageSelector from '@src/components/settings/SettingsLanguageSelector';
import SettingsNotificationSelector from '@src/components/settings/SettingsNotificationSelector';
import SettingsPasscodeSelector from '@src/components/settings/SettingsPasscodeSelector';
import SettingsBackup from '@src/components/settings/SettingsBackup';
import SettingsAboutNem from '@src/components/settings/SettingsAboutNem';
import SettingsLogout from '@src/components/settings/SettingsLogout';
import SettingsNodeSelector from '@src/components/settings/SettingsNodeSelector';

export default class Settings extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.headerText} allowFontScaling={false}>
                    {translate('Settings.title')}
                </Text>
                <SettingsCurrencySelector />
                <SettingsLanguageSelector />
                <SettingsNotificationSelector />
                <SettingsPasscodeSelector />
                <SettingsNodeSelector />
                <SettingsBackup {...this.props} />
                <SettingsAboutNem />
                <SettingsLogout />
            </View>
        );
    }
}
