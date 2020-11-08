import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Section, ImageBackground, Text, Row, TitleBar, Dropdown } from '@src/components';
import Transaction from '@src/components/organisms/transaction/Transaction';
import { connect } from 'react-redux';
import store from '@src/store';
import type { TransactionModel } from '@src/storage/models/TransactionModel';

const styles = StyleSheet.create({
    list: {
        marginBottom: 70,
    },
});

type Props = {};

type State = {};

const allFilters = [
    { value: 'recent', label: 'Recent' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'unconfirmed', label: 'Unconfirmed' },
];

class History extends Component<Props, State> {
    state = {
        showingDetails: -1,
        filterValue: 'recent',
    };

    componentDidMount() {
        store.dispatchAction({ type: 'account/loadTransactions' });
        this.props.dataManager.reset();
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

    render() {
        const { dataManager } = this.props;
        const { showingDetails, filterValue } = this.state;
        const transactions = dataManager.data;
        const filteredTransactions = transactions.filter((tx: TransactionModel) => {
            switch (filterValue) {
                case 'confirmed':
                    return tx.status === 'confirmed';
                case 'unconfirmed':
                    return tx.status === 'unconfirmed';
                default:
                    return true;
            }
        });

        return (
            <ImageBackground name="tanker" dataManager={dataManager}>
                <TitleBar theme="light" title="Transactions" />
                <Dropdown list={allFilters} title={'Filter'} value={filterValue} onChange={this.onSelectFilter} />
                <Section type="list" style={styles.list} isScrollable>
                    {filteredTransactions &&
                        filteredTransactions.map((tx, index) => {
                            return (
                                <TouchableOpacity onPress={() => this.showDetails(index)}>
                                    <Transaction transaction={tx} showDetails={showingDetails === index} />
                                </TouchableOpacity>
                            );
                        })}
                </Section>
            </ImageBackground>
        );
    }
}

export default connect(state => ({
    dataManager: state.account.transactionListManager,
}))(History);
