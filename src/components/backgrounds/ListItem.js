import React, { PureComponent } from 'react';
import { StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { Section } from '@src/components';
import GlobalStyles from '../../styles/GlobalStyles';

const styles = StyleSheet.create({
	root: {
		width: '100%',
		paddingHorizontal: 22,
		marginBottom: -2.1,
	},
	inner: {
		paddingTop: 18.1,
		paddingBottom: 16,
		borderBottomWidth: 2,
		borderBottomColor: GlobalStyles.color.DARKWHITE,
	}
});


interface Props {}

type State = {};


export default class GradientBackground extends PureComponent<Props, State> {
	state = {};

    render() {
		const { children, style = {}, onPress } = this.props;

        return (<>
			{onPress && <TouchableOpacity style={[styles.root, style]} onPress={onPress}>
				<View style={styles.inner}>
					{children}
				</View>
			</TouchableOpacity>}
			{!onPress && <View style={[styles.root, style]}>
				<View style={styles.inner}>
					{children}
				</View>
			</View>}

        </>);
    };
}
