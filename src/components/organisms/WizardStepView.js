import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import type { Node } from 'react';
import SymbolGradientContainer from './SymbolGradientContainer';
import TitleBar from '@src/components/old/StepViewTitleBar';
import LoadingAnimation from './LoadingAnimation';
import GradientButton from '@src/components/atoms/GradientButton';
import CompoundButton from '@src/components/atoms/CompoundButton';

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		width: '100%',
		height: '100%'
	},

	container: {
		flex: 1,
		width: '100%',
		justifyContent: 'space-between',
		color: '#ffffff',
		paddingTop: 30,
		fontFamily: 'NotoSans',
		backgroundColor: '#f2f4f8'
	},

	mesh: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		width: '100%',
		height: 100,
		flex: 1,
		resizeMode: 'contain',
	},

	pageContainer: {
		flex: 1,
		width: '100%',
		justifyContent: 'space-between',
		color: '#ffffff',
		padding: 30,
		paddingTop: 0,
		fontFamily: 'NotoSans'
	},

	titleContainer: {
		marginTop: 10,
		width: '100%',
		justifyContent: 'space-between',
		alignItems: 'flex-start'
	},

	title: {
		fontSize: 24,
		fontFamily: 'NotoSans-Regular',
	},

	titleDark: {
		color: '#ffffff',
	},

	titleLight: {
		color: '#44004e',
	},

	content: {
		width: '100%',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around',
		marginBottom: 15
	},

	footerTitle: {
		textAlign: 'center',
		color: '#fff',
		marginTop: 10,
		marginBottom: 20,
		fontFamily: 'NotoSans-Regular',
		fontSize: 16,
	},

	button: {
		marginTop: 20,
	},

	loading: {
		height: 32,
		width: 32
	},

	error: {
		color: '#fffa',
		fontFamily: 'NotoSans-Bold',
		textAlign: 'center'
	}
});



type Button = {
	text: string,
	disabled: boolean,
	testID: any,
	icon: any,
	onPress: () => any,
};

type Props = {
	title: string,
	children: Node,
	buttons: Button[],
	errorButtons: Button[],
	isLoading: boolean,
	isError: boolean,
	errorMessage: string,
	lightTheme: boolean,
	footer: Node,
	footerTitle: string,
	separateButtons: boolean,
	separateErrorButtons: boolean,
	onClose: () => any,
	onBack: () => any,
	onSettings: () => any,
};

