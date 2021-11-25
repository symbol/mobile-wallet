import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import GlobalStyles from '@src/styles/GlobalStyles';
import { Dropdown, Row } from '@src/components';

const styles = StyleSheet.create({
    name: {
        fontSize: 12,
        fontFamily: 'NotoSans-SemiBold',
        fontWeight: '400',
    },
    balance: {
        fontSize: 12,
        color: GlobalStyles.color.GREY3,
    },
});

interface Props {}
type State = {};

export default class MosaicDropdown extends Component<Props, State> {
    renderItem = item => {
        return (
            <Row style={styles.root} justify="space-between">
                <Text style={styles.name}>{item.label}</Text>
                <Text style={styles.balance}>{item.balance}</Text>
            </Row>
        );
    };

    render = () => {
        const { ...rest } = this.props;

        return <Dropdown customInputReneder={this.renderItem} {...rest} />;
    };
}
