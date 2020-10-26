import React, { Component } from 'react';
import { Text } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';


type Theme = 'light' 
	| 'dark';

interface Props {
	fullWidth: boolean;
	theme: Theme;
};

type State = {};


export default class C extends Component<Props, State> {
    render() {
		const { children, type, style = {}, align, theme } = this.props;
		let globalStyle = {};

		switch(type) {
			case 'title': 
				globalStyle = {...GlobalStyles.text.title}; 
				break;
			case 'subtitle': 
				globalStyle = {...GlobalStyles.text.subtitle}; 
				break;
			case 'alert': 
				globalStyle = {...GlobalStyles.text.alert}; 
				break;
			case 'bold': 
				globalStyle = {...GlobalStyles.text.bold}; 
				break;
			case 'regular':
				globalStyle = {...GlobalStyles.text.regular}; 
				break;
		}

		if(typeof align === 'string')
			globalStyle.textAlign = align;

		if(theme === 'light')
			globalStyle.color = GlobalStyles.color.onLight.TEXT;
		else
			globalStyle.color = GlobalStyles.color.onDark.TEXT;

        return (
			<Text style={[globalStyle, style]}>
				{children}
			</Text>
        );
    };
}
