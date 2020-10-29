import React, { Component } from 'react';
import { View } from 'react-native';
import SettingsListItem from '@src/components/settings/SettingsListItem';
import { AsyncCache } from '@src/utils/storage/AsyncCache';
import { Dropdown } from '@src/components';
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
		const list = data.map(el => ({value: el, label: el}));

        return (
            <View>
				<Dropdown 
					list={list}
					title={translate('Settings.notification.title')}
					value={selectedSyncInterval}
					onChange={this.onSelect}
				>
					<SettingsListItem
						title={translate('Settings.notification.title')}
						icon={require('@src/assets/icons/ic-notification.png')}
						isSelector={true}
						isDropdown={true}
						itemValue={selectedSyncInterval}
						onPress={this.openModal}
					/>
				</Dropdown>
            </View>
        );
    }
}

export default connect(state => ({
    settings: state.settings,
}))(SettingsNotificationSelector);
