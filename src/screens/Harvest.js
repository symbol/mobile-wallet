import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Section, ImageBackground, Text, Row, TitleBar } from '@src/components';
import Transaction from '@src/components/organisms/Transaction';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
});

type Props = {};

type State = {};

class Harvest extends Component<Props, State> {
    state = {};

    render() {
        const { transactions } = this.props;
        const {} = this.state;

        return (
            <ImageBackground name="harvest">
                <TitleBar theme="light" title="Harvest" />
                <Section type="list" style={styles.list}>
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
}))(Harvest);
