import React, { Component } from 'react';
import { Text } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';


type Type = 'title' 
	| 'subtitle'
	| 'alert'
	| 'bold';

type Align = 'left' 
	| 'center'
	| 'right';

interface Props {
	type: Type,
	align: Align
};

type State = {};


export default class C extends Component<Props, State> {
    render() {
		const { children, type, style = {}, align } = this.props;
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
			default: 
				globalStyle = {...GlobalStyles.text.regular}; 
				break;
		}

		if(typeof align === 'string')
			globalStyle.textAlign = align;

        return (
			<Text style={[globalStyle, style]}>
				{children}
			</Text>
        );
    };
}
