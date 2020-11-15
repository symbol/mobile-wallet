import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Section, ImageBackground, GradientBackground, Text, TitleBar, Dropdown, Button, Row } from '@src/components';
import GlobalStyles from '@src/styles/GlobalStyles';
import { connect } from 'react-redux';
import HarvestingService from '@src/services/HarvestingService';
import store from '@src/store';

const styles = StyleSheet.create({
	list: {
        marginBottom: 65,
    },
	card: {
		width: '100%',
        borderRadius: 6,
        marginTop: 0,
        marginBottom: 8,
        padding: 17,
        paddingTop: 8,
        backgroundColor: GlobalStyles.color.WHITE
	},
	bottom: {
		paddingTop: 30,
	}
});

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
			//<ImageBackground name="harvest">
			<GradientBackground name="connector_small" theme="light" dataManager={{ isLoading }}>
               	<TitleBar 
					theme="light"
					title="Harvest" 
					onOpenMenu={() => onOpenMenu()} 
					onSettings={() => onOpenSettings()}
				/>
                <Section type="form" style={styles.list} isScrollable>
					<Section type="form-item" style={styles.card}>
					<Row justify="space-between" fullWidth>
							<Text type={'bold'} theme={'light'}>
							Status:
						</Text>
						<Text type={'regular'} theme={'light'}>
							{status}
						</Text>
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
							value={selectedNodePubKey}
							onChange={this.onSelectHarvestingNode}
						/>
					</Section>

					<Section type="form-bottom" style={[styles.card, styles.bottom]}>
						
						{status === 'INACTIVE' && 
						<Section type="form-item">
							<Button isLoading={isLoading} isDisabled={!selectedNodePubKey} text="Start harvesting" theme="light" onPress={() => this.startHarvesting()} />
						</Section>}
						{status === 'ACTIVE' &&
						<Section type="form-item">
							<Button isLoading={isLoading} isDisabled={!selectedNodePubKey} text="Change node" theme="light" onPress={() => this.swapHarvesting()} />
						</Section>}
						{status === 'ACTIVE' && 
						<Section type="form-item">
								<Button isLoading={isLoading} isDisabled={false} text="Stop harvesting" theme="light" onPress={() => this.stopHarvesting()} />
						</Section>}
					</Section>
                </Section>
			</GradientBackground>
            //</ImageBackground>
        );
    }
}

export default connect(state => ({
    status: state.harvesting.status,
    totalBlockCount: state.harvesting.harvestedBlockStats.totalBlockCount,
    totalFeesEarned: state.harvesting.harvestedBlockStats.totalFeesEarned,
}))(Harvest);
