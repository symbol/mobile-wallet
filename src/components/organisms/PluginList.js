import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Row, Col, Icon, Text, PriceChart } from '@src/components';
import GlobalStyles from '../../styles/GlobalStyles';
import translate from '@src/locales/i18n';
import { Router, BASE_SCREEN_NAME } from '@src/Router';
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
    root: {
        width: '100%',
        marginTop: 34,
        //backgroundColor: '#fff1',//GlobalStyles.color.SECONDARY,
        //borderTopColor:  '#fff2',//GlobalStyles.color.PINK,
        //borderTopWidth: 1
    },
    item: {
        padding: 5,
        marginLeft: 10,
        marginRight: 10,
    },
    circle: {
        height: 60,
        width: 60,
        borderRadius: 60 / 2,
        backgroundColor: GlobalStyles.color.DARKWHITE,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    icon: {
        marginTop: 2,
        marginBottom: 4,
    },
});

type Plugin = {
    text: string,
    iconName: string,
    name: string,
};

type Props = {
    menuItemList: MenuItem[],
    onChange: function,
};

interface State {
    items: MenuItem[];
}

class PluginList extends Component<Props, State> {
    // TODO: Move navigation menu items to config file
    state = {};
    componentDidMount() {}

    onOpen = name => {
        console.log(this.props.componentId);
        Router.goToScreen(`${BASE_SCREEN_NAME}.${name}`, {}, this.props.componentId);
    };

    render = () => {
        const { style = {}, isNodeUp } = this.props;
        const {} = this.state;
        const pluginList = [
            {
                text: 'plugin.send',
                name: 'SEND_SCREEN',
                iconName: 'send',
            },
            {
                text: 'plugin.receive',
                name: 'RECEIVE_SCREEN',
                iconName: 'receive',
            },
            {
                text: 'plugin.more',
                name: 'DASHBOARD_SCREEN',
                iconName: 'options_light',
            },
        ];

        return (
            <View style={[styles.root, style]}>
                <Row justify="space-around" align="center" wrap>
                    {pluginList.map(item => (
                        <Col align="center" justify="center" style={styles.item}>
                            <TouchableOpacity style={styles.circle} onPress={() => this.onOpen(item.name)} disabled={!isNodeUp}>
                                <Col align="center" justify="center" style={{ height: '100%' }}>
                                    <Icon name={item.iconName} size="small" style={styles.icon} />
                                </Col>
                            </TouchableOpacity>
                            <Text type="bold">{translate(item.text)}</Text>
                        </Col>
                    ))}
                </Row>
            </View>
        );
    };
}

export default connect(state => ({
    isNodeUp: state.network.isUp,
}))(PluginList);
