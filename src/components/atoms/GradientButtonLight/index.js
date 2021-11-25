import React, { Component } from 'react';
import {
    AccessibilityTrait,
    GestureResponderEvent,
    Image,
    ImageSourcePropType,
    Platform,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './button.styl';

interface Props {
    title: string;
    fill?: boolean;
    loading?: boolean;
    accessibilityLabel?: string;
    color?: any;
    disabled?: boolean;
    hasTVPreferredFocus?: boolean;
    onPress?: (event: GestureResponderEvent) => void;
    testID?: string;
    style?: [];
    icon?: ImageSourcePropType;
}

// TODO: Should define a theme and load defaults from there.
// For eg., colors for primary, secondary and accent. Maybe a global dark or light theme
class GradientButton extends Component<Props> {
    render() {
        const {
            title,
            fill,
            loading,
            accessibilityLabel,
            disabled,
            onPress,
            testID,
            style,
            icon,
        } = this.props;
        const buttonStyles = [styles.button, fill || styles.button__fill];
        const {
            gradient__colors: gradientColorsObj,
            gradient__start: gradientStart,
            gradient__end: gradientEnd,
        } = styles;
        const gradientColors = [
            disabled ? 'transparent' : gradientColorsObj.start,
            disabled ? 'transparent' : gradientColorsObj.center,
            disabled ? 'transparent' : gradientColorsObj.end,
        ];
        const textStyles = [styles.text, fill || styles.text__fill];

        const accessibilityTraits: AccessibilityTrait[] = ['button'];

        if (disabled) {
            buttonStyles.push(
                styles.button__disabled,
                fill && styles.button__fill__disabled
            );
            textStyles.push(
                styles.text__disabled,
                fill && styles.text__fill_disabled
            );
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

        const titleLabel =
            Platform.OS === 'android' ? title.toLocaleUpperCase() : title;

        return (
            <View
                style={[
                    styles.wrapper,
                    disabled && styles.wrapperDisabled,
                    {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                        elevation: 2,
                    },
                    style,
                ]}
            >
                <Touchable
                    accessibilityComponentType="button"
                    accessibilityLabel={accessibilityLabel}
                    accessibilityTraits={accessibilityTraits}
                    testID={testID}
                    disabled={disabled}
                    onPress={!loading ? onPress : () => {}}
                    {...otherNativeProps}
                >
                    <LinearGradient
                        start={gradientStart}
                        end={gradientEnd}
                        colors={gradientColors}
                        style={[buttonStyles]}
                        elevation={fill ? 3 : undefined}
                    >
                        {loading ? (
                            <View style={styles.buttonContent}>
                                <Image
                                    style={styles.loader}
                                    source={require('@src/assets/loader.gif')}
                                />
                            </View>
                        ) : (
                            <View style={styles.buttonContent}>
                                <Image style={styles.icon} source={icon} />
                                <Text style={textStyles}>{titleLabel}</Text>
                            </View>
                        )}
                    </LinearGradient>
                </Touchable>
            </View>
        );
    }
}

export default GradientButton;
