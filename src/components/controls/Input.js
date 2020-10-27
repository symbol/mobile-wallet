import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import GlobalStyles from '@src/styles/GlobalStyles';


const styles = StyleSheet.create({
	root: {
		width: '100%',
		marginBottom: 10
		//backgroundColor: '#f005',
	},
	placeholderLight: {
		color: GlobalStyles.color.GREY3
	},
	placeholderDark: {
		color: GlobalStyles.color.PINK
	},
	inputLight: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderWidth: 1,
		borderRadius: 2,
		borderColor: GlobalStyles.color.GREY4,
		color: GlobalStyles.color.GREY1,
		fontSize: 12,
		fontFamily: 'NotoSans-SemiBold',
		fontWeight: '300'
	},
	inputDark: {

	}
});

type Theme = 'light' 
	| 'dark';

interface Props {
	fullWidth: boolean;
	theme: Theme;
};

type State = {};


export default class Input extends Component<Props, State> {
    render() {
		const { style = {}, theme, value, placeholder, ...rest } = this.props;
		let inputStyle = {};
		let placeholderTextColor;
		let nativePlaceholder;
		let placeholderStyle;

		if(typeof align === 'string')
			globalStyle.textAlign = align;


		if(theme === 'light') {
			placeholderTextColor = GlobalStyles.color.PRIMARY,
			inputStyle = styles.inputLight;
			placeholderStyle = styles.placeholderLight;
			nativePlaceholder = '';
		}	
		else {
			placeholderTextColor = GlobalStyles.color.PINK
			inputStyle = styles.inputDark;
			placeholderStyle = styles.placeholderDark;
			nativePlaceholder = placeholder;
		}

        return (
			<View style={[styles.root, style]}>
				{(!!value || theme === 'light') && <Text style={placeholderStyle}>{placeholder}</Text>}
				<TextInput
					{...rest}
					value={value}
					style={[inputStyle]}
					placeholder={nativePlaceholder}
					placeholderTextColor={placeholderTextColor}
					autoCapitalize="none"
					underlineColorAndroid="transparent"
				/>
			</View>
        );
    };
}
