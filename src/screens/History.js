import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Section, ImageBackground, Text, Row, TitleBar } from '@src/components';
import Transaction from '@src/components/organisms/Transaction';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
});

type Props = {};

type State = {};

class History extends Component<Props, State> {
    state = {};

    render() {
        const { transactions } = this.props;
        const {} = this.state;

        return (
            <ImageBackground name="tanker">
                <TitleBar theme="light" title="Transactions" />
                <Section type="list" isScrollable>
                    {transactions &&
                        transactions.map(tx => {
                            return <Transaction transaction={tx} />;
                        })}
                </Section>
            </ImageBackground>
        );
    }
}

export default connect(state => ({
    transactions: state.account.transactions,
}))(History);
