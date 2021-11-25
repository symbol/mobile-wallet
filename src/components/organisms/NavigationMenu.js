import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Col, Icon, Row, Text } from '@src/components';
import GlobalStyles from '../../styles/GlobalStyles';
import translate from '@src/locales/i18n';
import { isIphoneX } from '@src/utils/Device';

const styles = StyleSheet.create({
    root: {
        width: '100%',
        backgroundColor: GlobalStyles.color.WHITE,
    },
    itemBottomLine: {
        padding: 5,
        paddingBottom: 3,
        width: 65,
        borderColor: '#fff0',
        borderBottomWidth: 2,
    },
    itemIos: {
        padding: 5,
        paddingBottom: 0,
        width: 65,
        borderColor: '#fff0',
        borderTopWidth: 2,
    },
    itemTopLine: {
        padding: 3,
        paddingBottom: 3,
        width: 65,
        borderColor: '#fff0',
        borderTopWidth: 2,
    },
    activeItem: {
        borderColor: GlobalStyles.color.PINK,
    },
    icon: {
        marginTop: 5,
        marginBottom: 2,
    },
});

type MenuItem = {
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

export default class NavigationMenu extends Component<Props, State> {
    // TODO: Move navigation menu items to config file
    state = {};
    componentDidMount() {}

    render() {
        const { menuItemList = [], onChange = () => {}, value } = this.props;
        const {} = this.state;
        let extraPadding = {};
        let itemStyle = styles.item;

        if (isIphoneX()) {
            extraPadding = {
                paddingBottom: 32,
            };
            itemStyle = styles.itemIos;
        } else itemStyle = styles.itemTopLine;

        return (
            <View style={[styles.root, extraPadding]}>
                <Row justify="space-around" align="center">
                    {menuItemList.map((item, index) => (
                        <TouchableOpacity
                            onPress={() => onChange(item.name)}
                            key={'' + index + 'nav'}
                        >
                            <Col
                                align="center"
                                justify="space-"
                                style={[
                                    itemStyle,
                                    item.name === value && styles.activeItem,
                                ]}
                            >
                                <Icon
                                    name={item.iconName}
                                    size="small"
                                    style={styles.icon}
                                />
                                <Text
                                    theme="light"
                                    style={{ fontSize: 11 }}
                                    type={
                                        item.name === value ? 'bold' : 'regular'
                                    }
                                >
                                    {translate(item.text)}
                                </Text>
                            </Col>
                        </TouchableOpacity>
                    ))}
                </Row>
            </View>
        );
    }
}
