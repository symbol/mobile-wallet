import React, { Component } from 'react';
import { StyleSheet, TextInput  } from 'react-native';
import PriceChart from '../components/organisms/PriceChart';
import Gradient from '../components/backgrounds/Gradient';
import Text from '../components/controls/Text'

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

        return (
			<Gradient>
				<PriceChart />
				<Text type="title">Title</Text>
				<Text type="subtitle">Subtitle</Text>
				<Text type="alert">Alert</Text>
				<Text>Regular</Text>
				<Text type="bold">Bold</Text>
			</Gradient>
        );
    };
}
