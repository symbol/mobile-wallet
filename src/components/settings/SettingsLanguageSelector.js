import React, { Component } from 'react';
import { BackHandler, View } from 'react-native';
import SettingsListItem from '@src/components/settings/SettingsListItem';
import { Dropdown } from '@src/components';
import translate, { languageNames } from '@src/locales/i18n';
import store from '@src/store';
import { getDropdownListFromObjct } from '@src/utils';
import { connect } from 'react-redux';
import { Router } from '@src/Router';

class SettingsLanguageSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: languageNames,
            isBoxOpen: false,
        };
    }

    closeModal = () => {
        this.setState({
            isBoxOpen: false,
        });
    };

    openModal = () => {
        this.setState({
            isBoxOpen: true,
        });
    };

    onSelectLanguage = language => {
        store
            .dispatchAction({
                type: 'settings/saveSelectedLanguage',
                payload: language,
            })
            .then(_ => {
                this.closeModal();
                Router.goToDashboard({});
            });
    };

    render() {
        const { data, isBoxOpen } = this.state;
        const { selectedLanguage } = this.props.settings;
        const list = getDropdownListFromObjct(data);

        return (
            <View>
                <Dropdown
                    list={list}
                    title={translate('Settings.language.title')}
                    value={selectedLanguage}
                    onChange={this.onSelectLanguage}
                >
                    <SettingsListItem
                        title={translate('Settings.language.title')}
                        icon={require('@src/assets/icons/ic-language.png')}
                        isSelector={true}
                        isDropdown={true}
                        itemValue={selectedLanguage}
                        onPress={this.openModal}
                    />
                </Dropdown>
            </View>
        );
    }
}

export default connect(state => ({
    settings: state.settings,
}))(SettingsLanguageSelector);
