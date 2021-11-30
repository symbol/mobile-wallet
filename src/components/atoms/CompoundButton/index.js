/**
 * @format
 * @flow
 */

import React from 'react';
import { ActivityIndicator, Image, Platform, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './compoundbutton.styl';

type Props = {
    titleLeft: string,
    titleRight: string,
    loading?: boolean,
    accessibilityLabelLeft?: string,
    accessibilityLabelRight?: string,
    disabled?: boolean,
    onPressLeft?: () => void,
    onPressRight?: () => void,
    testIDLeft?: string,
    testIDRight?: string,
    style?: [],
    iconLeft?: any,
    iconRight?: any,
};

const CompoundButton = (props: Props) => {
    const {
        titleLeft,
        titleRight,
        loading,
        accessibilityLabelLeft,
        accessibilityLabelRight,
        disabled,
        onPressLeft,
        onPressRight,
        style,
        iconLeft,
        iconRight,
        testIDLeft,
        testIDRight,
    } = props;
    const buttonStyles = [styles.button];
    const { gradient__colors: gradientColorsObj, gradient__start: gradientStart, gradient__end: gradientEnd } = styles;
    const gradientColors = [gradientColorsObj.start, gradientColorsObj.end];
    const textStyles = [styles.text];

    const accessibilityTraits = ['button'];

    if (disabled) {
        buttonStyles.push(styles.button__disabled);
        textStyles.push(styles.text__disabled);
        accessibilityTraits.push('disabled');
    }

    let Touchable;
    let otherNativeProps = null;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        Touchable = TouchableNativeFeedback;
        otherNativeProps = { useForeground: true };
    } else {
        Touchable = TouchableOpacity;
        otherNativeProps = { activeOpacity: 0.6 };
    }

    return (
        <View style={[styles.wrapper, style]}>
            <View style={styles.buttonContainer}>
                <LinearGradient
                    start={gradientStart}
                    end={gradientEnd}
                    colors={gradientColors}
                    style={[
                        styles.buttonGroup,
                        {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.2,
                            shadowRadius: 2,
                            elevation: 2,
                        },
                    ]}
                >
                    {/* $FlowFixMe :useForeground props not available for TouchableOpacity */}
                    <Touchable
                        accessibilityComponentType="button"
                        accessibilityLabel={accessibilityLabelLeft}
                        accessibilityTraits={accessibilityTraits}
                        testID={testIDLeft}
                        disabled={disabled}
                        onPress={onPressLeft}
                        style={buttonStyles}
                        {...otherNativeProps}
                    >
                        {loading ? (
                            <ActivityIndicator style={styles.loading} color="white" />
                        ) : (
                            <View style={styles.buttonContent}>
                                <Image style={styles.icon} source={iconLeft} />
                            </View>
                        )}
                    </Touchable>
                    <View style={styles.divider} />
                </LinearGradient>
                <Text style={textStyles}>{titleLeft}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <LinearGradient
                    start={gradientStart}
                    end={gradientEnd}
                    colors={gradientColors}
                    style={[
                        styles.buttonGroup,
                        {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.2,
                            shadowRadius: 2,
                            elevation: 2,
                        },
                    ]}
                >
                    {/* $FlowFixMe :useForeground props not available for TouchableOpacity */}
                    <Touchable
                        accessibilityComponentType="button"
                        accessibilityLabel={accessibilityLabelRight}
                        accessibilityTraits={accessibilityTraits}
                        testID={testIDRight}
                        disabled={disabled}
                        onPress={onPressRight}
                        style={buttonStyles}
                        {...otherNativeProps}
                    >
                        {loading ? (
                            <ActivityIndicator style={styles.loading} color="white" />
                        ) : (
                            <View style={styles.buttonContent}>
                                <Image style={styles.icon} source={iconRight} />
                            </View>
                        )}
                    </Touchable>
                </LinearGradient>
                <Text style={textStyles}>{titleRight}</Text>
            </View>
        </View>
    );
};

CompoundButton.defaultProps = {
    accessibilityLabelLeft: '',
    accessibilityLabelRight: '',
    disabled: false,
    onPressLeft: () => {},
    onPressRight: () => {},
    testIDLeft: '',
    testIDRight: '',
    style: [],
    iconLeft: null,
    iconRight: null,
    loading: false,
};

export default CompoundButton;
