import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Container from '../Container';
import { FadeView } from '@src/components';
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

type Theme = 'light'
	| 'dark';

interface Props {
	name: Name,
	theme: Theme
}

type State = {};


export default class GradientBackground extends Component<Props, State> {
	state = {};

    render() {
		const { children, style = {}, name, theme = 'dark' } = this.props;
		const {} = this.state;

		let source;
		const imageName = name + '_' + theme;
		switch(imageName) {
			case 'connector_light':
				source = require('../../assets/backgrounds/connector_light.png');
				break;
			case 'connector_dark':
				source = require('../../assets/backgrounds/connector.png');
				break;
			case 'connector_small_light':
				source = require('../../assets/backgrounds/connector_small_light.png');
				break;
			case 'connector_small_dark':
				source = require('../../assets/backgrounds/connector.png');
				break;
			case 'mesh_dark':
			case 'mesh_light':
				source = require('../../assets/backgrounds/mesh.png');
				break;
			case 'mesh_small_light':
			case 'mesh_small_dark':
				source = require('../../assets/backgrounds/mesh_small.png');
				break;
			case 'mesh_small_2_light':
			case 'mesh_small_2_dark':
				source = require('../../assets/backgrounds/mesh_small_2.png');
				break;
		}

		const gradientColors = theme === 'light'
			? [
				GlobalStyles.color.DARKWHITE,
				GlobalStyles.color.DARKWHITE
			]
			: [
				GlobalStyles.color.PRIMARY,
				GlobalStyles.color.SECONDARY
			]
        return (
			<FadeView style={styles.root} duration={200}>
				<LinearGradient
					colors={gradientColors}
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
			</FadeView>
			
        );
    };
}
