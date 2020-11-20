import React, { Component } from 'react';
import { View } from 'react-native';
import SettingsListItem from '@src/components/settings/SettingsListItem';
import translate from '@src/locales/i18n';
import store from '@src/store';
import { connect } from 'react-redux';
import { Router } from '@src/Router';

class SettingsPasscodeSelector extends Component {
    onSelect = payload => {
        const setPasscode = () => {
            store.dispatchAction({ type: 'settings/saveIsPasscodeSelected', payload: payload }).then(_ => {
                console.log('saved');
                Router.goToDashboard({});
            });
        };

        if (payload) {
            Router.showPasscode(
                {
                    resetPasscode: false,
                    onSuccess: setPasscode,
                },
                this.props.componentId
            );
        } else {
            Router.showPasscode(
                {
                    disablePasscode: true,
                    showCancel: true,
                    resetPasscode: false,
                    onSuccess: setPasscode,
                },
                this.props.componentId
            );
        }
    };

    render() {
        const { isPasscodeSelected } = this.props;
        return (
            <View>
                <SettingsListItem
                    title={isPasscodeSelected ? translate('Settings.passcode.turnOffPasscode') : translate('Settings.passcode.turnOnPasscode')}
                    icon={require('@src/assets/icons/ic-passcode.png')}
                    isSwitch={true}
                    itemValue={isPasscodeSelected}
                    onValueChange={this.onSelect}
                />
            </View>
        );
    }
}

export default connect(state => ({
    isPasscodeSelected: state.settings.isPasscodeSelected,
}))(SettingsPasscodeSelector);
