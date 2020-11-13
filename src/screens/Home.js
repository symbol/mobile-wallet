import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Section, GradientBackground, BalanceWidget, Text, PluginList, Col, Row, Icon,TitleBar } from '@src/components';
import { Router } from '@src/Router';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
    transactionPreview: {
        width: '100%',
        height: 60,
        borderRadius: 6,
        marginTop: 4,
        marginBottom: 4,
        padding: 17,
        paddingTop: 8,
        backgroundColor: '#fffc',
    },
    list: {
        marginTop: 17,
    },
});

type Props = {
    componentId: string,
};

type State = {};

class Home extends Component<Props, State> {
    state = { isSidebarShown: false };

    render() {
        const { pendingSignature, contentStyle = {}, componentId, accountName, onOpenMenu, onOpenSettings, changeTab } = this.props;
        const {} = this.state;

        return (
            <GradientBackground name="mesh_small_2" theme="dark" fade={true}>
				<TitleBar title={accountName} onOpenMenu={() => onOpenMenu()} onSettings={() => onOpenSettings()}/>
                <Col justify="space-around" style={contentStyle}>
                    <BalanceWidget showChart={false} />
                    <Section type="list">
                        <PluginList componentId={componentId} />
                        {/* Notifications Mockup */}
                        <View style={styles.transactionPreview}>
                            <Row justify="space-between">
                                <Text type="regular" theme="light">
                                    Opt-in
                                </Text>
                                <Text type="regular" theme="light">
                                    23.10.2020 11:00
                                </Text>
                            </Row>
                            <Row justify="space-between">
                                <Text type="bold" theme="light">
                                    Post launch Opt-in
                                </Text>
                            </Row>
                        </View>
                        {pendingSignature && (
                            <TouchableOpacity style={styles.transactionPreview} onPress={() => changeTab('history')}>
                                <Row justify="space-between">
                                    <Text type="regular" theme="light">
                                        Multisig Transaction
                                    </Text>
                                    <Text type="regular" theme="light">
                                        23.10.2020 10:59
                                    </Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text type="bold" theme="light">
                                        Awaiting your signature
                                    </Text>
                                </Row>
                            </TouchableOpacity>
                        )}
                    </Section>
                </Col>
            </GradientBackground>
        );
    }
}

export default connect(state => ({
    accountName: state.wallet.selectedAccount.name,
    pendingSignature: state.account.pendingSignature,
    address: state.account.selectedAccountAddress,
}))(Home);
