import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { borderTopColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import { Row, Col, Icon, Text, PriceChart } from '../../components';
import GlobalStyles from '../../styles/GlobalStyles';
import translate from "../../locales/i18n";
import { Router } from "../../Router";


const styles = StyleSheet.create({
	root: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: '100%',
		//backgroundColor: '#fff1',//GlobalStyles.color.SECONDARY,
		//borderTopColor:  '#fff2',//GlobalStyles.color.PINK,
		//borderTopWidth: 1
	},
	item: {
		padding: 5
	},
	icon: {
		marginTop: 2,
		marginBottom: 4
	}
});

type MenuItem = {
	text: string,
	iconName: string,
	routeMethod: function
}

type Props = {};

interface State {
	items: MenuItem[]
};


export default class NavigationMenu extends Component<Props, State> {
	// TODO: Move navigation menu items to config file
	state = {
		items: [
			{
				text: 'menu.news',
				iconName: 'news',
				routeMethod: () => {}
			},
			{
				text: 'menu.mosaics',
				iconName: 'mosaics',
				routeMethod: () => {}
			},
			{
				text: 'menu.home',
				iconName: 'home',
				routeMethod: () => {}
			},
			{
				text: 'menu.history',
				iconName: 'history',
				routeMethod: () => {}
			},
			{
				text: 'menu.harvest',
				iconName: 'harvest',
				routeMethod: () => {}
			}
		]
	}
	componentDidMount() {
		
	};

	render() {
		const { } = this.props;
		const { items } = this.state;

		return (
			<View style={styles.root}>
				<Row justify="space-evenly" align="center">
					{
						items.map(item => 
							<Col align="center" justify="space-" style={styles.item}>
								<Icon name={item.iconName} size="medium" style={styles.icon}/>
								<Text type="regular">{translate(item.text)}</Text>
							</Col>
						)
					}
				</Row>
			</View>
		);
	};
}
