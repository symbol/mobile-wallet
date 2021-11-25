/**
 * @format
 * @flow
 */

import React from 'react';
import type { Element } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { ElementProps } from 'react';
import GlobalStyles from '@src/styles/GlobalStyles';

import styles from './titlebar.styl';

export type titleTheme = {
    textColor: string,
    backIconRes: string,
    closeIconRes: string,
};

const lightTheme: titleTheme = {
    textColor: GlobalStyles.color.onLight.TITLE,
    backIconRes: require('@src/assets/icons/ic-back-black.png'),
    closeIconRes: require('@src/assets/icons/close_light.png'),
};

const darkTheme: titleTheme = {
    textColor: GlobalStyles.color.onDark.TITLE,
    backIconRes: require('@src/assets/icons/ic-back-white.png'),
    closeIconRes: require('@src/assets/icons/close_dark.png'),
};

const themeMap = new Map<string, titleTheme>();
themeMap.set('light', lightTheme);
themeMap.set('dark', darkTheme);

type Props = {
    ...ElementProps<typeof View>,
    title?: ?string,
    theme?: 'light' | 'dark',
    showBack?: boolean,
    showClose?: boolean,
    titleTextStyle?: ViewStyleProp,
    onBack?: () => ?boolean,
    onClose?: () => ?boolean,
    alignLeft: boolean,
};

const generateIconButton = (
    testID: string,
    touchableStyle: View.propTypes.style,
    iconRes: string,
    iconStyle: View.propTypes.style,
    onPress: () => void
) => {
    return (
        <TouchableOpacity
            testID={testID}
            style={touchableStyle}
            onPress={onPress}
        >
            <Image style={iconStyle} source={iconRes} resizeMode="center" />
        </TouchableOpacity>
    );
};

function TitleBar(props: Props) {
    const {
        title,
        children,
        titleTextStyle,
        showBack,
        onBack,
        showClose,
        onClose,
        style,
        theme,
        alignLeft,
    } = props;

    const barTheme: titleTheme = themeMap.get(theme) || lightTheme;

    let backButton = null;
    if (showBack) {
        backButton = generateIconButton(
            'back-button',
            styles.leftIconContainer,
            barTheme.backIconRes,
            styles.icon,
            onBack
        );
    }

    let closeButton = null;
    if (showClose) {
        closeButton = generateIconButton(
            'close-button',
            styles.rightIconContainer,
            barTheme.closeIconRes,
            styles.icon,
            onClose
        );
    }

    let titleBarContent = children;
    // Show title only if there are no children
    if (titleBarContent === undefined || titleBarContent === null) {
        const titleStyle = { color: barTheme.textColor, ...titleTextStyle };
        titleBarContent = (
            <Text
                testID="title-text"
                style={[
                    styles.title,
                    titleStyle,
                    alignLeft && styles.titleAlignLeft,
                ]}
                allowFontScaling={false}
            >
                {title}
            </Text>
        );
    }

    return (
        <View style={[styles.titleBarContainer, style]}>
            {backButton}
            {titleBarContent}
            {closeButton}
        </View>
    );
}

TitleBar.defaultProps = {
    title: null,
    theme: 'light',
    showBack: false,
    showClose: false,
    titleTextStyle: null,
    onBack: () => {},
    onClose: () => {},
};

export default TitleBar;
