import React, { Component } from 'react';
import { Linking, View } from 'react-native';
import SettingsListItem from '@src/components/settings/SettingsListItem';
import translate from '@src/locales/i18n';
import { getAboutURL } from '@src/config/environment';

export default class SettingsAboutNem extends Component {
    onPress = () => {
        Linking.openURL(getAboutURL());
    };

    render() {
        return (
            <View>
                <SettingsListItem
                    title={translate('Settings.aboutNem')}
                    icon={require('@src/assets/icons/ic-about.png')}
                    onPress={this.onPress}
                />
            </View>
        );
    }
}
