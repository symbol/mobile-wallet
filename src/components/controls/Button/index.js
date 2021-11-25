import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import GradientButtonLight from './GradientButtonLight/index.js';
import GradientButtonDark from './GradientButtonDark/index.js';

const styles = StyleSheet.create({
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
        let rootStyle = [style];

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
