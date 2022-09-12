import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Row, Text } from '@src/components';
import GlobalStyles from '@src/styles/GlobalStyles';

const styles = StyleSheet.create({
    root: {
        borderBottomWidth: 2,
        marginBottom: 2,
        borderColor: GlobalStyles.color.WHITE,
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
    const { list, style, testID, value, onChange } = props;

    const rootStyle = [styles.root, style];
    const getTabStyle = item => (item.value === value ? [styles.tab, styles.activeTab] : styles.tab);

    return (
        <Row style={rootStyle} testID={testID}>
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

Tabs.propsTypes = {
    list: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.any.isRequired,
        })
    ).isRequired,
    style: PropTypes.object,
    testID: PropTypes.string,
    value: PropTypes.any.isRequired,
    onChange: PropTypes.isRequired,
};
