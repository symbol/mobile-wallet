import React, { Component } from 'react';
import { View } from 'react-native';
import SettingsListItem from '@src/components/settings/SettingsListItem';
import { AsyncCache } from '@src/utils/storage/AsyncCache';
import ModalSelector from '@src/components/organisms/ModalSelector';
import translate, { getLocales } from '@src/locales/i18n';
import { getValidSyncIntervals } from '@src/config/environment';

export default class SettingsNotificationSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: getValidSyncIntervals(),
            isBoxOpen: false,
        };
    }

    componentDidMount = () => {
        AsyncCache.getSelectedNotification().then(notification => {
            const { data } = this.state;
            this.setState({
                selected: notification || data[0],
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

    onSelect = notification => {
        console.log(`Selected ${notification}`);
        this.closeModal();
    };

    render() {
        const { data, isBoxOpen, selected } = this.state;

        return (
            <View>
                <SettingsListItem
                    title={translate('Settings.notification.title')}
                    icon={require('../../assets/icons/ic-notification.png')}
                    isSelector={true}
                    itemValue={selected}
                    onPress={this.openModal}
                />
                <ModalSelector
                    data={data}
                    selectedItem={selected}
                    isModalOpen={isBoxOpen}
                    onClose={this.closeModal}
                    onSelect={this.onSelect}
                />
            </View>
        );
    }
}
