import React, { Component } from 'react';
import { View } from 'react-native';
import SettingsListItem from '@src/components/settings/SettingsListItem';
import translate from '@src/locales/i18n';
import store from '@src/store';
import { connect } from 'react-redux';
import { Router } from '@src/Router';

class SettingsPasscodeSelector extends Component {
    state = {
        reflected: true,
    };

    onSelect = payload => {
        const setPasscode = () => {
            store
                .dispatchAction({type: 'settings/saveIsPasscodeSelected', payload: payload})
                .then(_ => {
                    this.setState({
                        reflected: !this.state.reflected,
                    });
                    Router.goToDashboard({});
                });
        };

        if (payload) {
            Router.showPasscode({
                disablePasscode: true,
                resetPasscode: true,
                onSuccess: setPasscode,
            });
        } else {
            Router.showPasscode({
                resetPasscode: false,
                onSuccess: setPasscode,
            });
        }
    };

    render() {
        const {isPasscodeSelected} = this.props.settings;
        return (
            <View>
                <SettingsListItem
                    title={
                        isPasscodeSelected
                            ? translate('Settings.passcode.turnOffPasscode')
                            : translate('Settings.passcode.turnOnPasscode')
                    }
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
    settings: state.settings,
}))(SettingsPasscodeSelector);
