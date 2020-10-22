import React, { Component } from 'react';
import { StyleSheet, View, Button  } from 'react-native';
import { 
	Text, 
	Section, 
	PriceChart, 
	GradientBackground,
	ImageBackground,
	BalanceWidget 
} from '../components';
import translate from "../locales/i18n";
import { Router } from "../Router";
import store from '../store';


const styles = StyleSheet.create({});

type Props = {};

type State = {  };


export default class Dashboard extends Component<Props, State> {
	state = { a: 1 };

    render() {
		const {} = this.props;
		const { a } = this.state;
		
		store.subscribe(() => this.setState({a: store.getState().test.a}))
		
        return (
			<GradientBackground>
				<Section type="center">
					<BalanceWidget/>
				</Section>
				{/*<Section type="subtitle">
					<Text type="subtitle">Subtitle</Text>
				</Section>
				<Section type="center">
					<Text type="alert">Alert</Text>
				</Section>
				<Section type="text">
					<Text>Regular</Text>
				</Section>
				<Section type="button">
					<Text type="bold">Bold</Text>
				</Section> */}
			</GradientBackground>
        );
    };
}
