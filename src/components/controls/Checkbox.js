import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Modal, Image } from 'react-native';
import GlobalStyles from '@src/styles/GlobalStyles';
import { Icon, Row } from '@src/components';

const styles = StyleSheet.create({
    root: {
        //backgroundColor: '#f005',
        paddingRight: 8,
    },
    fullWidth: {
        width: '100%',
    },
    checkbox: {
        height: 20,
        width: 20,
        marginTop: 0,
        marginRight: 16,
        backgroundColor: GlobalStyles.color.WHITE,
        borderRadius: 5,
    },
    unchecked: {
        borderWidth: 1,
        borderColor: GlobalStyles.color.PINK,
    },
    icon: {
        height: 20,
        width: 20,
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    titleLight: {
        color: GlobalStyles.color.GREY3,
        //color: GlobalStyles.color.PRIMARY,
        //fontFamily: 'NotoSans-SemiBold'
    },
    titleDark: {
        color: GlobalStyles.color.WHITE,
    },
});

type Theme = 'light' | 'dark';

interface Props {
    fullWidth: boolean;
    theme: Theme;
    value: boolean;
    title: String;
    checkedTitle: String;
    uncheckedTitle: String;
    disabled: boolean;
}

type State = {};

export default class Dropdown extends Component<Props, State> {
    onChange = () => {
        if (typeof this.props.onChange === 'function') this.props.onChange(!this.props.value);
        else console.error('Checkbox error. onChange callback is not provided');
    };

    render = () => {
        const { style = {}, theme, fullWidth, value, title, checkedTitle, uncheckedTitle, children, disabled } = this.props;
        const checkboxStyles = [styles.checkbox];
        let rootStyle = [styles.root, style];
        let titleStyle = {};
        let titleText = title;

        if (fullWidth) rootStyle.push(styles.fullWidth);

        if (theme === 'light') titleStyle = styles.titleLight;
        else titleStyle = styles.titleDark;

        if (!value) checkboxStyles.push(styles.unchecked);

        if (!!value === true && checkedTitle) titleText = checkedTitle;
        if (!!value === false && uncheckedTitle) titleText = uncheckedTitle;

        return (
            <TouchableOpacity disabled={disabled} style={rootStyle} onPress={() => this.onChange()}>
                <Row align="center">
                    <View style={checkboxStyles}>{!!value && <Image style={styles.icon} source={require('@src/assets/icons/check.png')} />}</View>
                    <View style={styles.titleContainer}>
                        {!children && <Text style={titleStyle}>{titleText}</Text>}
                        {children}
                    </View>
                </Row>
            </TouchableOpacity>
        );
    };
}
