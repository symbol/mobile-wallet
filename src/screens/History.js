import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { 
	Section, 
	GradientBackground, 
	ImageBackground, 
	Text, 
	Row, 
	TitleBar, 
	Dropdown, 
	TransactionItem,
	ListContainer,
	ListItem
} from '@src/components';
import { connect } from 'react-redux';
import store from '@src/store';
import type { TransactionModel } from '@src/storage/models/TransactionModel';
import MultisigFilter from '@src/components/molecules/MultisigFilter';

const styles = StyleSheet.create({
    list: {
        marginBottom: 55,
	},
	filter: {
		flexGrow: 1
	},
	filterRight: {
		width: '50%',
		marginLeft: 5
	}
});

type Props = {};

type State = {};

const allFilters = [
    { value: 'all', label: 'All' },
    { value: 'sent', label: 'Sent' },
    { value: 'received', label: 'Received' },
];

class History extends Component<Props, State> {
    state = {
        showingDetails: -1,
        filterValue: 'all',
        selectedMultisig: null,
    };

    componentDidMount() {
        // store.dispatchAction({ type: 'account/loadTransactions' });
        // this.props.dataManager.reset();
    }

    showDetails = index => {
        const { showingDetails } = this.state;
        if (showingDetails === index) {
            this.setState({
                showingDetails: -1,
            });
        } else {
            this.setState({
                showingDetails: index,
            });
        }
    };

    onSelectFilter = filterValue => {
        this.setState({ filterValue });
    };

    onSelectMultisig = multisig => {
        this.setState({ selectedMultisig: multisig });
    };

    render() {
        const { dataManager, address, cosignatoryOf, onOpenMenu, onOpenSettings } = this.props;
        const { showingDetails, filterValue, selectedMultisig } = this.state;
        let transactions;
        if (selectedMultisig) {
            transactions = dataManager.data[selectedMultisig] || [];
        } else {
            transactions = dataManager.data[address] || [];
        }
        const filteredTransactions = transactions.filter((tx: TransactionModel) => {
            switch (filterValue) {
                case 'sent':
                    return tx.signerAddress === address;
                case 'received':
                    return tx.signerAddress !== address;
                default:
                    return true;
            }
        });

        return (
			// <ImageBackground name="tanker" dataManager={dataManager}>
            <GradientBackground name="connector_small" theme="light" dataManager={dataManager}>
				<TitleBar 
					theme="light"
					title="Transactions" 
					onOpenMenu={() => onOpenMenu()} 
					onSettings={() => onOpenSettings()}
				/>
				<Section type="list">
					<Section type="form-item">
						<Row fullWidth>
							<Dropdown
								theme="light"
								style={styles.filter}
								list={allFilters} 
								title={'Filter'} 
								value={filterValue} 
								onChange={this.onSelectFilter} 
							/>
							{cosignatoryOf.length > 0 && <MultisigFilter
								theme="light"
								style={styles.filterRight}
								selected={selectedMultisig} 
								onSelect={v => this.onSelectMultisig(v)} 
							/>}
						</Row>
					</Section>
                </Section>
				<ListContainer style={styles.list}>
                    {filteredTransactions &&
                        filteredTransactions.map((tx, index) => {
                            return (
                                <ListItem onPress={() => this.showDetails(index)}>
                                    <TransactionItem transaction={tx} showDetails={showingDetails === index} />
                                </ListItem>
                            );
                        })}
                </ListContainer>     
            </GradientBackground>
			// </ImageBackground>
        );
    }
}

export default connect(state => ({
    dataManager: state.account.transactionListManager,
    address: state.account.selectedAccountAddress,
    cosignatoryOf: state.account.cosignatoryOf,
}))(History);
