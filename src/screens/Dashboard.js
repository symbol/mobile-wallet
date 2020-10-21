import React, { Component } from 'react';
import { StyleSheet, View  } from 'react-native';
import { 
	Text, 
	Section, 
	PriceChart, 
	ImageBackground 
} from '../components';
import translate from "../locales/i18n";
import { Router } from "../Router";


const styles = StyleSheet.create({});

type Props = {};

type State = {};


export default class Dashboard extends Component<Props, State> {
	state = {};

    render() {
		const {} = this.props;
		const {} = this.state;
		//sconsole.log(Object.values(components).map(el => typeof el))
		//return (<View></View>)
		
        return (
			<ImageBackground>
				<PriceChart />
				<Section type="center">
					<Text type="alert">Alert</Text>
				</Section>
				{/* <Section type="title">
					<Text type="title">Title</Text>
				</Section>
				<Section type="subtitle">
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
			</ImageBackground>
        );
    };
}
