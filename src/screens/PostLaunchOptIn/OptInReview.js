import React, { Component } from 'react';
import { FlatList, RefreshControl, StyleSheet, View, TouchableOpacity } from 'react-native';
import { GradientBackground, TitleBar, ListContainer, ListItem, Section, Button, Input, TableView, Trunc, Col, Row, Icon } from '@src/components';
import { connect } from 'react-redux';
import translate from '@src/locales/i18n';
import Text from '@src/components/controls/Text';
import { Router } from '@src/Router';
import AccountService from '@src/services/AccountService';
import store from "@src/store";
import {showPasscode} from "@src/utils/passcode";
import GlobalStyles from "@src/styles/GlobalStyles";

const styles = StyleSheet.create({
    list: {
        marginBottom: 10,
    },
    amount: {
        color: GlobalStyles.color.GREEN,
    },
    amountNegative: {
        color: GlobalStyles.color.RED,
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

class OptInReview extends Component<Props, State> {
    state = {
        sent: false,
    };

    finish = () => {
        store.dispatchAction({ type: 'optin/doOptIn' });
        this.setState({ sent: true });
    };

    render() {
        const { componentId, selectedNIS1Account, selectedOptInStatus, selectedSymbolAccount, network, isLoading, isError } = this.props;
        const { sent, showReview } = this.state;
        let data = {
            optinAddress: selectedNIS1Account.address,
            optinDestination: AccountService.getAddressByAccountModelAndNetwork(selectedSymbolAccount, network),
        };

        console.log(isError);
        const hardCodedDataManager = {
            isLoading,
            isError: !!isError,
            errorMessage: isError,
        };

        return (
            <GradientBackground name="connector_small" theme="light" dataManager={hardCodedDataManager}>
                <TitleBar theme="light" title={translate('optin.reviewTitle')} onBack={() => Router.goBack(componentId)} />
                {!sent && (
                    <Section type="form" style={styles.list} isScrollable>
                        <TableView componentId={componentId} data={data} />
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
                        <Section type="form-item">
                            <Text type={'bold'} theme={'light'}>
                                {translate('optin.fee')}
                            </Text>
                            <Row justify="space-between" fullWidth style={styles.mosaic}>
                                <Row align="center">
                                    <Text type="regular" theme="light"><Trunc type="namespaceName">{"XEM"}</Trunc></Text>
                                </Row>
                                <Text type="regular" theme="light" style={styles.amountNegative}>-0.85</Text>
                            </Row>
                        </Section>
                        <Section type="form-bottom">
                            <Button text={translate('optin.send')} theme="light" onPress={() => showPasscode(this.props.componentId, this.finish)} />
                        </Section>
                    </Section>
                )}
                {sent && (
                    <Section type="form">
                        <Col justify="center" style={{ marginTop: '15%' }}>
                            <Section type="form-item">
                                <Row justify="space-between" align="end">
                                    <Text type="alert" theme="light" style={{ paddingBottom: 0 }}>
                                        Success!
                                    </Text>
                                    <Icon name="success" size="big" />
                                </Row>
                            </Section>
                            <Section type="form-item">
                                <Text type="bold" theme="light">
                                    Opt In successfully sent
                                </Text>
                            </Section>
                            <Section type="form-item"></Section>
                        </Col>

                        <Section type="form-bottom">
                            <Button isLoading={false} isDisabled={false} text="Go to menu" theme="light" onPress={() => Router.goToOptInWelcome({}, this.props.componentId)} />
                        </Section>
                    </Section>
                )}
            </GradientBackground>
            //</ImageBackground>
        );
    }
}

export default connect(state => ({
    selectedNIS1Account: state.optin.selectedNIS1Account,
    selectedOptInStatus: state.optin.selectedOptInStatus,
    selectedSymbolAccount: state.optin.selectedSymbolAccount,
    symbolAccounts: state.wallet.accounts,
    network: state.network.selectedNetwork.type,
    isLoading: state.optin.loading,
    isError: state.optin.error,
}))(OptInReview);
