import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Section, Col } from '@src/components';

const styles = StyleSheet.create({
	root: {
		height: '100%'
	}
});

type Theme = 'light'
	| 'dark';

interface Props {
	theme: Theme
}

type State = {};


export default class GradientBackground extends Component<Props, State> {
	state = {};

    render() {
		const { children, style = {}, theme = 'dark', dataManager = {}, componentId } = this.props;
		const {} = this.state;

		return (<>
			{!dataManager.isLoading && !dataManager.isError && 
				children
			}
			{dataManager.isLoading && !dataManager.isError && 
				<LoadingAnimation style={style}/>
			}
			{dataManager.isError && 
				<Col justify="center" align="center" fullHeight style={style}>
					<Section type="form-item">
						<Text type="alert" theme={theme} align="center">Error</Text>
						{!!dataManager.errorMessage && <Text type="bold" theme={theme} align="center">{dataManager.errorMessage}</Text>}
						{!!dataManager.errorDescription && <Text type="regular" theme={theme} align="center">{dataManager.errorDescription}</Text>}
					</Section>
					<Section type="form-item">
						<TouchableOpacity onPress={() => dataManager.fetch()}>
							<Text theme={theme} type="bold">Try again</Text>
						</TouchableOpacity>
					</Section>
					{componentId && <Section type="form-item">
						<TouchableOpacity onPress={() => Router.goBack(componentId)}>
							<Text theme={theme} type="bold">Go back</Text>
						</TouchableOpacity>
					</Section>}
				</Col>
			}</>	
        );
    };
}
