import React, { Component } from 'react';
import { View } from 'react-native';
import SettingsListItem from '@src/components/settings/SettingsListItem';
import translate from '@src/locales/i18n';
import GlobalStyles from '@src/styles/GlobalStyles';
import { Router } from '@src/Router';
import { logout } from '@src/App';
import { showPasscode } from '@src/utils/passcode';
import ConfirmModal from '@src/components/molecules/ConfirmModal';

export default class SettingsLogout extends Component {
    state = {
        isConfirmModalOpen: false,
        isConfirm2ModalOpen: false,
    };

    doLogout = () => {
        logout().then(_ => {
            Router.goToCreateOrImport({});
        });
    };

    show2confirmation = () => {
        this.setState({ isConfirmModalOpen: false, isConfirm2ModalOpen: true });
    };

    onPress = () => {
        const callback = () => {
            this.setState({ isConfirmModalOpen: true });
        };
        showPasscode(this.props.componentId, callback);
    };

    render() {
        const { isConfirmModalOpen, isConfirm2ModalOpen } = this.state;
        return (
            <View>
                <SettingsListItem
                    title={translate('Settings.logout')}
                    icon={require('@src/assets/icons/ic-logout.png')}
                    color={GlobalStyles.color.PINK}
                    onPress={this.onPress}
                />
                <ConfirmModal
                    isModalOpen={isConfirmModalOpen}
                    showTopbar={true}
                    title={translate('settings.logoutConfirmTitle')}
                    text={translate('settings.logoutConfirmDesc')}
                    showClose={false}
                    onClose={() => this.setState({ isConfirmModalOpen: false })}
                    onSuccess={() => this.show2confirmation()}
                />
                <ConfirmModal
                    isModalOpen={isConfirm2ModalOpen}
                    showTopbar={true}
                    title={translate('settings.logoutConfirm2Title')}
                    text={translate('settings.logoutConfirm2Desc')}
                    showClose={false}
                    onClose={() => this.setState({ isConfirm2ModalOpen: false })}
                    onSuccess={() => this.doLogout()}
                />
            </View>
        );
    }
}
