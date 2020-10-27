import React, { Component } from 'react';
import { View } from 'react-native';
import SettingsListItem from '@src/components/settings/SettingsListItem';
import ModalSelector from '@src/components/organisms/ModalSelector';
import translate, { getLocales } from '@src/locales/i18n';
import store from '@src/store';
import { connect } from 'react-redux';

class SettingsLanguageSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: getLocales(),
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
            .dispatchAction({ type: 'settings/saveSelectedLanguage', payload: language })
            .then(_ => this.closeModal());
    };

    render() {
        const { data, isBoxOpen } = this.state;
        const { selectedLanguage } = this.props.settings;

        return (
            <View>
                <SettingsListItem
                    title={translate('Settings.language.title')}
                    icon={require('../../assets/icons/ic-language.png')}
                    isSelector={true}
                    itemValue={selectedLanguage}
                    onPress={this.openModal}
                />
                <ModalSelector
                    data={data}
                    selectedItem={selectedLanguage}
                    isModalOpen={isBoxOpen}
                    onClose={this.closeModal}
                    onSelect={this.onSelectLanguage}
                />
            </View>
        );
    }
}

export default connect(state => ({
    settings: state.settings,
}))(SettingsLanguageSelector);
