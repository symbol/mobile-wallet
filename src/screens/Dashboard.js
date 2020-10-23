import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { 
	GradientBackground,
	NavigationMenu
} from '@src/components';
import Home from './Home';
import History from './History';
import translate from "@src/locales/i18n";
import { Router } from "@src/Router";
import store from '@src/store';


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
		// TODO: move to config
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
			</GradientBackground>
        );
    };
}
