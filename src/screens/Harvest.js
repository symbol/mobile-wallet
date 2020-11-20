import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Section, ImageBackground, GradientBackground, Text, TitleBar, Dropdown, Button, Row } from '@src/components';
import GlobalStyles from '@src/styles/GlobalStyles';
import { connect } from 'react-redux';
import HarvestingService from '@src/services/HarvestingService';
import store from '@src/store';
import { showPasscode } from '@src/utils/passcode';

const styles = StyleSheet.create({
    list: {
        marginBottom: 10,
    },
    card: {
        width: '100%',
        borderRadius: 6,
        marginTop: 0,
        marginBottom: 8,
        padding: 17,
        paddingTop: 8,
        backgroundColor: GlobalStyles.color.WHITE,
    },
    bottom: {
        paddingTop: 30,
    },
    active: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: GlobalStyles.color.GREEN,
        marginRight: 5,
        marginBottom: 1,
    },
    inactive: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: GlobalStyles.color.RED,
        marginRight: 5,
        marginBottom: 1,
    },
    activation: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: GlobalStyles.color.ORANGE,
        marginRight: 5,
        marginBottom: 1,
    },
});

type Props = {};

type State = {};

class Harvest extends Component<Props, State> {
    state = {
        selectedNode: null,
        isLoading: false,
    };

    componentDidMount() {
        const { selectedAccount } = this.props;
        if (selectedAccount.harvestingNode) {
            const nodes = HarvestingService.getHarvestingNodeList();
            for (let node of nodes) {
                if (node.url === selectedAccount.harvestingNode) {
                    this.setState({
                        selectedNode: node.publicKey,
                    });
                }
            }
        }
    }

    getSelectedUrl = () => {
        const { selectedNode } = this.state;
        const nodeObj = HarvestingService.getHarvestingNodeList().find(node => node.publicKey === selectedNode);
        return nodeObj ? nodeObj.url : null;
    };

    getHarvestingNodesDropDown = () => {
        return HarvestingService.getHarvestingNodeList().map(node => ({
            value: node.publicKey,
            label: node.url,
        }));
    };

    onSelectHarvestingNode = node => this.setState({ selectedNode: node });

    startHarvesting = async _ => {
        const callBack = async () => {
            const { selectedNode } = this.state;
            this.setState({ isLoading: true });
            await store.dispatchAction({
                type: 'harvesting/startHarvesting',
                payload: { nodePublicKey: selectedNode, harvestingNode: this.getSelectedUrl() },
            });
            this.setState({ isLoading: false });
        };
        showPasscode(this.props.componentId, callBack);
    };

    swapHarvesting = async _ => {
        const callBack = async () => {
            const { selectedNode } = this.state;
            this.setState({ isLoading: true });
            await store.dispatchAction({
                type: 'harvesting/swapHarvesting',
                payload: { nodePublicKey: selectedNode, harvestingNode: this.getSelectedUrl() },
            });
            this.setState({ isLoading: false });
        };
        showPasscode(this.props.componentId, callBack);
    };

    stopHarvesting = async _ => {
        const callBack = async () => {
            this.setState({ isLoading: true });
            await store.dispatchAction({ type: 'harvesting/stopHarvesting' });
            this.setState({ isLoading: false });
        };
        showPasscode(this.props.componentId, callBack);
    };

    render() {
        const { status, totalBlockCount, totalFeesEarned, onOpenMenu, onOpenSettings, balance } = this.props;
        const { selectedNode, isLoading } = this.state;
        let statusStyle;
        switch (status) {
            case 'ACTIVE':
                statusStyle = styles.active;
                break;
            case 'INACTIVE':
                statusStyle = styles.inactive;
                break;
            case 'INPROGRESS_ACTIVATION':
                statusStyle = styles.activation;
                break;
            case 'INPROGRESS_DEACTIVATION':
                statusStyle = styles.activation;
                break;
            case 'KEYS_LINKED':
                statusStyle = styles.activation;
                break;
        }

        return (
            //<ImageBackground name="harvest">
            <GradientBackground
                name="connector_small"
                theme="light"
                dataManager={{ isLoading }}
                titleBar={<TitleBar theme="light" title="Harvest" onOpenMenu={() => onOpenMenu()} onSettings={() => onOpenSettings()} />}>
                <Section type="form" style={styles.list} isScrollable>
                    <Section type="form-item" style={styles.card}>
                        <Row justify="space-between" fullWidth>
                            <Text type={'bold'} theme={'light'}>
                                Status:
                            </Text>
                            <Row align="center">
                                <View style={statusStyle} />
                                <Text type={'regular'} theme={'light'}>
                                    {status}
                                </Text>
                            </Row>
                        </Row>
                        <Row justify="space-between" fullWidth>
                            <Text type={'bold'} theme={'light'}>
                                Blocks harvested:
                            </Text>
                            <Text type={'regular'} theme={'light'}>
                                {totalBlockCount}
                            </Text>
                        </Row>
                        <Row justify="space-between" fullWidth>
                            <Text type={'bold'} theme={'light'}>
                                Fees earned:
                            </Text>
                            <Text type={'regular'} theme={'light'}>
                                {totalFeesEarned.toString()}
                            </Text>
                        </Row>
                    </Section>
                    <Section type="form-item">
                        <Dropdown
                            theme="light"
                            list={this.getHarvestingNodesDropDown()}
                            title={'Select node'}
                            value={selectedNode}
                            onChange={this.onSelectHarvestingNode}
                        />
                    </Section>

                    <Section type="form-bottom" style={[styles.card, styles.bottom]}>
                        {status === 'INACTIVE' && (
                            <Section type="form-item">
                                <Button
                                    isLoading={isLoading}
                                    isDisabled={!selectedNode || balance < 10000}
                                    text="Start harvesting"
                                    theme="light"
                                    onPress={() => this.startHarvesting()}
                                />
                            </Section>
                        )}
                        {status !== 'INACTIVE' && (
                            <Section type="form-item">
                                <Button
                                    isLoading={isLoading}
                                    isDisabled={!selectedNode || balance < 10000}
                                    text="Change node"
                                    theme="light"
                                    onPress={() => this.swapHarvesting()}
                                />
                            </Section>
                        )}
                        {status !== 'INACTIVE' && (
                            <Section type="form-item">
                                <Button isLoading={isLoading} isDisabled={false} text="Stop harvesting" theme="light" onPress={() => this.stopHarvesting()} />
                            </Section>
                        )}
                    </Section>
                </Section>
            </GradientBackground>
            //</ImageBackground>
        );
    }
}

export default connect(state => ({
    selectedAccount: state.wallet.selectedAccount,
    balance: state.account.balance,
    status: state.harvesting.status,
    totalBlockCount: state.harvesting.harvestedBlockStats.totalBlockCount,
    totalFeesEarned: state.harvesting.harvestedBlockStats.totalFeesEarned,
}))(Harvest);
