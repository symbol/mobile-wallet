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
import CopyView from '@src/components/controls/CopyView';

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
    titleText: { paddingLeft: 30, paddingRight: 30 },
});

type Props = {
    componentId: string,
};

type State = {};

class OptInSelectSymbolMultisigDestination extends Component<Props, State> {
    state = {};

    finish = () => {
        const { multisigAccount } = this.state;
        store.dispatch({ type: 'optin/setSelectedMultisigDestinationAccount', payload: multisigAccount.publicKey });
        // Router.goToOptInSelectSymbolAccount({ welcomeComponentId: this.props.welcomeComponentId }, this.props.componentId);
        Router.goToOptInFinish({ welcomeComponentId: this.props.welcomeComponentId }, this.props.componentId);
    };

    onChangePubKey = pubkey => {
        this.setState({ destination: pubkey });
        let publicAccount;
        try {
            const { selectedNetworkType } = this.props;
            const networkType = NetworkService.getNetworkTypeFromModel({ type: selectedNetworkType });
            publicAccount = PublicAccount.createFromPublicKey(pubkey, networkType);
        } catch (e) {}
        if (publicAccount && pubkey.length === 64) {
            this.setState({
                multisigAccount: {
                    address: publicAccount.address.plain(),
                    publicKey: publicAccount.publicKey,
                },
            });
        } else {
            this.setState({
                multisigAccount: null,
            });
        }
    };

    render() {
        const { componentId } = this.props;
        const { multisigAccount, destination } = this.state;

        return (
            <GradientBackground name="connector_small" theme="light">
                <TitleBar theme="light" title={translate('optin.selectMultisigSymbolAccountTitle')} onBack={() => Router.goBack(componentId)} />
                <Section type="form" style={styles.list} isScrollable>
                    <Section type="form-item">
                        <Text type={'bold'} theme={'light'}>
                            {translate('optin.enterDestinationMultisigAccount')}
                        </Text>
                        <Input value={destination} theme="light" onChangeText={v => this.onChangePubKey(v)} nativePlaceholder={translate('optin.publicKeyPlaceholder')}/>
                    </Section>
                    {multisigAccount && (
                        <Section type="form-item">
                            <Text type={'bold'} theme={'light'}>
                                {translate('optin.selectedNISMultisigAddress')}
                            </Text>
                            <CopyView>{multisigAccount.address}</CopyView>
                        </Section>
                    )}
                    <Section type="form-bottom">
                        <Button isDisabled={!multisigAccount} text={translate('optin.next')} theme="light" onPress={() => this.finish()} />
                    </Section>
                </Section>
            </GradientBackground>
            //</ImageBackground>
        );
    }
}

export default connect(state => ({
    selectedNetworkType: state.network.selectedNetwork.type,
}))(OptInSelectSymbolMultisigDestination);
