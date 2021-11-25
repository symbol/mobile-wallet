import React, { Component } from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import GlobalStyles from '@src/styles/GlobalStyles';
import { Row } from '@src/components';

const styles = StyleSheet.create({
    root: {
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
    titleRegular: {
        color: GlobalStyles.color.SECONDARY,
        fontFamily: 'NotoSans-Regular',
        textAlign: 'center',
        fontSize: 12,
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
    loading?: boolean;
}

type State = {};

export default class Dropdown extends Component<Props, State> {
    onChange = () => {
        if (typeof this.props.onChange === 'function')
            this.props.onChange(!this.props.value);
        else console.error('Checkbox error. onChange callback is not provided');
    };

    render = () => {
        const {
            style = {},
            theme,
            fullWidth,
            value,
            title,
            checkedTitle,
            uncheckedTitle,
            children,
            disabled,
            loading,
        } = this.props;
        const checkboxStyles = [styles.checkbox];
        let rootStyle = [styles.root, style];
        let titleStyle = {};
        let titleText = title;

        if (fullWidth) rootStyle.push(styles.fullWidth);

        if (theme === 'light') titleStyle = styles.titleLight;
        else if (theme === 'regular') titleStyle = styles.titleRegular;
        else titleStyle = styles.titleDark;

        if (!value && !loading) checkboxStyles.push(styles.unchecked);

        if (!!value === true && checkedTitle) titleText = checkedTitle;
        if (!!value === false && uncheckedTitle) titleText = uncheckedTitle;

        return (
            <TouchableOpacity
                disabled={disabled}
                style={rootStyle}
                onPress={() => this.onChange()}
            >
                <Row align="center">
                    <View style={checkboxStyles}>
                        {!!value && !loading && (
                            <Image
                                style={styles.icon}
                                source={require('@src/assets/icons/check.png')}
                            />
                        )}
                        {loading && (
                            <ActivityIndicator
                                size="small"
                                color={GlobalStyles.color.PINK}
                            />
                        )}
                    </View>
                    <View style={styles.titleContainer}>
                        {!children && (
                            <Text style={titleStyle}>{titleText}</Text>
                        )}
                        {children}
                    </View>
                </Row>
            </TouchableOpacity>
        );
    };
}
