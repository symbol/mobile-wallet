import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import SettingsListItem from '@src/components/settings/SettingsListItem';
import translate from '@src/locales/i18n';
import BottomModal from '@src/components/atoms/BottomModal/BottomModal';
import { Dropdown, Text } from '@src/components';
import { connect } from 'react-redux';
import store from '@src/store';
import { getNodes } from '@src/config/environment';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
});

class SettingsNodeSelector extends Component {
    state = {
        nodeSelected: null,
        isModalOpen: false,
        error: '',
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
        store
            .dispatchAction({ type: 'network/changeNode', payload: node })
            .then(_ => {
                this.closeModal();
                this.setState({
                    error: '',
                });
            })
            .catch(e => {
                this.setState({
                    error: 'Node not working',
                });
            });
    };

    render() {
        const nodes = {
            mainnet: getNodes('mainnet').map(node => ({ value: node, label: node })),
            testnet: getNodes('testnet').map(node => ({ value: node, label: node })),
        };

        const { isModalOpen, error } = this.state;
        const { selectedNode, selectedNetwork } = this.props;

        return (
            <View>
                <SettingsListItem
                    title={translate('Settings.node.menuTitle')}
                    isSelector={true}
                    icon={require('@src/assets/icons/ic-mainnet.png')}
                    itemValue={selectedNetwork}
                    onPress={this.openModal}
                />
                <BottomModal isModalOpen={isModalOpen} onClose={this.closeModal}>
                    <View style={styles.checkboxContainer}>
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
                    />
                    <Text type={'alert'} align={'left'} theme={'light'}>
                        {error}
                    </Text>
                </BottomModal>
            </View>
        );
    }
}

export default connect(state => ({
    selectedNode: state.network.selectedNetwork.node,
    selectedNetwork: state.network.selectedNetwork.type,
}))(SettingsNodeSelector);
