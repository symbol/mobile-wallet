import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Section } from '@src/components';
import GlobalStyles from '../../styles/GlobalStyles';

const styles = StyleSheet.create({
	root: {
		width: '100%',
		paddingHorizontal: 16,
	},
	inner: {
		paddingVertical: 16,
		borderBottomWidth: 2,
		borderBottomColor: GlobalStyles.color.DARKWHITE,
	}
});


interface Props {}

type State = {};


export default class GradientBackground extends Component<Props, State> {
	state = {};

    render() {
		const { children, style = {}} = this.props;

        return (
			<View style={[styles.root, style]}>
				<View style={styles.inner}>
					{children}
				</View>
			</View>
        );
    };
}
