import React, { Component } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import {
    AggregateTransactionDetails,
    Dropdown,
    EmptyListMessage,
    GradientBackground,
    ListContainer,
    ListItem,
    Row,
    Section,
    TitleBar,
    TransactionItem,
} from '@src/components';
import { connect } from 'react-redux';
import MultisigFilter from '@src/components/molecules/MultisigFilter';
import { Router } from '@src/Router';
import store from '@src/store';
import translate from '@src/locales/i18n';
import { TransactionType } from 'symbol-sdk';

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

class History extends Component {
    state = {
        selectedTransactionIndex: -1,
    };

    showDetails = index => {
        const { selectedTransactionIndex } = this.state;
        if (selectedTransactionIndex === index) {
            this.setState({
                selectedTransactionIndex: -1,
            });
        } else {
            this.setState({
                selectedTransactionIndex: index,
            });
        }
    };

    onRefresh = () => {
        store.dispatchAction({
            type: 'transaction/changeFilters',
            payload: {},
        });
    };

    onSelectFilter = filterValue => {
        store.dispatchAction({
            type: 'transaction/changeFilters',
            payload: { filter: filterValue },
        });
        this.setState({ filterValue });
    };

    onSelectMultisig = multisig => {
        store.dispatchAction({
            type: 'transaction/changeFilters',
            payload: { addressFilter: multisig },
        });
        this.setState({ selectedMultisig: multisig });
    };

    loadNextPage = () => {
        const { isLastPage } = this.props;

        if (isLastPage) {
            return;
        }

        try {
            store.dispatchAction({ type: 'transaction/loadNextPage' });
        } catch (error) {
            Router.showMessage({
                message: `${translate('t_notranslate.loadTransactionList')}.\n${error.message}`,
                type: 'danger',
            });
        }
    };

    render() {
        const { cosignatoryOf, onOpenMenu, onOpenSettings, transactions, isLoading, addressFilter, filter } = this.props;
        const { selectedTransactionIndex } = this.state;
        const allFilters = [
            { value: 'ALL', label: translate('history.all') },
            { value: 'SENT', label: translate('history.sent') },
            { value: 'RECEIVED', label: translate('history.received') },
            { value: 'BLOCKED', label: translate('history.blocked') },
        ];
        const selectedTransaction = transactions[selectedTransactionIndex];

        const isAggregate = transaction => {
            return (
                transaction.transactionType === TransactionType.AGGREGATE_BONDED ||
                transaction.transactionType === TransactionType.AGGREGATE_COMPLETE
            );
        };

        return (
            <GradientBackground
                name="connector_small"
                theme="light"
                titleBar={
                    <TitleBar
                        theme="light"
                        title={translate('history.title')}
                        onOpenMenu={() => onOpenMenu()}
                        onSettings={() => onOpenSettings()}
                    />
                }
            >
                <Section type="list">
                    <Section type="form-item">
                        <Row fullWidth>
                            <Dropdown
                                theme="light"
                                style={styles.filter}
                                list={allFilters}
                                title={translate('history.filter')}
                                value={filter}
                                onChange={this.onSelectFilter}
                            />
                            {cosignatoryOf.length > 0 && (
                                <MultisigFilter
                                    theme="light"
                                    style={styles.filterRight}
                                    selected={addressFilter}
                                    onSelect={v => this.onSelectMultisig(v)}
                                />
                            )}
                        </Row>
                    </Section>
                </Section>
                <ListContainer style={styles.list} isScrollable={false} isLoading={isLoading}>
                    <FlatList
                        data={transactions}
                        onEndReachedThreshold={0.9}
                        onEndReached={this.loadNextPage}
                        keyExtractor={(item, index) => '' + index + 'history'}
                        ListEmptyComponent={EmptyListMessage(!isLoading)}
                        contentContainerStyle={{ flexGrow: 1 }}
                        renderItem={({ item, index }) => (
                            <ListItem onPress={() => this.showDetails(index)}>
                                <TransactionItem
                                    transaction={item}
                                    showDetails={selectedTransactionIndex === index && !isAggregate(item)}
                                    componentId={this.props.componentId}
                                />
                            </ListItem>
                        )}
                        refreshControl={<RefreshControl refreshing={false} onRefresh={this.onRefresh} />}
                    />
                </ListContainer>
                {selectedTransaction && isAggregate(selectedTransaction) && (
                    <AggregateTransactionDetails
                        transaction={selectedTransaction}
                        onClose={() => this.showDetails(-1)}
                        onError={this.onRefresh}
                        {...this.props}
                    />
                )}
            </GradientBackground>
        );
    }
}

export default connect(state => ({
    address: state.account.selectedAccountAddress,
    cosignatoryOf: state.account.cosignatoryOf,
    transactions: state.transaction.transactions,
    isLastPage: state.transaction.isLastPage,
    addressFilter: state.transaction.addressFilter,
    filter: state.transaction.filter,
    isLoading: state.transaction.isLoading,
}))(History);
