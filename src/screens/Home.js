import React, { Component } from 'react';
import {StyleSheet, ScrollView, TouchableOpacity, View, RefreshControl, FlatList} from 'react-native';
import {
	Section,
	GradientBackground,
	AccountBalanceWidget,
	Text,
	PluginList,
	Col,
	Row,
	Icon,
	TitleBar,
	ListItem
} from '@src/components';
import { Router } from '@src/Router';
import { connect } from 'react-redux';
import store from '@src/store';
import ListContainer from "@src/components/backgrounds/ListContainer";
import GlobalStyles from "@src/styles/GlobalStyles";
import translate from "@src/locales/i18n";
import BasicAlert from "@src/components/molecules/BasicAlert";

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
		width: '100%'
	},
	scrollViewContent: {
		flex: 1,
		flexDirection: 'column',
		width: '100%'
	},
	notifications: {
		//marginBottom: 10,
		//marginTop: 100,
		//flex: 1,
		maxHeight: '50%',
		height: null,
		flexShrink: 1,
	},
	pluginList: {
		//flexGrow: 1
	}
});

type Props = {
    componentId: string,
};

type State = {};

class Home extends Component<Props, State> {
    state = { isSidebarShown: false,  showWarning: false};

	reload = () => {
        store.dispatchAction({ type: 'account/loadAllData' });
	};

	renderNotification = ({item, index}) => {
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
	}

	componentDidMount = () => {
		// If wallet created by empty mnemonic, show warning message.
		if (store.getState().wallet.mnemonic === ''){
			this.setState({showWarning: true})
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
			isLoading,
			isMultisig
		} = this.props;

		const { showWarning } = this.state;

        const notifications = [];
		notifications.push({ title: translate('home.optInTitle'), description: translate('home.optInDescription' ), handler: () => Router.goToOptInWelcome({}, this.props.componentId)});
		//notifications.push({ title: translate('home.optInTitle'), description: translate('home.optInDescription' )});
        if (pendingSignature && !isMultisig) {
			notifications.push({title: translate('home.pendingSignatureTitle'), description: translate('home.pendingSignatureDescription'), handler: () => changeTab('history')});
		}

        return (
			<GradientBackground
				name="connector_small"
				theme="light"
				fade={true}
				titleBar={<TitleBar theme="light" title={accountName} onOpenMenu={() => onOpenMenu()} onSettings={() => onOpenSettings()}/>}
			>
					{showWarning && <BasicAlert
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
							}
						]}
					/>}

					<Col justify="space-between" style={contentStyle}>
						<Section type="list">
							<AccountBalanceWidget componentId={componentId}/>
						</Section>

						<PluginList componentId={componentId} theme="light" style={styles.pluginList}/>

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
    }
}

export default connect(state => ({
	isLoading: state.account.loading,
    accountName: state.wallet.selectedAccount.name,
    pendingSignature: state.transaction.pendingSignature,
    address: state.account.selectedAccountAddress,
	isMultisig: state.account.isMultisig
}))(Home);
