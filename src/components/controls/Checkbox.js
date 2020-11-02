import React, { Component } from 'react';
import { 
	StyleSheet, 
	Text, 
	View, 
	TouchableOpacity, 
	TouchableWithoutFeedback,
	Modal,
	FlatList,
	ActivityIndicator
} from 'react-native';
import GlobalStyles from '@src/styles/GlobalStyles';
import { Icon, Row } from '@src/components';


const styles = StyleSheet.create({
	root: {
		//backgroundColor: '#f005',
	},
	fullWidth: {
		width: '100%',
	},
	titleLight: {
		color: GlobalStyles.color.GREY3,
	},
	titleDark: {
		color: GlobalStyles.color.WHITE,
	}
});

type Theme = 'light' 
	| 'dark';

interface Props {
	fullWidth: boolean;
	theme: Theme;
	value: boolean;
	title: String;
	checkedTitle: String;
	uncheckedTitle: String;
};

type State = {};


export default class Dropdown extends Component<Props, State> {
	onChange = () => {
		if(typeof this.props.onChange === 'function')
			this.props.onChange(!this.props.value);
		else
			console.error('Checkbox error. onChange callback is not provided');
	};

    render = () => {
		const { 
			style = {}, 
			theme, 
			fullWidth, 
			value,  
			title,
			title,
			checkedTitle,
			uncheckedTitle,
			children
		} = this.props;
		let rootStyle = [styles.root, style];
		let titleStyle = {};

		if(fullWidth)
			rootStyle.push(styles.fullWidth);

		if(theme === 'light') {
			titleStyle = styles.titleLight;
		}	
		else {
			titleStyle = styles.titleDark;
		}

		let titleText = title;
		if(!!value === true && checkedTitle)
			titleText = checkedTitle;
		if(!!value === false && uncheckedTitle)
			titleText = uncheckedTitle;

        return (
			<TouchableOpacity style={rootStyle} onPress={() => this.onChange()}>
				<View style={styles.checkbox}>

				</View>
				<View style={styles.titleContainer}>
				{!children &&
					<Text style={titleStyle}>
						{titleText}
					</Text>
				}
				{children}
				</View>
				
			</TouchableOpacity>
        );
    };
}
