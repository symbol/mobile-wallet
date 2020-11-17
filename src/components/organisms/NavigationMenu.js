import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { borderTopColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import { Row, Col, Icon, Text, PriceChart } from '@src/components';
import GlobalStyles from '../../styles/GlobalStyles';
import translate from "@src/locales/i18n";
import { Router } from "@src/Router";


const styles = StyleSheet.create({
	root: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: '100%',
		backgroundColor: GlobalStyles.color.WHITE
	},
	item: {
		padding: 5,
		paddingBottom: 3,
		width: 65,
		borderColor: '#fff0',
		borderBottomWidth: 2
	},
	activeItem: {
		borderColor: GlobalStyles.color.PINK,
	},
	icon: {
		marginTop: 5,
		marginBottom: 2
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
		let extraPadding = {};

		if (Platform.OS === 'ios')
			extraPadding = {
				paddingVertical: 10
			};
		
		return (
			<View style={[styles.root, extraPadding]}>
				<Row justify="space-around" align="center">
					{
						menuItemList.map((item, index) =>
							<TouchableOpacity onPress={() => onChange(item.name)} key={'' + index + 'nav'}>
								<Col align="center" justify="space-" style={[styles.item, item.name === value && styles.activeItem]}>
									<Icon name={item.iconName} size="small" style={styles.icon}/>
									<Text 
										theme="light"
										style={{fontSize: 11}}
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
