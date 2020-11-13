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
	const { children, style, noPadding } = props;
	const styleArray = [];
	if(!noPadding)
		styleArray.push(styles.padding);
	styleArray.push(styles.container);
	styleArray.push(style);

	return (
		<LinearGradient
			colors={[GlobalStyles.color.PRIMARY, GlobalStyles.color.SECONDARY]}
			start={{ x: 1, y: 0 }}
			end={{ x: 0, y: 1 }}
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
