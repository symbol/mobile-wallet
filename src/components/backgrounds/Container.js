import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	SafeAreaView,
	Platform,
	StatusBar
} from 'react-native';


const styles = StyleSheet.create({
	container: {
		paddingTop: StatusBar.currentHeight,
		height: '100%'
	}
});

type Props = {};

type State = {};


export default class ComponentName extends Component<Props, State> {
	state = {};

	render() {
		const { children, style } = this.props;

		if (Platform.OS === 'ios') {
			return (
				<SafeAreaView style={[styles.container, style]}>
					{children}
				</SafeAreaView>
			);
		}

		return (
			<View style={[styles.container, style]}>
				{children}
			</View>
		);
	};
}
