import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	ActivityIndicator
} from 'react-native';
import FadeView from './FadeView';
import GlobalStyles from '@src/styles/GlobalStyles';
import translate from '@src/locales/i18n';

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%'
	},

	loadingContainer: {
		flex: 1,
		width: '100%',
		justifyContent: 'center',
		color: '#ffffff',
		fontFamily: 'NotoSans',
		//backgroundColor: '#00000011'
	},

	spinnerWrapper: {
		padding: 16,
	},

	loadingText: {
		color: GlobalStyles.color.SECONDARY,
		textAlign: 'center',
		marginRight: 32,
		marginLeft: 32,
		fontFamily: 'NotoSans-SemiBold',
	},

	darkText: {
		color: GlobalStyles.color.WHITE,
	}
});


type Props = {
	text: string,
	isFade: boolean
};

const LoadingAnimation = (props: Props) => {
	const {
		text,
		theme = 'light',
		isFade = false
	} = props;

	const color = theme === 'light'
		? GlobalStyles.color.SECONDARY
		: GlobalStyles.color.WHITE;

	return (
		<View style={styles.container}>
			{isFade && <FadeView style={styles.container} duration={200}>
				<View style={styles.loadingContainer}>
					<View style={styles.spinnerWrapper}>
						<ActivityIndicator size="large" color={color} />
					</View>
					{!text && <Text style={styles.loadingText}>{text}</Text>}
					{text && text.length > 0 && <Text style={styles.loadingText}>{text}</Text>}
				</View>
			</FadeView>}
			{!isFade && <View style={styles.container} duration={200}>
				<View style={styles.loadingContainer}>
					<View style={styles.spinnerWrapper}>
						<ActivityIndicator size="large" color={color} />
					</View>
					{!text && <Text style={styles.loadingText}>{text}</Text>}
					{text && text.length > 0 && <Text style={styles.loadingText}>{text}</Text>}
				</View>
			</View>}
		</View>
	);
};


export default LoadingAnimation;


