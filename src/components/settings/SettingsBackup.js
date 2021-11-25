import React, { Component } from 'react';
import { View } from 'react-native';
import SettingsListItem from '@src/components/settings/SettingsListItem';
import translate from '@src/locales/i18n';
import { Router } from '@src/Router';
import { showPasscode } from '@src/utils/passcode';

export default class SettingsBackup extends Component {
    onPress = () => {
        showPasscode(
            this.props.componentId,
            () =>
                setTimeout(() => {
                    Router.goToGenerateBackup(
                        { isBackup: true },
                        this.props.componentId
                    );
                }),
            500
        );
    };

    render() {
        return (
            <View>
                <SettingsListItem
                    title={translate('Settings.backup')}
                    icon={require('@src/assets/icons/ic-backup-white.png')}
                    onPress={this.onPress}
                />
            </View>
        );
    }
}
