import React, { Component } from 'react';
import { View } from 'react-native';
import SettingsListItem from '@src/components/settings/SettingsListItem';
import { AsyncCache } from '@src/utils/storage/AsyncCache';
import ModalSelector from '@src/components/organisms/ModalSelector';
import translate, { getLocales } from '@src/locales/i18n';

export default class SettingsLanguageSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: getLocales(),
            isBoxOpen: false,
        };
    }

    componentDidMount = () => {
        AsyncCache.getSelectedLanguage().then(language => {
            const { data } = this.state;
            this.setState({
                selected: language || data[0],
            });
        });
    };

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
        console.log(`Selected ${language}`);
        this.closeModal();
    };

    render() {
        const { data, isBoxOpen, selected } = this.state;

        return (
            <View>
                <SettingsListItem
                    title={translate('Settings.language.title')}
                    icon={require('../../assets/icons/ic-language.png')}
                    isSelector={true}
                    itemValue={selected}
                    onPress={this.openModal}
                />
                <ModalSelector
                    data={data}
                    selectedItem={selected}
                    isModalOpen={isBoxOpen}
                    onClose={this.closeModal}
                    onSelect={this.onSelectLanguage}
                />
            </View>
        );
    }
}
