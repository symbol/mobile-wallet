import React, { Component } from 'react';
import { View, Text } from 'react-native';
import translate from '@src/locales/i18n';
import styles from './Settings.styl';
import SettingsCurrencySelector from '@src/components/settings/SettingsCurrencySelector';
import SettingsLanguageSelector from '@src/components/settings/SettingsLanguageSelector';
import SettingsNotificationSelector from '@src/components/settings/SettingsNotificationSelector';

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
            </View>
        );
    }
}
