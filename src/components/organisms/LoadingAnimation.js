import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	ActivityIndicator
} from 'react-native';
import FadeView from './FadeView';
import translate from '@src/locales/i18n';

const styles = StyleSheet.create({
	center: {
		alignSelf: 'center',
	},

	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%'
	},

	containerLight: {
		backgroundColor: '#f2f4f8'
	},

	loadingContainer: {
		flex: 1,
		width: '100%',
		justifyContent: 'center',
		color: '#ffffff',
		fontFamily: 'NotoSans',
		backgroundColor: '#00000055'
	},

	spinnerWrapper: {
		padding: 16,
	},

	loadingText: {
		color: '#ffffff',
		textAlign: 'center',
		marginRight: 32,
		marginLeft: 32,
		fontFamily: 'NotoSans-SemiBold',
		fontWeight: '600',
	}
});


type Props = {
	text: string,
	isFade: boolean
};

const LoadingAnimation = (props: Props) => {
	const {
		text,
		isFade = false
	} = props;

	return (
		<View style={styles.container}>
			{isFade && <FadeView style={styles.container} duration={100}>
				<View style={styles.loadingContainer}>
					<View style={styles.spinnerWrapper}>
						<ActivityIndicator size="large" color="#ff00ff" />
					</View>
					{!text && <Text style={styles.loadingText}>{translate('LoadingText')}</Text>}
					{text && text.length > 0 && <Text style={styles.loadingText}>{text}</Text>}
				</View>
			</FadeView>}
			{!isFade && <View style={styles.container} duration={100}>
				<View style={styles.loadingContainer}>
					<View style={styles.spinnerWrapper}>
						<ActivityIndicator size="large" color="#ff00ff" />
					</View>
					{!text && <Text style={styles.loadingText}>{translate('LoadingText')}</Text>}
					{text && text.length > 0 && <Text style={styles.loadingText}>{text}</Text>}
				</View>
			</View>}
		</View>
	);
};


export default LoadingAnimation;


