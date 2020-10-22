import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Container from '../Container'
import GlobalStyles from '../../styles/GlobalStyles';

const styles = StyleSheet.create({
	root: {
		height: '100%'
	},
	image: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		width: '100%',
		height: undefined,
		resizeMode: 'contain',
		aspectRatio: 1
	},
});

type Name = 'connector'
	|'mesh'
	|'mesh_big'
	|'mesh_small';

interface Props {
	name: Name
};

type State = {};


export default class GradientBackground extends Component<Props, State> {
	state = {};

    render() {
		const { children, style = {}, name } = this.props;
		const {} = this.state;

		let source;
		switch(name) {
			case 'connector':
				source = require('../../assets/backgrounds/connector.png');
				break;
			case 'mesh':
				source = require('../../assets/backgrounds/mesh.png');
				break;
			case 'mesh_big':
				source = require('../../assets/backgrounds/mesh_big.png');
				break;
			case 'mesh_small':
				source = require('../../assets/backgrounds/mesh_small.png');
				break;
		}
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
					{!!source && <Image
						style={styles.image}
						source={source}
					/>}
					{children}
				</Container>
			</LinearGradient>
        );
    };
}
