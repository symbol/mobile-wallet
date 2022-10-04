import React, { Component } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import {
    AccountBalanceWidget,
    BasicAlert,
    Col,
    GradientBackground,
    ListContainer,
    ListItem,
    PluginList,
    Row,
    Section,
    Text,
    TitleBar,
} from '@src/components';
import { Router } from '@src/Router';
import { connect } from 'react-redux';
import store from '@src/store';
import translate from '@src/locales/i18n';

const styles = StyleSheet.create({
    transactionPreview: {
        width: '100%',
        height: 60,
        borderRadius: 6,
        marginTop: 4,
        marginBottom: 4,
        padding: 17,
        paddingTop: 8,
        backgroundColor: '#ffff',
    },
    scrollView: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
    },
    scrollViewContent: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
    },
    notifications: {
        maxHeight: '50%',
        height: null,
        flexShrink: 1,
    },
    pluginList: {},
});

type Props = {
    componentId: string,
};

type State = {};

class Home extends Component<Props, State> {
    state = { isSidebarShown: false, showWarning: false };

    reload = () => {
        store.dispatchAction({ type: 'account/loadAllData' });
    };

    renderNotification = ({ item }) => {
        return (
            <ListItem onPress={item.handler ? item.handler : () => {}}>
                <Row justify="space-between">
                    <Text type="regular" theme="light">
                        {item.title}
                    </Text>
                    <Text type="regular" theme="light">
                        {/* DateTime */}
                    </Text>
                </Row>
                <Row justify="space-between">
                    <Text type="bold" theme="light">
                        {item.description}
                    </Text>
                </Row>
            </ListItem>
        );
    };

    componentDidMount = () => {
        // If wallet created by words mnemonic not equal 24, show warning message.
        if (store.getState().wallet.mnemonic.split(' ').length !== 24) {
            this.setState({ showWarning: true });
        }
    };

    render = () => {
        const {
            pendingSignature,
            contentStyle = {},
            componentId,
            accountName,
            onOpenMenu,
            onOpenSettings,
            changeTab,
            isMultisig,
        } = this.props;

        const { showWarning } = this.state;

        const notifications = [];
        if (pendingSignature && !isMultisig) {
            notifications.push({
                title: translate('home.pendingSignatureTitle'),
                description: translate('home.pendingSignatureDescription'),
                handler: () => changeTab('history'),
            });
        }

        return (
            <GradientBackground
                name="connector_small"
                theme="light"
                fade={true}
                titleBar={
                    <TitleBar theme="light" title={accountName} onOpenMenu={() => onOpenMenu()} onSettings={() => onOpenSettings()} />
                }
            >
                {showWarning && (
                    <BasicAlert
                        title={translate('home.alertTitle')}
                        message={translate('home.alertInvalidMnemonicMessage')}
                        actions={[
                            {
                                text: translate('home.alertActionCreateWallet'),
                                onPress: () => Router.goToCreateOrImport({}),
                            },
                            {
                                text: translate('home.alertActionCancel'),
                                onPress: () => {
                                    this.setState({ showWarning: false });
                                },
                            },
                        ]}
                    />
                )}

                <Col justify="space-between" style={contentStyle}>
                    <Section type="list">
                        <AccountBalanceWidget componentId={componentId} />
                    </Section>

                    <PluginList componentId={componentId} theme="light" style={styles.pluginList} />

                    <ListContainer style={styles.notifications} isScrollable={false}>
                        <FlatList
                            // style={{ height: '100%' }}
                            keyExtractor={(item, index) => '' + index + 'h-notif'}
                            data={notifications}
                            renderItem={this.renderNotification}
                        />
                    </ListContainer>
                </Col>
            </GradientBackground>
        );
    };
}

export default connect(state => ({
    isLoading: state.account.loading,
    accountName: state.wallet.selectedAccount.name,
    pendingSignature: state.transaction.pendingSignature,
    address: state.account.selectedAccountAddress,
    isMultisig: state.account.isMultisig,
}))(Home);
