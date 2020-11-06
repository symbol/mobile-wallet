import React, { Component } from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import Container from '../Container';
import { FadeView } from '@src/components';

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
				source = require('@src/assets/backgrounds/tanker.png');
				break;
			case 'solar':
				source = require('@src/assets/backgrounds/solar_blur.png');
				break;
			case 'harvest':
				source = require('@src/assets/backgrounds/harvest.png');
				break;
			case 'blue':
				source = require('@src/assets/backgrounds/blue.png');
				break;
			case 'HomeMock':
				source = require('@src/assets/mock.png');
				break;
		}
        return (
			<FadeView style={styles.root} duration={200}>
				<ImageBackground
					source={source}
					style={[styles.root, style]}
				>
					<Container>
						{children}
					</Container>
				</ImageBackground>
			</FadeView>
        );
    };
}
