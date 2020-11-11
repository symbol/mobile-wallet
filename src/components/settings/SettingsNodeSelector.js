import React, { Component } from 'react';
import { Linking, View, CheckBox, StyleSheet } from 'react-native';
import SettingsListItem from '@src/components/settings/SettingsListItem';
import translate from '@src/locales/i18n';
import BottomModal from '@src/components/atoms/BottomModal/BottomModal';
import NodeSelector from '@src/components/molecules/NodeSelector';
import { Text } from '@src/components';
import { connect } from 'react-redux';
import store from '@src/store';

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
        const { isModalOpen, error } = this.state;
        const { network } = this.props;

        return (
            <View>
                <SettingsListItem
                    title={translate('Settings.node.menuTitle')}
                    isSelector={true}
                    icon={require('@src/assets/icons/ic-mainnet.png')}
                    itemValue={network.network}
                    onPress={this.openModal}
                />
                <BottomModal isModalOpen={isModalOpen} onClose={this.closeModal}>
                    <View style={styles.checkboxContainer}>
                        <Text type="text" theme="light">
                            Mainnet
                        </Text>
                    </View>
                    <NodeSelector
                        network={'mainnet'}
                        selectedNode={'sad'}
                        onNodeSelect={this.onSelectNode}
                    />
                    <View style={styles.checkboxContainer}>
                        <Text type="text" theme="light">
                            Testnet
                        </Text>
                    </View>
                    <NodeSelector
                        network={'testnet'}
                        selectedNode={'ds'}
                        onNodeSelect={this.onSelectNode}
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
    network: state.network,
}))(SettingsNodeSelector);
