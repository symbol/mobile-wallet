import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import {
	Icon,
	Text,
	Row,
} from '@src/components';
import GlobalStyles from '@src/styles/GlobalStyles';
import { copyToClipboard } from '@src/utils';
import {Router} from "@src/Router";
import {showMessage} from "react-native-flash-message";


const styles = StyleSheet.create({
	text: {
		marginRight: 5,
		maxWidth: '90%'
	},
	button: {
		padding: 10
	},
	placeholderLight: {
		color: GlobalStyles.color.GREY3,
	},
	placeholderDark: {
		color: GlobalStyles.color.PINK,
		textTransform: 'uppercase',
		fontSize: 12,
		padding: 0,
		margin: 0,
		textAlign: 'left',
	},
});;

class CopyView extends Component<Props, State> {
	copyToClipboard = text => {
		Router.showFlashMessageOverlay().then(() => {
			showMessage({
				message: `Copied!`,
				type: 'success',
			});
		});
		copyToClipboard(text)
	};

	render = () => {
		const { children, style = {}, placeholder, theme = 'light'} = this.props;
		let placeholderStyle;

		if(theme === 'light') {
			placeholderStyle = styles.placeholderLight;
		}
		else {
			placeholderStyle = styles.placeholderDark;
		}

		return (<>
			{!!placeholder && <Text style={placeholderStyle}>{placeholder}</Text>}
			<Row align="center" justify="space-between">
				<Text type="regular" theme={theme} style={[styles.text, style]}>{children}</Text>
				<TouchableOpacity style={styles.button} onPress={() => this.copyToClipboard(children)}>
					<Icon name="copy" size="small" />
				</TouchableOpacity>
			</Row>
		</>)
    };
}

export default CopyView;
