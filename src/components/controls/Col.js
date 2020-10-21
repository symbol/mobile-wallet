import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';


const styles = StyleSheet.create({
	'main': {
		display: 'flex',
		flexDirection: 'column'
	},
	'justify-start': {
		justifyContent: 'flex-start'
	},
	'justify-end': {
		justifyContent: 'flex-end'
	},
	'justify-center': {
		justifyContent: 'center'
	},
	'justify-space-around': {
		justifyContent: 'space-around'
	},
	'justify-space-between': {
		justifyContent: 'space-between'
	},
	'align-start': {
		alignItems: 'flex-start'
	},
	'align-center': {
		alignItems: 'center'
	},
	'align-end': {
		alignItems: 'flex-end'
	},
	'wrap': {
		flexWrap: 'wrap'
	}
});

type Justify = 'start' 
	| 'end'
	| 'center'
	| 'space-around'
	| 'space-between';

type Align = 'start' 
	| 'center'
	| 'end';


interface Props {
	justify: Justify;
	align: Align;
	wrap: boolean
};

type State = {};


export default class Col extends Component<Props, State> {
    render() {
		const { 
			children, 
			style = {},
			justify,
			align,
			wrap
		} = this.props;
		const stylesArray = [styles.main];

		if(typeof justify === 'string')
			stylesArray.push(styles['justify-'+justify]);
		if(typeof align === 'string')
			stylesArray.push(styles['align-'+align]);
		if(typeof wrap === 'boolean')
			stylesArray.push(styles.wrap);

		stylesArray.push(style);

        return (
			<View style={stylesArray}>
				{children}
			</View>
        );
    };
}
