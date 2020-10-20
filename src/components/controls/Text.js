import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';


const styles = StyleSheet.create({

});

type Type = 'title' 
	| 'subtitle'
	| 'alert'
	| 'bold';

interface Props {
	type: Type
};

type State = {};


export default class ComponentName extends Component<Props, State> {
    render() {
		const { children, type, style = {} } = this.props;
		let globalStyle = {};

		switch(type) {
			case 'title': 
				globalStyle = GlobalStyles.text.title; 
				break;
			case 'subtitle': 
				globalStyle = GlobalStyles.text.subtitle; 
				break;
			case 'alert': 
				globalStyle = GlobalStyles.text.alert; 
				break;
			case 'bold': 
				globalStyle = GlobalStyles.text.bold; 
				break;
			default: 
				globalStyle = GlobalStyles.text.regular; 
				break;
		}

        return (
			<Text style={[globalStyle, style]}>
				{children}
			</Text>
        );
    };
}
