import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { 
	Section, 
	ShipBackground,
	Text
} from '../components';
import translate from "../locales/i18n";
import { Router } from "../Router";
import store from '../store';


const styles = StyleSheet.create({});

type Props = {};

type State = {};


export default class History extends Component<Props, State> {
	state = {};

    render() {
		const {} = this.props;
		const {} = this.state;
		
        return (
			<ShipBackground>
				<Section type="title">
					<Text type="title">Transactions</Text>
				</Section>
				<Section type="title">
					<Text type="subtitle">List starts here..</Text>
				</Section>
			</ShipBackground>
        );
    };
}
