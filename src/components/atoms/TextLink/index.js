/**
 * @format
 * @flow
 */

import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';

import styles from './textlink.styl';

type Props = View.propTypes.style & {
    children: string,
    href: () => void,
    disabled?: boolean,
    accessibilityLabel?: string,
};

const TextLink = (props: Props) => {
    const { children, disabled, href, style, accessibilityLabel } = props;
    const defaultTextStyle = disabled ? styles.disabledTextStyle : styles.activeTextStyle;
    const opacity = disabled ? 1.0 : 0.85;

    return (
        <TouchableHighlight
            accessibilityLabel={accessibilityLabel}
            activeOpacity={opacity}
            disabled={disabled}
            testID={testIDs.button}
            onPress={href}
            underlayColor={styles.underlayColor.color}
        >
            <Text testID={testIDs.text} style={[defaultTextStyle, style]}>
                {children}
            </Text>
        </TouchableHighlight>
    );
};

TextLink.defaultProps = {
    accessibilityLabel: 'Button',
    disabled: false,
};

export const testIDs = {
    button: 'link-button',
    text: 'link-text',
};

export default TextLink;
