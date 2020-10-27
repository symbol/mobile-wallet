import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';


const styles = StyleSheet.create({

});

type Type = 'title' 
	| 'subtitle'
	| 'text'
	| 'center'
	| 'button'
	| 'form'
	| 'form-item';

interface Props {
	type: Type
};

type State = {};


export default class Text extends Component<Props, State> {
    render() {
		const { children, type, style = {} } = this.props;
		let globalStyle = {};

		switch(type) {
			case 'title': 
				globalStyle = GlobalStyles.section.title; 
				break;
			case 'subtitle': 
				globalStyle = GlobalStyles.section.subtitle; 
				break;
			case 'text': 
				globalStyle = GlobalStyles.section.text; 
				break;
			case 'center': 
				globalStyle = GlobalStyles.section.center; 
				break;
			case 'button': 
				globalStyle = GlobalStyles.section.button; 
				break;
			case 'list': 
				globalStyle = GlobalStyles.section.list; 
				break;
			case 'form': 
				globalStyle = GlobalStyles.section.form; 
				break;
			case 'form-item': 
				globalStyle = GlobalStyles.section.formItem; 
				break;
		}

        return (
			<View style={[globalStyle, style]}>
				{children}
			</View>
        );
    };
}
