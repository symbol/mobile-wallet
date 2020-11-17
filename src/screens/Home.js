import React, { Component } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, RefreshControl } from 'react-native';
import { Section, GradientBackground, AccountBalanceWidget, Text, PluginList, Col, Row, Icon,TitleBar } from '@src/components';
import { Router } from '@src/Router';
import { connect } from 'react-redux';
import store from '@src/store';

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
	}
});

type Props = {
    componentId: string,
};

type State = {};

class Home extends Component<Props, State> {
    state = { isSidebarShown: false };

	reload = () => {
        store.dispatchAction({ type: 'account/loadAllData' });
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
			isLoading
		} = this.props;
        const {} = this.state;

        return (
			<GradientBackground
				name="connector_small"
				theme="light"
				fade={true}
				titleBar={<TitleBar theme="light" title={accountName} onOpenMenu={() => onOpenMenu()} onSettings={() => onOpenSettings()}/>}
			>
				<ScrollView
					style={styles.ScrollView}
					contentContainerStyle={styles.scrollViewContent}
					refreshControl={
						<RefreshControl refreshing={isLoading} onRefresh={() => this.reload()} />
					}
				>
					<Col justify="space-between" style={contentStyle}>
						<Section type="list">
							<AccountBalanceWidget />
						</Section>
						<Section type="list">
							<PluginList componentId={componentId} theme="light"/>
						</Section>
						<Section type="list">
							{/* Notifications Mockup */}
							{pendingSignature && (
								<TouchableOpacity style={styles.transactionPreview} onPress={() => changeTab('history')}>
									<Row justify="space-between">
										<Text type="regular" theme="light">
											Multisig Transaction
										</Text>
										<Text type="regular" theme="light">
											{/* DateTime */}
										</Text>
									</Row>
									<Row justify="space-between">
										<Text type="bold" theme="light">
											Awaiting your signature
										</Text>
									</Row>
								</TouchableOpacity>
							)}
							<View style={styles.transactionPreview}>
								<Row justify="space-between">
									<Text type="regular" theme="light">
										Opt-in
									</Text>
									<Text type="regular" theme="light">
										{/* DateTime */}
									</Text>
								</Row>
								<Row justify="space-between">
									<Text type="bold" theme="light">
										Post launch Opt-in is coming soon..
									</Text>
								</Row>
							</View> 
						</Section>
					</Col>
				</ScrollView>
            </GradientBackground>
        );
    }
}

export default connect(state => ({
	isLoading: state.account.loading,
    accountName: state.wallet.selectedAccount.name,
    pendingSignature: state.transaction.pendingSignature,
    address: state.account.selectedAccountAddress,
}))(Home);
