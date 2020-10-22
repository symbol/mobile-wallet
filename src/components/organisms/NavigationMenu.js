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
		backgroundColor: GlobalStyles.color.SECONDARY,
		borderTopColor: GlobalStyles.color.PINK,
		borderTopWidth: 1
	},	
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
	state = {
		items: [
			{
				text: 'menu.news',
				iconName: 'none',
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
				<Row justify="center" align="space-around">
					{
						items.map(item => 
							<Col align="center" justify="center" style={styles.item}>
								<Icon name={item.iconName} style={styles.icon} />
								<Text type="bold">{translate(item.text)}</Text>
							</Col>
						)
					}
				</Row>
			</View>
		);
	};
}
