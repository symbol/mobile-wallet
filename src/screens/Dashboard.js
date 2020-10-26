import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { menuItems } from '@src/config';
import {
	GradientBackground,
	NavigationMenu
} from '@src/components';
import Home from './Home';
import History from './History';
import translate from "@src/locales/i18n";
import { Router } from "@src/Router";
import store from '@src/store';


const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		marginBottom: 64
	}
});

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
				<Tab constentStyle={styles.contentContainer}/>
				<NavigationMenu
					menuItemList={menuItems}
					onChange={this.onTabChange}
					value={currentTab}
				/>
			</GradientBackground>
        );
    };
}
