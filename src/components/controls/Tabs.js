import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Row, Text } from '@src/components';
import GlobalStyles from '@src/styles/GlobalStyles';

const styles = StyleSheet.create({
    root: {
        borderBottomWidth: 2,
        marginBottom: 2,
    },
    borderLight: {
        borderColor: GlobalStyles.color.WHITE,
    },
    borderDark: {
        borderColor: GlobalStyles.color.DARKWHITE,
    },
    tab: {
        marginLeft: 36,
        paddingBottom: 5,
    },
    activeTab: {
        borderBottomColor: GlobalStyles.color.PINK,
        borderBottomWidth: 2,
        marginBottom: -2,
    },
});

export default function Tabs(props) {
    const { border, list, style, value, onChange } = props;

    const rootStyle = [styles.root, border === 'dark' ? styles.borderDark : styles.borderLight, style];
    const getTabStyle = item => (item.value === value ? [styles.tab, styles.activeTab] : styles.tab);

    return (
        <Row style={rootStyle}>
            {list.map((item, index) => (
                <TouchableOpacity style={getTabStyle(item)} key={'tab' + index} onPress={() => onChange(item.value)}>
                    <Text type="bold" theme="light">
                        {item.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </Row>
    );
}
