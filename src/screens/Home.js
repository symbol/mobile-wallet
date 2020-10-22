import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { 
	Section, 
	DarkMeshBackground,
	BalanceWidget
} from '../components';
import translate from "../locales/i18n";
import { Router } from "../Router";
import store from '../store';


const styles = StyleSheet.create({});

type Props = {};

type State = {};


export default class Home extends Component<Props, State> {
	state = {};

    render() {
		const {} = this.props;
		const {} = this.state;
		
        return (
			<DarkMeshBackground>
				<Section type="center">
					<BalanceWidget/>
				</Section>
			</DarkMeshBackground>
        );
    };
}
