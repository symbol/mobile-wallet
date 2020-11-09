import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';

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
		})
	};

    render = () => {
		const { children, theme } = this.props;
		const { isSecretShown, counter } = this.state;
		let globalStyle = {};

		if(theme === 'light')
			globalStyle.color = GlobalStyles.color.onLight.TEXT;
		else
			globalStyle.color = GlobalStyles.color.onDark.TEXT;

		if(isSecretShown)
        return (
			<Text style={[globalStyle, style]}>
				{children} [{counter}]
			</Text>
		);
		else
		return (
			<TouchableOpacity onPree={() => this.onShowClick()}>
				<Text>Show</Text>
			</TouchableOpacity>
		)
    };
}
