import React, { Component } from 'react';
import { View } from 'react-native';
import SettingsListItem from '@src/components/settings/SettingsListItem';
import { AsyncCache } from '@src/utils/storage/AsyncCache';
import ModalSelector from '@src/components/organisms/ModalSelector';
import translate, { getLocales } from '@src/locales/i18n';
import { getValidSyncIntervals } from '@src/config/environment';
import store from '@src/store';
import { connect } from 'react-redux';

class SettingsNotificationSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: getValidSyncIntervals(),
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

    onSelect = notification => {
        store
            .dispatchAction({ type: 'settings/saveSelectedSyncInterval', payload: notification })
            .then(_ => this.closeModal());
    };

    render() {
        const { data, isBoxOpen } = this.state;
        const { selectedSyncInterval } = this.props.settings;

        return (
            <View>
                <SettingsListItem
                    title={translate('Settings.notification.title')}
                    icon={require('../../assets/icons/ic-notification.png')}
                    isSelector={true}
                    itemValue={selectedSyncInterval}
                    onPress={this.openModal}
                />
                <ModalSelector
                    data={data}
                    selectedItem={selectedSyncInterval}
                    isModalOpen={isBoxOpen}
                    onClose={this.closeModal}
                    onSelect={this.onSelect}
                />
            </View>
        );
    }
}

export default connect(state => ({
    settings: state.settings,
}))(SettingsNotificationSelector);
