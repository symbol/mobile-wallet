import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import {
	Icon,
	Text,
	Row,
} from '@src/components';
import { copyToClipboard } from '@src/utils';


const styles = StyleSheet.create({
	text: {
		marginRight: 5, 
		maxWidth: '90%'
	},
	button: {
		padding: 10
	}
});;

class CopyView extends Component<Props, State> {
	render = () => {
		const { children, style = {}, theme = 'light'} = this.props;
		return (<Row align="center" justify="space-between">
			<Text type="regular" theme={theme} style={[style, styles.text]}>{children}</Text>
			<TouchableOpacity style={styles.button} onPress={() => copyToClipboard(children)}>
				<Icon name="copy" size="small" />
			</TouchableOpacity>
		</Row>)
    };
}

export default CopyView;
