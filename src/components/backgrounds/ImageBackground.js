import React, { Component } from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { Container, FadeView, LoadingAnimation, Col, Section, Text, Button } from '@src/components';
import { Router } from '@src/Router';


const styles = StyleSheet.create({
	root: {
		height: '100%'
	}
});

type Name = 'Tanker'
	| 'HomeMock';

interface Props {
	name: Name;
	dataManager: Object;
};

type State = {};


export default class C extends Component<Props, State> {
	state = {};

    render() {
		const { children, style = {}, imageStyle, name, dataManager = {}, onBack, componentId } = this.props;
		const {} = this.state;
		const goBack = onBack 
			? onBack
			: componentId
				? (() => Router.goBack(componentId))
				: null;

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
					imageStyle={imageStyle}
				>
					{!dataManager.isLoading && !dataManager.isError && 
						<Container>{children}</Container>
					}
					{dataManager.isLoading && !dataManager.isError && 
						<LoadingAnimation />
					}
					{dataManager.isError && 
						<Col justify="center" align="center" fullHeight>
							<Section type="form-item">
								<Text type="alert" theme="light" align="center">Error</Text>
								<Text type="bold" theme="light" align="center">{dataManager.errorMessage}</Text>
								<Text type="regular" theme="light" align="center">{dataManager.errorDescription}</Text>
							</Section>
							{dataManager.fetch && <Section type="form-item">
								<Button theme={theme} text="Try again" onPress={() => dataManager.fetch()} />
							</Section>}
							{goBack && <Section type="form-item">
								<Button theme={theme} text="Go back" onPress={goBack} />
							</Section>}
						</Col>
					}
				</ImageBackground>
			</FadeView>
        );
    };
}
