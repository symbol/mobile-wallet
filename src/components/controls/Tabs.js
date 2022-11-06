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
    tabSm: {
        marginLeft: 24,
        paddingBottom: 5,
    },
    tabMd: {
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
    const { list, space, style, testID, value, onChange } = props;

    const rootStyle = [styles.root, style];
    const baseTabStyle = space === 'md' ? styles.tabMd : styles.tabSm;
    const getTabStyle = item => (item.value === value ? [baseTabStyle, styles.activeTab] : baseTabStyle);

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
    space: PropTypes.oneOf(['sm', 'md']),
    style: PropTypes.object,
    testID: PropTypes.string,
    value: PropTypes.any.isRequired,
    onChange: PropTypes.isRequired,
};

Tabs.defaultProps = {
    space: 'sm',
};
