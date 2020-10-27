import React, { Component } from 'react';
import { View } from 'react-native';
import SettingsListItem from '@src/components/settings/SettingsListItem';
import { getCurrencyList } from '@src/config/environment';
import ModalSelector from '@src/components/organisms/ModalSelector';
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
        console.log(`Selected ${currency}`);
        store.dispatchAction({ type: 'settings/setSelectedCurrency', payload: currency });
        this.closeModal();
    };

    render() {
        const { data, isCurrencyBoxOpen } = this.state;
        const { selectedCurrency } = this.props.settings;

        return (
            <View>
                <SettingsListItem
                    title={translate('Settings.currency.title')}
                    icon={require('../../assets/icons/ic-currency.png')}
                    isSelector={true}
                    itemValue={selectedCurrency}
                    onPress={this.openModal}
                />
                <ModalSelector
                    data={data}
                    selectedItem={selectedCurrency}
                    isModalOpen={isCurrencyBoxOpen}
                    onClose={this.closeModal}
                    onSelect={this.onSelectCurrency}
                />
            </View>
        );
    }
}

export default connect(state => ({
    settings: state.settings,
}))(SettingsCurrencySelector);
