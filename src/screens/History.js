import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Section, ImageBackground, Text, Row, TitleBar } from '@src/components';
import Transaction from '@src/components/organisms/transaction/Transaction';
import { connect } from 'react-redux';
import store from '@src/store';

const styles = StyleSheet.create({
    list: {
        marginBottom: 70,
    },
});

type Props = {};

type State = {};

class History extends Component<Props, State> {
    state = {
        showingDetails: -1,
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
    }

    render() {
        const { dataManager } = this.props;
        const { showingDetails } = this.state;
        const transactions = dataManager.data;

        return (
            <ImageBackground name="tanker" dataManager={dataManager}>
                <TitleBar theme="light" title="Transactions" />
                <Section type="list" style={styles.list} isScrollable>
                    {transactions &&
                        transactions.map((tx, index) => {
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
