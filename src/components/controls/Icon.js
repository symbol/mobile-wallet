import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';



const styles = StyleSheet.create({
	large: {
		height: 128,
		width: 128
	},
	big: {
		height: 64,
		width: 64
	},
	medium: {
		height: 32,
		width: 32
	},
	small: {
		height: 16,
		width: 16
	},
});


type IconName = 'none';

type Size = 'large'
	| 'big'
	| 'medium'
	| 'small';

interface Props {
	name: IconName,
	size: Size
};

type State = {};


export default class C extends Component<Props, State> {
    render() {
		const { style = {}, name, size } = this.props;
		let source;
		let _style = {};

		switch(name) {
			case 'none': 
				source = require('../../assets/icons/signature_light.png');
				break;
			default:
				source = require('../../assets/icons/signature_light.png');
				break;
		}

		switch(size) {
			case 'large': 
				_style = styles.large
				break;
			case 'big': 
				_style = styles.big
				break;
			case 'medium': 
				_style = styles.medium
				break;
			case 'small': 
				_style = styles.small
				break;
			default:
				_style = styles.medium
				break;
		}

        return <Image style={[_style, style]} source={source} />;
    };
}
