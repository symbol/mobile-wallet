import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Input, Icon } from '@src/components';
import GlobalStyles from '@src/styles/GlobalStyles';
import { keys } from 'lodash';


const styles = StyleSheet.create({
	root: {
		flexDirection: 'row'
		//backgroundColor: '#f005',
	},
	fullWidth: {
		width: '100%',
	},
	icon: {
		position: 'absolute',
		bottom: 0,
		height: 45,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

type Theme = 'light' 
	| 'dark';

interface Props {
	fullWidth: boolean;
	theme: Theme;
};

type State = {};


export default class InputAccount extends Component<Props, State> {
	importWithAddressBook = () => {
		setTimeout(() => {
			if(typeof this.props.onChangeText === 'function')
				this.props.onChangeText('This is from AddressBook');
		}, 1000);
	};

	importWithQR = () => {
		setTimeout(() => {
			if(typeof this.props.onChangeText === 'function')
				this.props.onChangeText('This is from QR');
		}, 1000);
	};

	importWithClipboard = () => {
		setTimeout(() => {
			if(typeof this.props.onChangeText === 'function')
				this.props.onChangeText('This is from Clipboard');
		}, 1000);
	};

	getIconPosition = (index, k, offset) => {
		return {
			right: index * k + offset,
			width: k
		}
	};

	getInputStyle = (numberOfIcons, k, offset) => {
		return {
			paddingRight: numberOfIcons * k + offset
		}
	}

    render = () => {
		const { style = {}, fullWidth, ...rest } = this.props;
		let rootStyle = [styles.root, style];
		const iconSize = 'small';
		const iconTouchableWidth = 30;
		const iconOffset = 5;
		const numberOfIcons = 2;

		if(fullWidth)
			rootStyle.push(styles.fullWidth);


        return (
			<View style={rootStyle}>
				<Input
					{...rest}
					fullWidth={fullWidth}
					inputStyle={this.getInputStyle(numberOfIcons, iconTouchableWidth, iconOffset)}
				/>
				{/* <TouchableOpacity 
					style={[styles.icon, this.getIconPosition(2, iconTouchableWidth, iconOffset)]} 
					onPress={() => this.importWithAddressBook()}
				>
					<Icon name="paste" size={iconSize} />
				</TouchableOpacity> */}
				<TouchableOpacity 
					style={[styles.icon, this.getIconPosition(1, iconTouchableWidth, iconOffset)]} 
					onPress={() => this.importWithQR()}
				>
					<Icon name="qr" size={iconSize} />
				</TouchableOpacity>
				<TouchableOpacity 
					style={[styles.icon, this.getIconPosition(0, iconTouchableWidth, iconOffset)]} 
					onPress={() => this.importWithClipboard()}
				>
					<Icon name="paste" size={iconSize} />	
				</TouchableOpacity>
				
				
			</View>
        );
    };
}
