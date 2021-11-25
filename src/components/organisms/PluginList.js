import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Col, Icon, PriceChart, Row, Text } from '@src/components';
import GlobalStyles from '../../styles/GlobalStyles';
import translate from '@src/locales/i18n';
import { BASE_SCREEN_NAME, Router } from '@src/Router';
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
    root: {
        width: '100%',
        paddingTop: 17,
        paddingBottom: 17,
        //backgroundColor: '#f005',
        //backgroundColor: '#fff1',//GlobalStyles.color.SECONDARY,
        //borderTopColor:  '#fff2',//GlobalStyles.color.PINK,
        //borderTopWidth: 1
    },
    item: {
        padding: 5,
        marginLeft: 20,
        marginRight: 20,
    },
    circle: {
        height: 60,
        width: 60,
        borderRadius: 60 / 2,
        backgroundColor: GlobalStyles.color.DARKWHITE,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    gradient: {
        height: 60,
        width: 60,
        borderRadius: 60 / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginTop: 2,
        marginBottom: 2,
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
        Router.goToScreen(
            `${BASE_SCREEN_NAME}.${name}`,
            {},
            this.props.componentId
        );
    };

    render = () => {
        const { style = {}, isNodeUp, theme, isMultisig } = this.props;
        const {} = this.state;
        const pluginList = [
            {
                text: 'plugin.send',
                name: 'SEND_SCREEN',
                iconName: 'send',
                disabled: isMultisig,
            },
            {
                text: 'plugin.receive',
                name: 'RECEIVE_SCREEN',
                iconName: 'receive',
            },
            {
                text: 'plugin.qr',
                name: 'QR_SCANNER_SCREEN',
                iconName: 'qr_scanner',
            },
            // {
            //     text: 'plugin.more',
            //     name: 'DASHBOARD_SCREEN',
            //     iconName: 'options_light',
            // },
        ];

        return (
            <View style={[styles.root, style]}>
                <Row justify="center" align="center" wrap>
                    {pluginList.map((item, index) => (
                        <Col
                            align="center"
                            justify="center"
                            style={styles.item}
                            key={'' + index + 'plugin'}
                        >
                            <TouchableOpacity
                                style={styles.circle}
                                onPress={() => this.onOpen(item.name)}
                                disabled={!isNodeUp || item.disabled}
                            >
                                {/* <Col align="center" justify="center" > */}
                                <LinearGradient
                                    style={styles.gradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={[
                                        GlobalStyles.color.WHITE,
                                        GlobalStyles.color.DARKWHITE,
                                    ]}
                                >
                                    <Icon
                                        name={item.iconName}
                                        size="medium"
                                        style={styles.icon}
                                    />
                                </LinearGradient>
                                {/* </Col> */}
                            </TouchableOpacity>
                            <View style={{ maxWidth: 100 }}>
                                <Text type="bold" theme={theme} align="center">
                                    {translate(item.text)}
                                </Text>
                            </View>
                        </Col>
                    ))}
                </Row>
            </View>
        );
    };
}

export default connect(state => ({
    isNodeUp: state.network.isUp,
    isMultisig: state.account.isMultisig,
}))(PluginList);
