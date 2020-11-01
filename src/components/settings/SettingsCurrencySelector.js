import React, { Component } from 'react';
import { View } from 'react-native';
import SettingsListItem from '@src/components/settings/SettingsListItem';
import { getCurrencyList } from '@src/config/environment';
import { Dropdown } from '@src/components';
import translate from '@src/locales/i18n';
import store from '@src/store';
import { connect } from 'react-redux';

class SettingsCurrencySelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: getCurrencyList(),
            isCurrencyBoxOpen: false,
        };
    }

    closeModal = () => {
        this.setState({
            isCurrencyBoxOpen: false,
        });
    };

    openModal = () => {
        this.setState({
            isCurrencyBoxOpen: true,
        });
    };

    onSelectCurrency = currency => {
        store
            .dispatchAction({ type: 'settings/saveSelectedCurrency', payload: currency })
            .then(_ => this.closeModal());
    };

    render() {
        const { data, isCurrencyBoxOpen } = this.state;
        const { selectedCurrency } = this.props.settings;
		const list = data.map(el => ({value: el, label: el}));
        return (
            <View>
				<Dropdown 
					list={list}
					title={translate('Settings.currency.title')}
					value={selectedCurrency}
					onChange={this.onSelectCurrency}
				>
					<SettingsListItem
						title={translate('Settings.currency.title')}
						icon={require('@src/assets/icons/ic-currency.png')}
						isSelector={true}
						isDropdown={true}
						itemValue={selectedCurrency}
						onPress={this.openModal}
					/>
				</Dropdown>
            </View>
        );
    }
}

export default connect(state => ({
    settings: state.settings,
}))(SettingsCurrencySelector);
