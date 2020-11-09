import React, { Component } from 'react';
import { Text as NativeText, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Row, Text } from '@src/components';
import GlobalStyles from '../../styles/GlobalStyles';

const styles = StyleSheet.create({
	showButton: {
		width: '10%',
		borderRadius: 5,
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: GlobalStyles.color.PRIMARY,
		color: GlobalStyles.color.PRIMARY,
	},
	progressBar: {
		width: '100%'
	},
	progressBarInner: {
		height: 2, 
		backgroundColor: GlobalStyles.color.GREEN,
	}
})

type Theme = 'light' 
	| 'dark';

interface Props {
	type: Type,
	align: Align,
	theme: Theme
};

type State = {
	isSecretShown: boolean
};


export default class SecretView extends Component<Props, State> {
	state = {
		isSecretShown: false,
		counter: 10
	};

	onShowClick = () => {
		this.setState({isSecretShown: true});
		this.setState({counter: 10});

		const timer = setInterval(() => {
			if(this.state.counter === 0) {
				clearInterval(timer);
				this.setState({isSecretShown: false});
			}
			this.setState({counter: this.state.counter - 1});
		}, 1000)
	};

    render = () => {
		const { children, style = {}, theme } = this.props;
		const { isSecretShown, counter } = this.state;
	

		if(isSecretShown)
        return (<Row wrap>
			<Text type="regular" theme={theme} style={style} wrap>
				{children}
			</Text>
			<View style={styles.progressBar}>
				<View style={[{width: counter * 10 + '%'}, styles.progressBarInner]} />
			</View>
		</Row>);
		else
		return (
			<TouchableOpacity onPress={() => this.onShowClick()}>
				<NativeText>
					<Text type="bold" style={styles.showButton}>Show</Text>
				</NativeText>
			</TouchableOpacity>
		)
    };
}
