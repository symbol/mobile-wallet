import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { Props as LinearGradientProps } from 'react-native-linear-gradient/common';
import { Container } from '@src/components';
import GlobalStyles from '@src/styles/GlobalStyles';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
	},
	padding: {
		paddingTop: 15,
		padding: 8
	}
});

type Props = LinearGradientProps;

const GradientContainer = (props: Props) => {
	const { children, style, colorSchema = 'normal', noPadding } = props;
	const styleArray = [];
	if(!noPadding)
		styleArray.push(styles.padding);
	styleArray.push(styles.container);
	styleArray.push(style);

	let colors;
	let locations;
	
	switch (colorSchema) {
		default:
		case 'normal':
			colors = [GlobalStyles.color.PRIMARY, GlobalStyles.color.SECONDARY];
			locations = [0, 1];
			break;
		case 'dark':
			colors = ['rgb(5, 12, 32)', 'rgb(67, 0, 78)'];
			locations = [0, 1];
			break;
	}

	return (
		<LinearGradient
			colors={colors}
			start={{ x: 1, y: 0 }}
			end={{ x: 0, y: 1 }}
			locations={locations}
			angle={ 135 }
			useAngle
			style={styleArray}
		>
			{children}
		</LinearGradient>
	);
};

GradientContainer.defaultProps = {
	children: null,
};

export default GradientContainer;
