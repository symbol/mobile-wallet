import React, { Component } from 'react';
import { FlatList, RefreshControl, StyleSheet, View, TouchableOpacity } from 'react-native';
import { GradientBackground, TitleBar, ListContainer, ListItem, Section, Button, Input, TableView, Row, Icon, Trunc, Dropdown } from '@src/components';
import { connect } from 'react-redux';
import translate from '@src/locales/i18n';
import Text from '@src/components/controls/Text';
import store from '@src/store';
import { Router } from '@src/Router';
import NetworkService from '@src/services/NetworkService';
import { PublicAccount } from 'symbol-sdk';
import GlobalStyles from '@src/styles/GlobalStyles';
import CopyView from '@src/components/controls/CopyView';

const styles = StyleSheet.create({
    list: {
        marginBottom: 10,
    },
    error: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 10,
        marginTop: 5,
    },
    status1: {
        backgroundColor: 'orange',
        padding: 15,
        borderRadius: 10,
        marginTop: 5,
    },
    status2: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 10,
        marginTop: 5,
    },
    status3: {
        backgroundColor: 'orange',
        padding: 15,
        borderRadius: 10,
        marginTop: 5,
    },
    status4: {
        backgroundColor: 'orange',
        padding: 15,
        borderRadius: 10,
        marginTop: 5,
    },
    status5: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 10,
        marginTop: 5,
    },
    amount: {
        color: GlobalStyles.color.GREEN,
    },
    mosaic: {
        backgroundColor: GlobalStyles.color.WHITE,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
});

type Props = {
    componentId: string,
};

type State = {};

class OptInAccountDetails extends Component<Props, State> {
    state = {};

    onChangeOptInAccount = account => {
        const { selectedNIS1Account } = this.props;
        if (account !== selectedNIS1Account.address) {
            store.dispatchAction({ type: 'optin/loadNIS1MultisigAccount', payload: account });
        } else {
            const { nis1Accounts } = this.props;
            store.dispatchAction({ type: 'optin/loadNIS1Account', payload: nis1Accounts.map(account => account.address).indexOf(account) });
        }
    };

    start = () => {
        const { selectedOptInStatus } = this.props;
        if (!selectedOptInStatus.isMultisig) Router.goToOptInSelectSymbolAccount({}, this.props.componentId);
        else if (!selectedOptInStatus.destination) Router.goToOptinSelectSymbolMultisigDestination({}, this.props.componentId);
        else Router.goToOptInSelectSymbolAccount({}, this.props.componentId);
    };

    hasUserSigned = () => {
        const { selectedOptInStatus, selectedNIS1Account } = this.props;
        if (!selectedOptInStatus.isMultisig) return false;
        const multisigDTOs = selectedOptInStatus.multisigDTOs;
        return !!multisigDTOs[selectedNIS1Account.publicKey];
    };

    render() {
        const { isLoading, componentId, selectedNIS1Account, selectedNIS1MultisigAccount, selectedOptInStatus, optinAddresses, network } = this.props;
        const dataManager = { isLoading };
        const addresses = optinAddresses.map((address, index) => ({
            label: address,
            value: address,
        }));
        const networkType = NetworkService.getNetworkTypeFromModel({ type: network });
        const publicAccount =
            selectedOptInStatus.destination
                ? PublicAccount.createFromPublicKey(selectedOptInStatus.destination, networkType)
                : null;
        return (
            <GradientBackground name="connector_small" theme="light" dataManager={dataManager}>
                <TitleBar theme="light" title={translate('optin.statusTitle')} onBack={() => Router.goBack(componentId)} />
                <Text style={{ paddingLeft: 30, paddingRight: 30, marginBottom: 20 }} theme="light" type={'bold'} align={'center'}>
                    {translate('optin.optInDetailsDescription')}
                </Text>
                <Section type="form" style={styles.list} isScrollable>
                    {optinAddresses.length > 1 && (
                        <Section type="form-item">
                            <Text type={'bold'} theme={'light'}>
                                {translate('optin.selectedNISAddress')}
                            </Text>
                            <Dropdown
                                value={selectedNIS1MultisigAccount ? selectedNIS1MultisigAccount : selectedNIS1Account.address}
                                showTitle={false}
                                title={translate('optin.selectAccount')}
                                theme="light"
                                editable={true}
                                list={addresses}
                                onChange={address => this.onChangeOptInAccount(address)}
                            />
                        </Section>
                    )}
                    {optinAddresses.length === 1 && (
                        <Section type="form-item">
                            <Text type={'bold'} theme={'light'}>
                                {translate('optin.selectedNISAddress')}
                            </Text>
                            <CopyView>{selectedNIS1Account.address}</CopyView>
                        </Section>
                    )}
                    {!!selectedOptInStatus.destination && (
                        <Section type="form-item">
                            <Text type={'bold'} theme={'light'}>
                                {translate('optin.destination')}
                            </Text>
                            <CopyView>{publicAccount.address.pretty()}</CopyView>
                        </Section>
                    )}
                    <Section type="form-item">
                        <Text type={'bold'} theme={'light'}>
                            {translate('optin.optInStatus')}
                        </Text>
                        <Text type={'regular'} theme={'light'} style={styles['status' + selectedOptInStatus.status]}>
                            {translate('optin.status' + selectedOptInStatus.status + (this.hasUserSigned() ? 'signed' : ''))}
                        </Text>
                    </Section>
                    {selectedOptInStatus.error != null && selectedOptInStatus.status === 1 && (
                        <Section type="form-item">
                            <Text type={'bold'} theme={'light'}>
                                {translate('optin.lastOptInFailed')}
                            </Text>
                            <Text type={'regular'} theme={'light'} style={styles.error}>
                                {translate('optin.error' + selectedOptInStatus.error)}
                            </Text>
                        </Section>
                    )}
                    <Section type="form-item">
                        <Text type={'bold'} theme={'light'}>
                            {translate('optin.optInAmount')}
                        </Text>
                        <Row justify="space-between" fullWidth style={styles.mosaic}>
                            <Row align="center">
                                <Icon name="mosaic_custom" size="small" style={{ marginRight: 8 }} />
                                <Text type="regular" theme="light">
                                    <Trunc type="namespaceName">{'symbol.xym'}</Trunc>
                                </Text>
                            </Row>
                            <Text type="regular" theme="light" style={styles.amount}>
                                {selectedOptInStatus.balance}
                            </Text>
                        </Row>
                    </Section>
                    {(selectedOptInStatus.status === 1 || selectedOptInStatus.status === 3 || selectedOptInStatus.status === 4) && !this.hasUserSigned() && (
                        <Section type="form-bottom">
                            <Button
                                isDisabled={selectedOptInStatus.status === 2 || selectedOptInStatus.status === 5 || selectedOptInStatus.balance === 0}
                                text={translate('optin.start')}
                                theme="light"
                                onPress={() => this.start()}
                            />
                        </Section>
                    )}
                </Section>
            </GradientBackground>
            //</ImageBackground>
        );
    }
}

export default connect(state => ({
    nis1Accounts: state.optin.nis1Accounts,
    optinAddresses: state.optin.optinAddresses,
    selectedNIS1Account: state.optin.selectedNIS1Account,
    selectedNIS1MultisigAccount: state.optin.selectedNIS1MultisigAccount,
    selectedOptInStatus: state.optin.selectedOptInStatus,
    isLoading: state.optin.loading,
    network: state.network.selectedNetwork.type,
}))(OptInAccountDetails);
