import React, { PureComponent } from 'react';
import { StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { Section } from '@src/components';
import GlobalStyles from '../../styles/GlobalStyles';

const styles = StyleSheet.create({
	root: {
		width: '100%',
		paddingHorizontal: 22,
	},
	inner: {
		paddingVertical: 16,
		borderBottomColor: GlobalStyles.color.DARKWHITE,
	}
});


interface Props {
	isLast: boolean;
}

type State = {};


export default class GradientBackground extends PureComponent<Props, State> {
	state = {};

    render() {
		const { children, style = {}, onPress, isLast = false } = this.props;

        return (<>
			{onPress && <TouchableOpacity style={[styles.root, style]} onPress={onPress}>
				<View style={[styles.inner, { borderBottomWidth: isLast ? 0: 2 }]}>
					{children}
				</View>
			</TouchableOpacity>}
			{!onPress && <View style={[styles.root, style]}>
				<View style={[styles.inner, { borderBottomWidth: isLast ? 0: 2 }]}>
					{children}
				</View>
			</View>}

        </>);
    };
}
