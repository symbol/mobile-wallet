import React, { Component } from 'react';
import { Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, Row, Text } from '@src/components';
import translate from '@src/locales/i18n';
import GlobalStyles from '@src/styles/GlobalStyles';
import { getFaucetUrl } from '@src/config/environment';

const styles = StyleSheet.create({
    icon: {
        marginRight: 8,
    },
    text: {
        color: GlobalStyles.color.PRIMARY,
    },
});

type Theme = 'light' | 'dark';

interface Props {
    fullWidth: boolean;
    theme: Theme;
}

type State = {};

export default class LinkFaucet extends Component<Props, State> {
    uglifyAddress = address => {
        return address.replace(/-/g, '');
    };

    onPress = route => {
        Linking.openURL(getFaucetUrl() + route);
    };

    render = () => {
        const { value } = this.props;
        let text = translate('link.faucet');
        let route = '?recipient=' + value;

        return (
            <TouchableOpacity onPress={() => this.onPress(route)}>
                <Row style={styles.root} align="center">
                    <Icon
                        name="faucet_filled_primary"
                        size="small"
                        style={styles.icon}
                    />
                    <Text type="bold" theme="light" style={styles.text}>
                        {text}
                    </Text>
                </Row>
            </TouchableOpacity>
        );
    };
}
