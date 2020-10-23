import React, { Component } from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import Container from '../Container';

const styles = StyleSheet.create({
	root: {
		height: '100%'
	}
});

type Name = 'Tanker'
	| 'HomeMock';

interface Props {
	name: Name;
};

type State = {};


export default class C extends Component<Props, State> {
	state = {};

    render() {
		const { children, style = {}, name } = this.props;
		const {} = this.state;
		let source;
		switch(name) {
			default:
			case 'tanker':
				source = require('../../assets/backgrounds/tanker.png');
				break;
			case 'HomeMock':
				source = require('../../assets/mock.png');
				break;
		}
        return (
			<ImageBackground
				source={source}
				style={[styles.root, style]}
			>
				<Container>
					{children}
				</Container>
			</ImageBackground>
        );
    };
}
