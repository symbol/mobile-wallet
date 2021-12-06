import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
    large: {
        height: 128,
        width: 128,
    },
    big: {
        height: 64,
        width: 64,
    },
    medium: {
        height: 24,
        width: 24,
    },
    small: {
        height: 16,
        width: 16,
    },
    mini: {
        height: 10,
        width: 10,
    },
});

const transactionIcons = {
    unknown: require('@src/assets/icons/transaction/unknown.png'),
    incoming: require('@src/assets/icons/transaction/incoming.png'),
    outgoing: require('@src/assets/icons/transaction/outgoing.png'),
    aggregate: require('@src/assets/icons/transaction/aggregate.png'),
    fundsLock: require('@src/assets/icons/transaction/fundsLock.png'),
    namespace: require('@src/assets/icons/transaction/namespace.png'),
    mosaicAlias: require('@src/assets/icons/transaction/namespace.png'),
    postLaunchOptIn: require('@src/assets/icons/transaction/optin-transaction.png'),
};

export default class TransactionIcon extends Component<Props, State> {
    render() {
        const { style = {}, name, size } = this.props;
        const source = transactionIcons[name];
        let _style = {};
        switch (size) {
            case 'large':
                _style = styles.large;
                break;
            case 'big':
                _style = styles.big;
                break;
            case 'medium':
                _style = styles.medium;
                break;
            case 'small':
                _style = styles.small;
                break;
            case 'mini':
                _style = styles.mini;
                break;
            default:
                _style = styles.medium;
                break;
        }

        if (!source) return <View style={[_style, style]} />;
        return <Image style={[_style, style]} source={source} />;
    }
}
