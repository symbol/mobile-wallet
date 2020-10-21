import React, { Component } from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import Container from '../Container';

const styles = StyleSheet.create({
	root: {
		height: '100%'
	}
});

type Props = {};

type State = {};


export default class C extends Component<Props, State> {
	state = {};

    render() {
		const { children, style } = this.props;
		const {} = this.state;
		
        return (
			<ImageBackground
				source={require('../../assets/mock.png')}
				style={[styles.root, style]}
			>
				<Container>
					{children}
				</Container>
			</ImageBackground>
        );
    };
}
