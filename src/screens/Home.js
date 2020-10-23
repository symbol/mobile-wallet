import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { 
	Section, 
	GradientBackground,
	BalanceWidget,
	Text
} from '@src/components';
import translate from "@src/locales/i18n";
import { Router } from "@src/Router";
import store from '@src/store';


const styles = StyleSheet.create({});

type Props = {};

type State = {};


export default class Home extends Component<Props, State> {
	state = {};

    render() {
		const {} = this.props;
		const {} = this.state;
		
        return (
			<GradientBackground name='mesh'>
				<Section type="title">
					<Text type='title'>Home</Text>
				</Section>
				<Section type="title">
					<Text type='subtitle'>Switch account button, qr, etc..</Text>
				</Section>
				<Section type="center">
					<BalanceWidget/>
				</Section>
			</GradientBackground>
        );
    };
}
