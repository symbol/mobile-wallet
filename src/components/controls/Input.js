import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import GlobalStyles from '@src/styles/GlobalStyles';


const styles = StyleSheet.create({
	root: {
		//backgroundColor: '#f005',
	},
	fullWidth: {
		width: '100%',
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
		backgroundColor: GlobalStyles.color.DARKWHITE,
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
		const { style = {}, inputStyle = {}, theme, fullWidth, value, placeholder, ...rest } = this.props;
		let _inputStyle = {};
		let placeholderTextColor;
		let nativePlaceholder;
		let placeholderStyle;
		let rootStyle = [styles.root, style];

		if(fullWidth)
			rootStyle.push(styles.fullWidth);

		if(typeof align === 'string')
			globalStyle.textAlign = align;


		if(theme === 'light') {
			placeholderTextColor = GlobalStyles.color.PRIMARY,
			_inputStyle = styles.inputLight;
			placeholderStyle = styles.placeholderLight;
			nativePlaceholder = '';
		}	
		else {
			placeholderTextColor = GlobalStyles.color.PINK
			_inputStyle = styles.inputDark;
			placeholderStyle = styles.placeholderDark;
			nativePlaceholder = placeholder;
		}

        return (
			<View style={rootStyle}>
				{(!!value || theme === 'light') && <Text style={placeholderStyle}>{placeholder}</Text>}
				<TextInput
					{...rest}
					value={value}
					style={[_inputStyle, inputStyle]}
					placeholder={nativePlaceholder}
					placeholderTextColor={placeholderTextColor}
					autoCapitalize="none"
					underlineColorAndroid="transparent"
				/>
			</View>
        );
    };
}
