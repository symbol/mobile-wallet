import React, { Component } from 'react';
import { View } from 'react-native';
import SettingsListItem from '@src/components/settings/SettingsListItem';
import { getCurrencyList } from '@src/config/environment';
import { AsyncCache } from '@src/utils/storage/AsyncCache';
import translate from '@src/locales/i18n';

export default class SettingsCurrencySelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: getCurrencyList(),
            isCurrencyBoxOpen: false,
        };
    }

    componentDidMount = () => {
        AsyncCache.getSelectedCurrency().then(currency => {
            const { data } = this.state;
            this.setState({
                selectedCurrency: currency || data[0],
            });
        });
    };

    onTogglePasscode = () => {
        this.setState({
            isCurrencyBoxOpen: true,
        });
    };

    render() {
        const { data, isCurrencyBoxOpen, selectedCurrency } = this.state;

        return (
            <View>
                <SettingsListItem
                    title={translate('Settings.currency.title')}
                    icon={require('../../assets/icons/ic-currency.png')}
                    isSelector={true}
                    itemValue={selectedCurrency}
                    isSwitch={true}
                    onValueChange={this.onTogglePasscode}
                />
            </View>
        );
    }
}
