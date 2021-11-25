import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        borderBottomWidth: 1,
        borderColor: '#d8d8d8',
        height: 40,
        marginTop: 10,
        marginBottom: 10,
    },
    inputLabel: {
        color: '#f0f',
        textTransform: 'uppercase',
        fontSize: 12,
        padding: 0,
        margin: 0,
        textAlign: 'left',
        fontFamily: 'NotoSans-Regular',
    },
    input: {
        color: '#fff',
        width: '100%',
        textAlign: 'left',
        fontSize: 14,
        padding: 0,
        margin: 0,
        fontFamily: 'NotoSans-Regular',
    },
});

type Props = {
    placeholder?: string,
    inputLabel?: ?string,
    returnKeyType?: any,
    onSubmitEditing?: () => void,
    onChangeText?: (text: string) => void,
    secureTextEntry?: boolean,
    testID?: string,
    innerRef?: (ref: any) => void,
    align?: 'left' | 'center' | 'right',
    inputLabelStyle?: any,
    inputStyle?: any,
    autoFocus?: boolean,
    value: string,
};

const Input = (props: Props) => {
    const {
        inputLabel,
        placeholder,
        returnKeyType,
        align,
        innerRef,
        inputLabelStyle,
        inputStyle,
        value,
        ...rest
    } = props;

    return (
        <View style={styles.inputContainer}>
            {!!value && (
                <Text style={[styles.inputLabel, inputLabelStyle]}>
                    {inputLabel}
                </Text>
            )}
            <TextInput
                {...rest}
                value={value}
                style={[styles.input, inputStyle]}
                placeholder={placeholder}
                returnKeyType={returnKeyType}
                placeholderTextColor="#F3F4F8"
                blurOnSubmit={false}
                autoCorrect={false}
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                ref={innerRef}
            />
        </View>
    );
};

Input.defaultProps = {
    placeholder: 'Enter value',
    inputLabel: null,
    returnKeyType: null,
    onSubmitEditing: () => {},
    onChangeText: () => {},
    secureTextEntry: false,
    testID: '',
    innerRef: () => {},
    align: 'center',
    inputLabelStyle: {},
    inputStyle: {},
    autoFocus: false,
};

export default Input;
