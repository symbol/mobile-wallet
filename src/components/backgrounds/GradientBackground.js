import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Container from '../Container'
import GlobalStyles from '../../styles/GlobalStyles';

const styles = StyleSheet.create({
	root: {
		height: '100%'
	}
});

type Props = {};

type State = {};


export default class GradientBackground extends Component<Props, State> {
	state = {};

    render() {
		const { children, style } = this.props;
		const {} = this.state;
		
        return (
			<LinearGradient
				colors={[
					GlobalStyles.color.PRIMARY,
					GlobalStyles.color.SECONDARY
				]}
				start={{x: 1, y: 0}}
				end={{x: 0, y: 1}}
				angle={135}
				useAngle={true}
				style={[styles.root, style]}
			>
				<Container>
					{children}
				</Container>
			</LinearGradient>
        );
    };
}
