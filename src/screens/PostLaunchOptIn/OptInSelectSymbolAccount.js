import React, { Component } from 'react';
import { FlatList, RefreshControl, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { GradientBackground, TitleBar, ListContainer, ListItem, Section, Button, Input, TableView, Trunc, Icon } from '@src/components';
import { connect } from 'react-redux';
import translate from '@src/locales/i18n';
import Text from '@src/components/controls/Text';
import store from '@src/store';
import { Router } from '@src/Router';
import NetworkService from '@src/services/NetworkService';
import { PublicAccount } from 'symbol-sdk';
import AccountService from '@src/services/AccountService';

const styles = StyleSheet.create({
    list: {
        marginBottom: 10,
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    accountList: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionsIcon: {
        width: 15,
        height: 15,
        paddingTop: 4,
    },
    titleText: { paddingLeft: 30, paddingRight: 30, marginBottom: 20 },
});

type Props = {
    componentId: string,
};

type State = {};

class OptInSelectSymbolAccount extends Component<Props, State> {
    state = {};

    renderAccountItem = ({ item, index }) => {
        const { network } = this.props;
        return (
            <ListItem>
                <TouchableOpacity onPress={() => this.finish(item)} style={styles.accountList}>
                    <Image style={styles.icon} source={require('@src/assets/icons/account_nis1.png')} />
                    <Text type={'regular'} theme={'light'} style={{ flex: 1 }}>
                        {item.name} - <Trunc type="address">{AccountService.getAddressByAccountModelAndNetwork(item, network)}</Trunc>
                    </Text>
                    <Icon style={styles.optionsIcon} name="back_light_reversed" size="small" />
                </TouchableOpacity>
            </ListItem>
        );
    };

    finish = (account: string) => {
        store.dispatch({ type: 'optin/setSelectedSymbolAccount', payload: account });
        Router.goToOptInFinish({ welcomeComponentId: this.props.welcomeComponentId }, this.props.componentId);
    };

    render() {
        const { componentId, symbolAccounts, selectedOptInStatus, selectedMultisigDestinationAccount, network } = this.props;
        const networkType = NetworkService.getNetworkTypeFromModel({ type: network });
        const publicAccount = selectedOptInStatus.isMultisig ? PublicAccount.createFromPublicKey(selectedMultisigDestinationAccount, networkType) : null;
        return (
            <GradientBackground name="connector_small" theme="light">
                <TitleBar theme="light" title={translate('optin.selectSymbolAccountTitle')} onBack={() => Router.goBack(componentId)} />
                {!selectedOptInStatus.isMultisig && (
                    <Text style={styles.titleText} theme="light" type={'bold'} align={'left'}>
                        {translate('optin.selectSymbolAccountDescription')}
                    </Text>
                )}
                {selectedOptInStatus.isMultisig && (
                    <View>
                        <Text style={styles.titleText} theme="light" type={'bold'} align={'left'}>
                            {translate('optin.destinationMultisigAccount')}
                        </Text>
                        <Text style={styles.titleText} theme="light" type={'regular'} align={'left'}>
                            {publicAccount.address.plain()}
                        </Text>
                        <Text style={styles.titleText} theme="light" type={'bold'} align={'left'}>
                            {translate('optin.selectCosignerSymbolDescription')}
                        </Text>
                    </View>
                )}
                <ListContainer type="list" style={styles.list} isScrollable={true}>
                    <FlatList
                        data={symbolAccounts}
                        renderItem={this.renderAccountItem}
                        onEndReachedThreshold={0.9}
                        keyExtractor={(item, index) => '' + index + 'account'}
                    />
                </ListContainer>
            </GradientBackground>
            //</ImageBackground>
        );
    }
}

export default connect(state => ({
    selectedNIS1Account: state.optin.selectedNIS1Account,
    selectedMultisigDestinationAccount: state.optin.selectedMultisigDestinationAccount,
    selectedOptInStatus: state.optin.selectedOptInStatus,
    symbolAccounts: state.wallet.accounts,
    network: state.network.selectedNetwork.type,
    isLoading: state.optin.loading,
}))(OptInSelectSymbolAccount);
