import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Col, PriceChart, Row, Text } from '@src/components';
import GlobalStyles from '../../styles/GlobalStyles';
import { connect } from 'react-redux';
import store from '@src/store';

// TODO: Remove font styles. Use <Text type={} /> instead
const styles = StyleSheet.create({
    root: {
        marginTop: 44,
        width: '100%',
    },
    priceChart: {
        position: 'absolute',
        top: -60,
        //left: -64
    },
    currencyText: {
        fontSize: 15,
        marginBottom: 8,
        color: GlobalStyles.color.onDark.TEXT,
    },
    balanceText: {
        fontFamily: 'NotoSans-SemiBold',
        fontSize: 36,
        color: GlobalStyles.color.onDark.TEXT,
    },
    bottomContainer: {
        marginTop: 3,
        opacity: 0.5,
    },
    fiatText: {
        fontSize: 15,
        color: GlobalStyles.color.onDark.TEXT,
    },
    priceChange: {
        fontSize: 15,
        color: GlobalStyles.color.GREEN,
    },
});

type Props = {
    showChart: boolean,
    account: any,
};

type State = {
    currency: string,
    balance: string,
    fiat: string,
    priceChange: string,
};

class BalanceWidget extends Component<Props, State> {
    // TODO: Replace with data from Store
    state = {
        currency: 'XYM',
        balance: '12000',
        fiat: '68,148 USD',
        priceChange: '+1.20%',
    };

    reload = () => {
        store.dispatchAction({ type: 'account/loadAllData' });
    };

    render() {
        const { showChart = true, loading } = this.props;
        const { currency, fiat, priceChange } = this.state;
        const { balance } = this.props;
        return (
            <TouchableOpacity style={styles.root} onPress={this.reload}>
                {!!showChart && <PriceChart style={styles.priceChart} />}
                {loading && <ActivityIndicator size="large" color="#ffffff" />}
                {!loading && (
                    <Col>
                        <Row justify="center" align="end">
                            <Text style={styles.balanceText}>{balance} </Text>
                            <Text style={styles.currencyText}>{currency}</Text>
                        </Row>
                        <Row justify="center" style={styles.bottomContainer}>
                            <Text style={styles.fiatText}>{fiat} |</Text>
                            <Text style={styles.priceChange}>{priceChange}</Text>
                        </Row>
                    </Col>
                )}
            </TouchableOpacity>
        );
    }
}

export default connect(state => ({
    balance: state.account.balance,
    loading: state.account.loading,
}))(BalanceWidget);
