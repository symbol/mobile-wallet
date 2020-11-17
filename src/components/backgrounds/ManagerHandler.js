import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, Section, Col, LoadingAnimationFlexible, Container } from '@src/components';
import translate from '@src/locales/i18n';

const styles = StyleSheet.create({
	root: {
		height: '100%'
	},
	content: {

	},
	hidden: {
		opacity: 0
	},
	onTop: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		width: '100%',
		height: '100%',
	},
	buttonLight: {
		borderColor: '#fff',
		borderWidth: 1,
		borderRadius: 5,
		paddingVertical: 5,
		paddingHorizontal: 10
	},
	buttonDark: {
		borderColor: '#000',
		borderWidth: 1,
		borderRadius: 5,
		paddingVertical: 5,
		paddingHorizontal: 10
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
		const { children, style = {}, theme = 'dark', dataManager = {}, onBack, componentId, allowContainer = false, noLoadingText } = this.props;
		const {} = this.state;
		const buttonStyle = theme === 'dark' 
			? styles.buttonLight 
			: styles.buttonDark;
		const goBack = onBack 
			? onBack
			: componentId
				? (() => Router.goBack(componentId))
				: null;
		const Cont = allowContainer
			? Container
			: View;
		return (<Cont>
			<View style={styles.content}>
				{!dataManager.isLoading && !dataManager.isError && 
					children
				}
				{(dataManager.isLoading || dataManager.isError) && 
					<View style={styles.hidden}>
						{children}
					</View>
				}
			</View>
			<View style={styles.onTop}>
				{dataManager.isLoading && !dataManager.isError && 
					<LoadingAnimationFlexible isFade text={noLoadingText ? ' ' : translate('LoadingText')}/>
				}
				{dataManager.isError && 
					<Col justify="center" align="center" fullHeight style={style}>
						<Section type="form-item">
							<Text type="bold" theme={theme} align="center">Error</Text>
							{!!dataManager.errorMessage && <Text type="bold" theme={theme} align="center">{dataManager.errorMessage}</Text>}
							{!!dataManager.errorDescription && <Text type="regular" theme={theme} align="center">{dataManager.errorDescription}</Text>}
						</Section>
						{dataManager.fetch && <Section type="form-item">
							<TouchableOpacity onPress={() => dataManager.fetch()}>
								<Text theme={theme} type="bold" style={buttonStyle}>Try again</Text>
							</TouchableOpacity>
						</Section>}
						{goBack && <Section type="form-item">
							<TouchableOpacity onPress={goBack}>
								<Text theme={theme} type="bold" style={buttonStyle}>Go back</Text>
							</TouchableOpacity>
						</Section>}
					</Col>
				}
			</View>	
        </Cont>);
    };
}
