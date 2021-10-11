import React, { Component } from 'react';
import { StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Section, GradientBackground, Row, TitleBar, Dropdown, EmptyListMessage, ListContainer, ListItem } from '@src/components';
import { connect } from 'react-redux';
import MultisigFilter from '@src/components/molecules/MultisigFilter';
import store from '@src/store';
import Transaction from '@src/components/organisms/transaction';
import { TransactionDetails } from '@src/components';
import translate from "@src/locales/i18n";

const styles = StyleSheet.create({
    list: {
        marginBottom: 10,
        flex: 1,
    },
    filter: {
        flexGrow: 1,
    },
    filterRight: {
        width: '50%',
        marginLeft: 5,
    },
    loadingText: {
        marginTop: 6,
    },
});

type Props = {};

type State = {};

class History extends Component<Props, State> {
    state = {
        showingDetails: -1,
    };

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

    onRefresh = () => {
        store.dispatchAction({ type: 'transaction/changeFilters', payload: {} });
    };

    onSelectFilter = filterValue => {
        store.dispatchAction({ type: 'transaction/changeFilters', payload: { directionFilter: filterValue } });
        this.setState({ filterValue });
    };

    onSelectMultisig = multisig => {
        store.dispatchAction({ type: 'transaction/changeFilters', payload: { addressFilter: multisig } });
        this.setState({ selectedMultisig: multisig });
    };

    loadNextPage = () => {
        const { isLastPage } = this.props;
        if (!isLastPage) {
            store.dispatchAction({ type: 'transaction/loadNextPage' });
        }
    };

    renderTransactionItem = showingDetailsIndex => ({ item, index }) => {
		return (
            <ListItem onPress={() => this.showDetails(index)}>
                <Transaction 
                    transaction={item} 
                    showDetails={showingDetailsIndex === index && item.type !== 'aggregate'} 
                    componentId={this.props.componentId} 
                />
            </ListItem>
        );
    };

    render() {
        const { cosignatoryOf, onOpenMenu, onOpenSettings, transactions, loading, addressFilter, directionFilter, isNextLoading } = this.props;
        const { showingDetails } = this.state;
        const isLoading = isNextLoading || loading;
        const allFilters = [
            { value: 'ALL', label: translate('all') },
            { value: 'SENT', label: translate('history.sent') },
            { value: 'RECEIVED', label: translate('history.received') },
        ];
        const currentTransaction = transactions[showingDetails];

        return (
			<GradientBackground
				name="connector_small"
				theme="light"
				titleBar={<TitleBar theme="light" title={translate('history.title')} onOpenMenu={() => onOpenMenu()} onSettings={() => onOpenSettings()} />}
			>
                <Section type="list">
                    <Section type="form-item">
                        <Row fullWidth>
                            <Dropdown
                                theme="light"
                                style={styles.filter}
                                list={allFilters}
                                title={translate('history.filter')}
                                value={directionFilter}
                                onChange={this.onSelectFilter}
                            />
                            {cosignatoryOf.length > 0 && (
                                <MultisigFilter theme="light" style={styles.filterRight} selected={addressFilter} onSelect={v => this.onSelectMultisig(v)} />
                            )}
                        </Row>
                    </Section>
                </Section>
				<ListContainer style={styles.list} isScrollable={false} isLoading={isLoading}>
					<FlatList
						data={transactions}
						renderItem={this.renderTransactionItem(showingDetails)}
						onEndReachedThreshold={0.9}
						onEndReached={this.loadNextPage}
						keyExtractor={(item, index) => '' + index + 'history'}
                        ListEmptyComponent={EmptyListMessage(!isLoading)}
                        contentContainerStyle={{ flexGrow: 1 }}
						refreshControl={
							<RefreshControl
								//refresh control used for the Pull to Refresh
								refreshing={false}
								onRefresh={this.onRefresh}
							/>
						}
					/>
				</ListContainer>
                {currentTransaction && currentTransaction.type === 'aggregate' && <TransactionDetails
                    transaction={currentTransaction}
                    onClose={() => this.showDetails(-1)} 
                    {...this.props}
                />}
            </GradientBackground>
            // </ImageBackground>
        );
    }
}

export default connect(state => ({
    address: state.account.selectedAccountAddress,
    cosignatoryOf: state.account.cosignatoryOf,
    transactions: state.transaction.transactions,
    isLastPage: state.transaction.isLastPage,
    addressFilter: state.transaction.addressFilter,
    directionFilter: state.transaction.directionFilter,
	loading: state.transaction.loading,
	isNextLoading: state.transaction.isNextLoading
}))(History);
