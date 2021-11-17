import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, TouchableOpacity } from 'react-native';
import {
	Icon,
	Text,
	Row,
} from '@src/components';
import GlobalStyles from '@src/styles/GlobalStyles';
import { copyToClipboard } from '@src/utils';
import {Router} from "@src/Router";
import translate from "@src/locales/i18n";


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
		Router.showMessage({
			message: translate('unsortedKeys.copied'),
			type: 'success'
		});
		copyToClipboard(text)
	};

	text() {
		const rawText = this.props.children;
		return this.props.userAddress === rawText
            ? `(${translate('unsortedKeys.currentAddress')}) ${rawText}`
            : rawText
	}

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
				<Text type="regular" theme={theme} style={[styles.text, style]}>{this.text()}</Text>
				<TouchableOpacity style={styles.button} onPress={() => this.copyToClipboard(children)}>
					<Icon name="copy" size="small" />
				</TouchableOpacity>
			</Row>
		</>)
    };
}

export default connect(state => ({
    userAddress: state.account.selectedAccountAddress,
}))(CopyView);
