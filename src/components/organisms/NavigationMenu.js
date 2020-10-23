import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
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
	name: string
}

type Props = {
	menuItemList: MenuItem[],
	onChange: function
};

interface State {
	items: MenuItem[]
};


export default class NavigationMenu extends Component<Props, State> {
	// TODO: Move navigation menu items to config file
	state = {}
	componentDidMount() {};

	render() {
		const { menuItemList = [], onChange = () => {}, value } = this.props;
		const {} = this.state;

		return (
			<View style={styles.root}>
				<Row justify="space-evenly" align="center">
					{
						menuItemList.map(item =>
							<TouchableOpacity onPress={() => onChange(item.name)}>
								<Col align="center" justify="space-" style={styles.item}>
									<Icon name={item.iconName} size="medium" style={styles.icon}/>
									<Text 
										type={
											item.name === value
											? "bold"
											: "regular"
										}
									>{translate(item.text)}</Text>
								</Col>
							</TouchableOpacity> 
						)
					}
				</Row>
			</View>
		);
	};
}
