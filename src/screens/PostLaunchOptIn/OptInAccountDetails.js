import React, { Component } from 'react';
import { FlatList, RefreshControl, StyleSheet, View, TouchableOpacity } from 'react-native';
import {
    GradientBackground,
    TitleBar,
    ListContainer,
    ListItem,
    Section,
    Button,
    Input,
    TableView,
    Row, Icon, Trunc
} from '@src/components';
import { connect } from 'react-redux';
import translate from '@src/locales/i18n';
import Text from '@src/components/controls/Text';
import store from '@src/store';
import { Router } from '@src/Router';
import BasicModal from '@src/components/molecules/BasicModal';
import OptInService from '@src/services/OptInService';
import nem from 'nem-sdk';
import type { NIS1Account } from '@src/services/OptInService';
import { AddressQR, ContactQR } from 'symbol-qr-library';
import NetworkService from '@src/services/NetworkService';
import { PublicAccount } from 'symbol-sdk';
import GlobalStyles from "@src/styles/GlobalStyles";
import CopyView from "@src/components/controls/CopyView";

const styles = StyleSheet.create({
    list: {
        marginBottom: 10,
    },
    error: {
        backgroundColor: "red",
        padding: 15,
        borderRadius: 10,
        marginTop: 5,
    },
    status1: {
        backgroundColor: "orange",
        padding: 15,
        borderRadius: 10,
        marginTop: 5,
    },
    status2: {
        backgroundColor: "green",
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
        paddingHorizontal: 16
    }
});

type Props = {
    componentId: string,
};

type State = {};

class Welcome extends Component<Props, State> {
    state = {};

    start = () => {
        Router.goToOptInSelectSymbolAccount({}, this.props.componentId);
    };

    render() {
        const { isLoading, componentId, selectedNIS1Account, selectedOptInStatus } = this.props;
        const dataManager = { isLoading };
        let data = {
            optinAddress: selectedNIS1Account.address,
            optinStatus: translate('optin.status' + selectedOptInStatus.status),
            optinAmount: selectedOptInStatus.balance,
        };
        if (selectedOptInStatus.error) {
            data = {
                ...data,
                error: selectedOptInStatus.error,
            };
        }
        if (selectedOptInStatus.destination) {
            data = {
                ...data,
                optinDestination: selectedOptInStatus.destination,
            };
        }
        return (
            <GradientBackground name="connector_small" theme="light" dataManager={dataManager}>
                <TitleBar theme="light" title={translate('optin.statusTitle')} onBack={() => Router.goBack(componentId)} />
                <Text style={{ paddingLeft: 30, paddingRight: 30, marginBottom: 20 }} theme="light" type={'bold'} align={'center'}>
                    {translate('optin.optInDetailsDescription')}
                </Text>
                <Section type="form" style={styles.list} isScrollable>
                    <Section type="form-item">
                        <Text type={'bold'} theme={'light'}>
                            {translate('optin.selectedNISAddress')}
                        </Text>
                        <CopyView>{selectedNIS1Account.address}</CopyView>
                    </Section>
                    {!!selectedOptInStatus.destination &&
                        <Section type="form-item">
                            <Text type={'bold'} theme={'light'}>
                                {translate('optin.destination')}
                            </Text>
                            <CopyView>{selectedOptInStatus.destination}</CopyView>
                        </Section>
                    }
                    <Section type="form-item">
                        <Text type={'bold'} theme={'light'}>
                            {translate('optin.optInStatus')}
                        </Text>
                        <Text type={'regular'} theme={'light'} style={styles['status' + selectedOptInStatus.status]}>
                            {translate('optin.status' + selectedOptInStatus.status)}
                        </Text>
                    </Section>
                    {selectedOptInStatus.error != null && selectedOptInStatus.status === 1 &&
                        <Section type="form-item">
                            <Text type={'bold'} theme={'light'}>
                                {translate('optin.lastOptInFailed')}
                            </Text>
                            <Text type={'regular'} theme={'light'} style={styles.error}>
                                {translate('optin.error' + selectedOptInStatus.error)}
                            </Text>
                        </Section>
                    }
                    <Section type="form-item">
                        <Text type={'bold'} theme={'light'}>
                            {translate('optin.optInAmount')}
                        </Text>
                        <Row justify="space-between" fullWidth style={styles.mosaic}>
                            <Row align="center">
                                <Icon name="mosaic_custom" size="small" style={{marginRight: 8}}/>
                                <Text type="regular" theme="light"><Trunc type="namespaceName">{"symbol.xym"}</Trunc></Text>
                            </Row>
                            <Text type="regular" theme="light" style={styles.amount}>{selectedOptInStatus.balance}</Text>
                        </Row>
                    </Section>
                    {selectedOptInStatus.status === 1 &&
                        <Section type="form-bottom">
                            <Button isDisabled={selectedOptInStatus.status !== 1} text={translate('optin.start')}
                                    theme="light" onPress={() => this.start()}/>
                        </Section>
                    }
                </Section>
            </GradientBackground>
            //</ImageBackground>
        );
    }
}

export default connect(state => ({
    selectedNIS1Account: state.optin.selectedNIS1Account,
    selectedOptInStatus: state.optin.selectedOptInStatus,
    isLoading: state.optin.loading,
}))(Welcome);
