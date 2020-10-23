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
		height: 24,
		width: 24
	},
	small: {
		height: 16,
		width: 16
	},
});


type IconName = 'none'
	| 'news'
	| 'mosaics'
	| 'home'
	| 'history'
	| 'harvest';

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
				source = require('../../assets/icons/ic-about.png');
				break;
			case 'news': 
				source = require('../../assets/icons/menu/news.png');
				break;
			case 'mosaics': 
				source = require('../../assets/icons/menu/mosaics.png');
				break;
			case 'home': 
				source = require('../../assets/icons/menu/home.png');
				break;
			case 'history': 
				source = require('../../assets/icons/menu/history.png');
				break;
			case 'harvest': 
				source = require('../../assets/icons/menu/harvest.png');
				break;
			default:
				source = require('../../assets/icons/ic-about.png');
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