const WizardStepView = (props: Props) => {
	const {
		title,
		children,
		buttons,
		errorButtons,
		isLoading,
		isError,
		errorMessage,
		lightTheme,
		footer,
		footerTitle,
		separateButtons,
		separateErrorButtons,
		onClose,
		onBack,
		onSettings
	} = props;


	const Footer = footer;

	const Container = (props) => {
		if(lightTheme)
			return <View style={ styles.rootContainer }>
					{!isLoading && <View style={ styles.container }>
						{ props.children }
					</View>}
					{isLoading && <LoadingAnimation/>}
				</View>
		else
			return <View style={ styles.rootContainer }>
					{!isLoading && <SymbolGradientContainer noPadding style={ styles.container }>
						{ props.children }
					</SymbolGradientContainer>}
					{isLoading && <SymbolGradientContainer noPadding style={ styles.rootContainer }>
						<LoadingAnimation/>
					</SymbolGradientContainer>}
				</View>
	}

	const TitleComponent = (props) => {
		return <TitleBar {...props}/>
	}

	return (
		<Container>
			{lightTheme &&<Image style={styles.mesh} source={require('../../assets/mesh.png')} />}


			<View style={ styles.pageContainer }>
				<View style={ styles.titleContainer }>
					{/* Title */}
					<TitleComponent
						clearMargin
						showClose={ !!onClose }
						onClose={ onClose }
						showBack={ !!onBack }
						onBack={ onBack}
						title={ title }
						theme={ lightTheme ? 'light' : 'dark' }
					/>
				</View>
				<View style={ styles.content }>
					{/* Content */}
					{ !isLoading && !isError && children }

					{/* Error message */}
					{ isError && <Text style={ styles.error }>{ errorMessage }</Text> }
				</View>
				<View>
					{/* Footer title */}
					{ !isLoading && !isError && footerTitle && <Text style={styles.footerTitle}>{ footerTitle }</Text> }

					{/* Buttons */}
					{ !isLoading && !isError && buttons && buttons.length === 1 && <GradientButton
						style={ styles.buttons }
						title={ buttons[0].title }
						disabled={ buttons[0].disabled }
						testID={ buttons[0].testID }
						icon={ buttons[0].icon }
						onPress={ buttons[0].onPress }
					/>}
					{ !separateButtons && !isLoading && !isError && buttons && buttons.length === 2 && <CompoundButton
						style={ styles.buttons }
						titleLeft={ buttons[0].title }
						titleRight={ buttons[1].title }
						disabled={ buttons[0].disabled || buttons[1].disabled }
						iconLeft={ buttons[0].icon }
						iconRight={ buttons[1].icon }
						onPressLeft={ buttons[0].onPress }
						onPressRight={ buttons[1].onPress }
					/>}
					{ separateButtons && !isLoading && !isError && buttons && buttons.length === 2 && <View style={ styles.buttons }>
						<GradientButton
							style={ styles.button }
							title={ buttons[0].title }
							disabled={ buttons[0].disabled }
							testID={ buttons[0].testID }
							icon={ buttons[0].icon }
							onPress={ buttons[0].onPress }
							isLoading={ buttons[0].isLoading }
						/>
						<GradientButton
							style={ styles.button }
							title={ buttons[1].title }
							disabled={ buttons[1].disabled }
							testID={ buttons[1].testID }
							icon={ buttons[1].icon }
							onPress={ buttons[1].onPress }
							isLoading={ buttons[1].isLoading }
						/>
					</View>}

					{/* Buttons shown while error */}
					{ !isLoading && isError && errorButtons && errorButtons.length === 1 && <GradientButton
						style={ styles.buttons }
						title={ errorButtons[0].title }
						disabled={ errorButtons[0].disabled }
						testID={ errorButtons[0].testID }
						icon={ errorButtons[0].icon }
						onPress={ errorButtons[0].onPress }
					/>}
					{ !separateErrorButtons && !isLoading && isError && errorButtons && errorButtons.length === 2 && <CompoundButton
						style={ styles.buttons }
						titleLeft={ errorButtons[0].title }
						titleRight={ errorButtons[1].title }
						disabled={ errorButtons[0].disabled || errorButtons[1].disabled }
						iconLeft={ errorButtons[0].icon }
						iconRight={ errorButtons[1].icon }
						onPressLeft={ errorButtons[0].onPress }
						onPressRight={ errorButtons[1].onPress }
					/>}
					{ separateErrorButtons && !isLoading && isError && errorButtons && errorButtons.length === 2 && <View style={ styles.buttons }>
						<GradientButton
							style={ styles.button }
							title={ errorButtons[0].title }
							disabled={ errorButtons[0].disabled }
							testID={ errorButtons[0].testID }
							icon={ errorButtons[0].icon }
							onPress={ errorButtons[0].onPress }
						/>
						<GradientButton
							style={ styles.button }
							title={ errorButtons[1].title }
							disabled={ errorButtons[1].disabled }
							testID={ errorButtons[1].testID }
							icon={ errorButtons[1].icon }
							onPress={ errorButtons[1].onPress }
						/>
					</View>}

					{/* Footer */}
					{ !isLoading && !isError && footer && <Footer/> }
				</View>
			</View>
		</Container>
	);
};

WizardStepView.defaultProps = {
	children: null,
};

export default WizardStepView;


