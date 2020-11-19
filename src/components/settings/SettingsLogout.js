import React, { Component } from 'react';
import { View } from 'react-native';
import SettingsListItem from '@src/components/settings/SettingsListItem';
import translate from '@src/locales/i18n';
import GlobalStyles from '@src/styles/GlobalStyles';
import { Router } from '@src/Router';
import { logout } from '@src/App';
import { showPasscode } from '@src/utils/passcode';
import { call } from 'react-native-reanimated';

export default class SettingsLogout extends Component {
    onPress = () => {
        const callback = () => {
            logout().then(_ => {
                Router.goToCreateOrImport({});
            });
        };
        showPasscode(this.props.componentId, callback);
    };

    render() {
        return (
            <View>
                <SettingsListItem
                    title={translate('Settings.logout')}
                    icon={require('@src/assets/icons/ic-logout.png')}
                    color={GlobalStyles.color.PINK}
                    onPress={this.onPress}
                />
            </View>
        );
    }
}
