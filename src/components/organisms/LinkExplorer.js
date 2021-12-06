import React, { Component } from 'react';
import { Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, Row, Text } from '@src/components';
import translate from '@src/locales/i18n';
import GlobalStyles from '@src/styles/GlobalStyles';
import { getExplorerURL } from '@src/config/environment';
import { connect } from 'react-redux';

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

class LinkExplorer extends Component<Props, State> {
    uglifyAddress = address => {
        return address.replace(/-/g, '');
    };

    onPress = route => {
        Linking.openURL(getExplorerURL(this.props.network) + route);
    };

    render = () => {
        const { type, value } = this.props;
        let text = translate('link.blockExplorer');
        let route = '';

        switch (type) {
            case 'block:':
                text = translate('link.blockExplorerBlock');
                route = 'blocks/' + value;
                break;
            case 'account':
                text = translate('link.blockExplorerAccount');
                route = 'accounts/' + this.uglifyAddress(value);
                break;
            case 'transaction':
                text = translate('link.blockExplorerTransaction');
                route = 'transactions/' + value;
                break;
            case 'mosaic':
                text = translate('link.blockExplorerMosaic');
                route = 'mosaics/' + value;
                break;
            case 'namespace':
                text = translate('link.blockExplorerNamespace');
                route = 'namespaces/' + value;
                break;
        }

        return (
            <TouchableOpacity onPress={() => this.onPress(route)}>
                <Row style={styles.root} align="center">
                    <Icon name="explorer_filled_primary" size="small" style={styles.icon} />
                    <Text type="bold" theme="light" style={styles.text}>
                        {text}
                    </Text>
                </Row>
            </TouchableOpacity>
        );
    };
}

export default connect(state => ({
    network: state.network.selectedNetwork.type,
}))(LinkExplorer);
