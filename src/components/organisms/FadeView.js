import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';

class FadeView extends Component {
	constructor() {
		super();

		this.state = {
			viewOpacity: new Animated.Value(0),
		};
	}

	componentDidMount() {
		const { viewOpacity } = this.state;
		const { onFadeComplete, duration = 500, delay = 0 } = this.props;

		setTimeout(() => {
			Animated.timing(
				viewOpacity,
				{
					toValue: 1,
					duration,
					useNativeDriver: false,
				},
			).start(onFadeComplete || (() => { }));
		}, delay);
		
	}

	render() {
		const { viewOpacity } = this.state;
		const { style } = this.props;

		return (
			<Animated.View style={[{ opacity: viewOpacity }].concat(style || [])}>
				{this.props.children}
			</Animated.View>
		);
	}
}

FadeView.propTypes = {
	onFadeComplete: PropTypes.func,
	duration: PropTypes.number,
	delay: PropTypes.number,
	style: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
		PropTypes.object,
		PropTypes.array,
	]),
	children: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
	]).isRequired,
};

export default FadeView;