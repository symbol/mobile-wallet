import React, { Component } from 'react';
import { StyleSheet, View, Button  } from 'react-native';
import { 
	Text, 
	Section, 
	PriceChart, 
	GradientBackground,
	ImageBackground,
	BalanceWidget,
	NavigationMenu
} from '../components';
import Home from './Home';
import History from './History';
import translate from "../locales/i18n";
import { Router } from "../Router";
import store from '../store';


const styles = StyleSheet.create({});

type Props = {};

type State = { 
	currentTab: string
};


export default class Dashboard extends Component<Props, State> {
	state = {
		currentTab: 'home'
	};

	onTabChange = (tabName) => {
		this.setState({ currentTab: tabName });
	};

    render() {
		const {} = this.props;
		const { currentTab } = this.state;
		const menuItemList = [
			{
				text: 'menu.news',
				iconName: 'news',
				name: 'news',
			},
			{
				text: 'menu.mosaics',
				iconName: 'mosaics',
				name: 'mosaics',
			},
			{
				text: 'menu.home',
				iconName: 'home',
				name: 'home',
			},
			{
				text: 'menu.history',
				iconName: 'history',
				name: 'history',
			},
			{
				text: 'menu.harvest',
				iconName: 'harvest',
				name: 'harvest',
			}
		];
		let Tab;
		
		switch(currentTab) {
			default:
			case 'home': 
				Tab = Home;
				break;
			case 'history': 
				Tab = History;
				break;
		}
        return (
			<GradientBackground>
				<Tab />
				<NavigationMenu
					menuItemList={menuItemList}
					onChange={this.onTabChange}
					value={currentTab}
				/>
				{/*<Section type="center">
					<BalanceWidget/>
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
			</GradientBackground>
        );
    };
}
