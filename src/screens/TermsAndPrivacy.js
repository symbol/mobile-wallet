/**
 * @format
 * @flow
 */
import React, { Component } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SymbolPageView from "@src/components/organisms/SymbolPageView";
import translate from "@src/locales/i18n";
import CheckableTextLink from "@src/components/molecules/CheckableTextLink";
import GlobalStyles from "../styles/GlobalStyles";
import {Router} from "@src/Router";

const styles = StyleSheet.create({
	titleBar: {
		marginTop: 4,
		paddingLeft: 0,
	},
	container: {
		flex: 1,
	},
	gradientContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
	},
	logoContainer: {
		flexShrink: 0.1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	contentContainer: {
		width: '100%',
		flexShrink: 0.75,
		position: 'relative',
	},
	buttonContainer: {
		flexShrink: 0.15,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 16,
		marginBottom: 6,
	},
	scrollView: {
		marginTop: 5,
		marginBottom: 15
	},
	scrollContent: {
		flexGrow: 1,
	},
	logo: {
		width: 40,
		height: 40,
		resizeMode: 'contain',
	},
	backButton: {
		paddingLeft: 0,
	},
	title: {
		fontWeight: '600',
		fontSize: 20,
		textAlign: 'center',
		color: '#000',
	},
	content: {
		fontSize: 14,
		color: GlobalStyles.color.SECONDARY,
	},
	buttonPrimary: {
		backgroundColor: '#49B5C6',
		borderRadius: 32,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 15,
		minWidth: 200,
		height: 56,
	},
	buttonPrimaryText: {
		fontSize: 10,
		color: '#fff',
		letterSpacing: 0,
		textTransform: 'uppercase',
	},
	textLink: {
		color: '#5200c7',
	},
	textDark: {
		color: '#111',
	},
	back: {
		position: 'absolute',
		width: 14,
		height: 14,
		top: 35,
		left: 25,
		padding: 5,
	},
	checkboxContainer: {
		flex: 1,
		marginTop: 8,
		marginBottom: 16,
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center',
	},
	checkboxWrapper: {
		marginBottom: 10
	},
	checkbox: {
		flex: 0.1,
	},
	checkableText: {
		flex: 0.9,
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingLeft: 4,
	},
	buttonTextLink: {
		fontWeight: '500',
		color: '#2DB5B3',
		paddingLeft: 8,
		paddingRight: 8,
	},
});

type State = {
	isShowingTermsContent: boolean,
	isTermsChecked: boolean,
};

/**
 * Terms and privacy screen
 */
export class TermsAndPrivacy extends Component<Props, State> {
	state: State = {
		isShowingTermsContent: true,
		isTermsChecked: false,
	};

	/**
	 * Toogle view terms/privacy
	 */
	onLinkPressed = () => {
		this.setState(prevState => ({ isShowingTermsContent: !prevState.isShowingTermsContent }));
	};

	/**
	 * Toggle view terms
	 */
	onTermsToggle = () => {
		this.setState(prevState => ({ isTermsChecked: !prevState.isTermsChecked }));
	};

	/**
	 * Handle accept terms
	 */
	onTermsAccepted = () => {
		Router.goToCreateOrImport({}, this.props.componentId);
	};

	renderCheckableText = (isChecked: boolean, isShowingTermsContent: boolean) => {
		const termsConfirmText = translate('TERMS_agreeText');
		const links = {
			terms: {
				text: translate('TERMS_button'),
				active: !isShowingTermsContent,
				href: this.onLinkPressed,
			},
			privacy: {
				text: translate('PRIVACY_button'),
				active: isShowingTermsContent,
				href: this.onLinkPressed,
			},
		};

		return (
			<CheckableTextLink isChecked={isChecked} onChecked={this.onTermsToggle} linksMap={links}>
				{termsConfirmText}
			</CheckableTextLink>
		);
	};

	render() {
		const { isTermsChecked, isShowingTermsContent } = this.state;
		//Router.goToDashboard({}, this.props.componentId);
		const title = translate(isShowingTermsContent ? 'TERMS_title' : 'PRIVACY_title');
		const scrollableContent = translate(
			isShowingTermsContent ? 'TERMS_content' : 'PRIVACY_content'
		);
		const buttons = [
			{
				title: translate('TERMS_confirmButton'),
				onPress: this.onTermsAccepted,
				disabled: !isTermsChecked
			}
		];

		return (
			<SymbolPageView
				title={title}
				buttons={buttons}
				theme="light"
				icon="document"
			>
				<View>
					<Text style={styles.content}>{scrollableContent}</Text>
				</View>
				{ this.renderCheckableText(isTermsChecked, isShowingTermsContent) }
			</SymbolPageView>
		);
	}
}
