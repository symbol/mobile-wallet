import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import GlobalStyles from '@src/styles/GlobalStyles';
import GradientButtonLight from './GradientButtonLight/index.js';
import GradientButtonDark from './GradientButtonDark/index.js';

const styles = StyleSheet.create({
    root: {
        //width: '100%',
    },
    fullWidth: {
        width: '100%',
    },
});

type Theme = 'light' | 'dark';

interface Props {
    fullWidth: boolean;
    theme: Theme;
}

type State = {};

export default class Input extends Component<Props, State> {
    render() {
        const {
            style = {},
            theme,
            isLoading,
            isDisabled,
            onPress,
            text,
            fullWidth,
            ...rest
        } = this.props;
        let rootStyle = [styles.root, style];

        if (fullWidth) rootStyle.push(styles.fullWidth);

        const Button =
            theme === 'light' ? GradientButtonLight : GradientButtonDark;

        return (
            <Button
                style={rootStyle}
                loading={isLoading}
                disabled={isDisabled || isLoading}
                onPress={onPress}
                title={text}
                {...rest}
            />
        );
    }
}
