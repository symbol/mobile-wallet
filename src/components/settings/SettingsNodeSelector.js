import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, TouchableOpacityComponent } from 'react-native';
import SettingsListItem from '@src/components/settings/SettingsListItem';
import translate from '@src/locales/i18n';
import PopupModal from '@src/components/molecules/PopupModal';
import { Dropdown, Text, Section, Row, ManagerHandler } from '@src/components';
import { connect } from 'react-redux';
import store from '@src/store';
import { getNodes } from '@src/config/environment';
import GlobalStyles from '@src/styles/GlobalStyles';


const styles = StyleSheet.create({
    popup: {
		height: '65%',
		paddingBottom: 34,
		//flex: 1
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    checkbox: {
        alignSelf: 'center',
    },
    label: {
        margin: 8,
	},
	tabs: {
		borderBottomWidth: 2,
		borderColor: GlobalStyles.color.WHITE
	},
	tab: {
		paddingBottom: 5
	},
	activeTab: {
		borderBottomColor: GlobalStyles.color.PINK,
		borderBottomWidth: 2,
		marginBottom: -2
	},
	item: {
		borderBottomColor: GlobalStyles.color.DARKWHITE,
		borderBottomWidth: 2,
		paddingVertical: 8,
		marginHorizontal: 16,
	},
	list: {
		borderRadius: 6,
		backgroundColor: GlobalStyles.color.WHITE
	},
	error: {
		color: GlobalStyles.color.RED,
		opacity: 1
	},
	loading: {
		color: GlobalStyles.color.BLUE,
		opacity: 1
	},
});

class SettingsNodeSelector extends Component {
    state = {
        nodeSelected: null,
        isModalOpen: false,
		error: null,
		loading: null,
		selectedTab: 'mainnet'
	};

	componentDidMount = () => {
		this.setState({
			selectedTab: this.props.selectedNetwork
		})
	};

    openModal = () => {
        this.setState({
            isModalOpen: true,
        });
    };

    closeModal = () => {
        this.setState({
            isModalOpen: false,
        });
    };

    onSelectNode = node => {
        this.setState({
			loading: 'Loading',
			error: null
        });
        store
            .dispatchAction({ type: 'network/changeNode', payload: node })
            .then(_ => {
                this.closeModal();
                this.setState({
					error: null,
					loading: null,
                });
            })
            .catch(e => {
                this.setState({
					error: 'Node not working',
					loading: null,
                });
            });
    };

	renderItem = item => {
		const isActive = item.item.value === this.props.selectedNode;
		// const style = isActive
		// 	? styles.itemActive
		// 	: styles.item;

		return (<TouchableOpacity onPress={() => this.onSelectNode(item.item.value)} style={styles.item}>
			<Text type={isActive ? 'bold' : 'regular'} style={{color: GlobalStyles.color.PRIMARY}}>{item.item.label}</Text>
		</TouchableOpacity>)
	};

    render = () => {
        const nodes = {
            mainnet: getNodes('mainnet').map(node => ({ value: node, label: node })),
            testnet: getNodes('testnet').map(node => ({ value: node, label: node })),
        };

        const { isModalOpen, error, loading, selectedTab } = this.state;
        const { selectedNode, selectedNetwork } = this.props;
		const list = selectedTab === 'mainnet'
			? nodes.mainnet
			: nodes.testnet;

        return (
            <View>
                <SettingsListItem
                    title={translate('Settings.node.menuTitle')}
					isSelector={true}
                    icon={require('@src/assets/icons/ic-mainnet.png')}
                    itemValue={selectedNetwork}
                    onPress={this.openModal}
                />
				<PopupModal
					containerStyle={styles.popup}
					isModalOpen={isModalOpen}
					onClose={() => this.closeModal()}
					showTopbar={true}
                    title={'Select a node'}
                    showClose={true}
				>
					<Section type="form">
						<Section type="form-item">
							<Row style={styles.tabs}>
								<TouchableOpacity
									style={[{marginRight: 16}, styles.tab, selectedTab === 'mainnet' && styles.activeTab]}
									onPress={() => this.setState({selectedTab: 'mainnet'})}
								>
									<Text type="bold" theme="light">
										Mainnet
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.tab, selectedTab === 'testnet' && styles.activeTab}
									onPress={() => this.setState({selectedTab: 'testnet'})}
								>
									<Text type="bold" theme="light">
										Testnet
									</Text>
								</TouchableOpacity>
							</Row>

						</Section>
						{ loading &&
							<ManagerHandler dataManager={{isLoading: !!loading}} noLoadingText theme="light">
								<Section type="form-item" style={{ height: '100%' }}/>
							</ManagerHandler>
						}
						{!loading &&
							<Section type="form-item">
								<FlatList
									style={styles.list}
									data={list}
									renderItem={this.renderItem}
									keyExtractor={(item, index) => '' + index + 'nodes'}
								/>
							</Section>
						}
						<Section type="form-item">
							{error && <Text type={'regular'} align={'center'} theme={'light'} style={styles.error}>
								{error}
							</Text>}
						</Section>
					</Section>
                    {/* <View style={styles.checkboxContainer}>
                        <Text type="text" theme="light">
                            Mainnet
                        </Text>
                    </View>
                    <Dropdown
                        list={nodes.mainnet}
                        title={'Select mainnet node'}
                        value={selectedNetwork === 'mainnet' ? selectedNode : null}
                        onChange={v => this.onSelectNode(v)}
                    />
                    <View style={styles.checkboxContainer}>
                        <Text type="text" theme="light">
                            Testnet
                        </Text>
                    </View>
                    <Dropdown
                        list={nodes.testnet}
                        title={'Select testnet node'}
                        value={selectedNetwork === 'testnet' ? selectedNode : null}
                        onChange={v => this.onSelectNode(v)}
                    /> */}

                </PopupModal>
            </View>
        );
    }
}

export default connect(state => ({
    selectedNode: state.network.selectedNetwork ? state.network.selectedNetwork.node : '',
    selectedNetwork: state.network.selectedNetwork ? state.network.selectedNetwork.type : '',
}))(SettingsNodeSelector);
