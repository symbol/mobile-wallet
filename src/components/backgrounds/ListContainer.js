import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Section } from '@src/components';
import GlobalStyles from '../../styles/GlobalStyles';

const styles = StyleSheet.create({
	root: {
		width: '100%',
        borderRadius: 6,
        marginTop: 0,
        marginBottom: 8,
        backgroundColor: GlobalStyles.color.WHITE
	},
});


interface Props {}

type State = {};


export default class GradientBackground extends Component<Props, State> {
	state = {};

    render() {
		const { children, style = {}} = this.props;

        return (
			<Section type="list" style={style} isScrollable>
				<View style={[styles.root]}>
					{children}
				</View>
			</Section>
        );
    };
}
