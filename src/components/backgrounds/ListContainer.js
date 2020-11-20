import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Section } from '@src/components';
import GlobalStyles from '../../styles/GlobalStyles';

const styles = StyleSheet.create({
	inner: {
		width: '100%',
        borderRadius: 6,
        marginTop: 0,
        marginBottom: 8,
        backgroundColor: GlobalStyles.color.WHITE,
		flex: 1,
	},
	section: {
		flex: 1
	}
});


interface Props {
	isScrollable: boolean
}

type State = {};


export default class GradientBackground extends Component<Props, State> {
	state = {};

    render() {
		const { children, style = {}, isScrollable = true} = this.props;

        return (
			<Section type="list" style={[styles.section, style]} isScrollable={isScrollable}>
				<View style={[styles.inner]}>
					{children}
				</View>
			</Section>
        );
    };
}
