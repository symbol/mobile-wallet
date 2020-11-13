import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Section, ImageBackground, Text, TitleBar, Dropdown, Button } from '@src/components';

import { connect } from 'react-redux';
import HarvestingService from '@src/services/HarvestingService';
import store from '@src/store';

const styles = StyleSheet.create({});

type Props = {};

type State = {};

class Harvest extends Component<Props, State> {
    state = {
        selectedNodePubKey: null,
        isLoading: false,
    };

    getHarvestingNodesDropDown = () => {
        return HarvestingService.getHarvestingNodeList().map(node => ({
            value: node.publicKey,
            label: node.url,
        }));
    };

    onSelectHarvestingNode = node => this.setState({ selectedNodePubKey: node });

    startHarvesting = async _ => {
        const { selectedNodePubKey } = this.state;
        this.setState({ isLoading: true });
        await store.dispatchAction({ type: 'harvesting/startHarvesting', payload: selectedNodePubKey });
        this.setState({ isLoading: false });
    };

    swapHarvesting = async _ => {
        const { selectedNodePubKey } = this.state;
        this.setState({ isLoading: true });
        await store.dispatchAction({ type: 'harvesting/swapHarvesting', payload: selectedNodePubKey });
        this.setState({ isLoading: false });
    };

    stopHarvesting = async _ => {
        this.setState({ isLoading: true });
        await store.dispatchAction({ type: 'harvesting/stopHarvesting' });
        this.setState({ isLoading: false });
    };

    render() {
        const { status, totalBlockCount, totalFeesEarned, onOpenMenu, onOpenSettings  } = this.props;
        const { selectedNodePubKey, isLoading } = this.state;

        return (
            <ImageBackground name="harvest">
               	<TitleBar 
					theme="light"
					title="Harvest" 
					onOpenMenu={() => onOpenMenu()} 
					onSettings={() => onOpenSettings()}
				/>
                <Section type="list" style={styles.list}>
                    <Text type={'bold'} theme={'light'}>
                        Status: {status}
                    </Text>
                    <Text type={'bold'} theme={'light'}>
                        Blocks mined: {totalBlockCount}
                    </Text>
                    <Text type={'bold'} theme={'light'}>
                        Fees earned: {totalFeesEarned.toString()}
                    </Text>

                    <Dropdown
                        list={this.getHarvestingNodesDropDown()}
                        title={'Select node'}
                        value={selectedNodePubKey}
                        onChange={this.onSelectHarvestingNode}
                    />
                    {status === 'INACTIVE' && (
                        <Button isLoading={isLoading} isDisabled={false} text="Start harvesting" theme="light" onPress={() => this.startHarvesting()} />
                    )}
                    {status === 'ACTIVE' && (
                        <Button isLoading={isLoading} isDisabled={false} text="Swap node" theme="light" onPress={() => this.swapHarvesting()} />
                    )}
                    {status === 'ACTIVE' && (
                        <Button isLoading={isLoading} isDisabled={false} text="Stop harvesting" theme="light" onPress={() => this.stopHarvesting()} />
                    )}
                </Section>
            </ImageBackground>
        );
    }
}

export default connect(state => ({
    status: state.harvesting.status,
    totalBlockCount: state.harvesting.harvestedBlockStats.totalBlockCount,
    totalFeesEarned: state.harvesting.harvestedBlockStats.totalFeesEarned,
}))(Harvest);
