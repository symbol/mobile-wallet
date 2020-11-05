import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import {
    Section,
    GradientBackground,
	Text,
	Icon,
    Col,
    Row,
} from '@src/components';
import GlobalStyles from '@src/styles/GlobalStyles';
import { Router, SETTINGS_SCREEN } from '@src/Router';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
    root: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		backgroundColor: '#0005'
	},
	menuContainer: {
		width: '70%',
		height: '100%',
		paddingTop: 4,
		backgroundColor: GlobalStyles.color.DARKWHITE
	},
	accountBox: {
		backgroundColor: GlobalStyles.color.SECONDARY,
		borderRadius: 5,
		margin: 4,
		marginHorizontal: 8,
		paddingHorizontal: 17,
		paddingVertical: 8
	},
	menuBottomContainer: {
		borderTopWidth: 1,
		borderColor: GlobalStyles.color.WHITE,
		paddingVertical: 8,
	},
	menuItem: {
		margin: 4,
		paddingHorizontal: 17,
		paddingVertical: 8
	},
	menuItemIcon: {
		marginRight: 17
	},
	menuItemText: {

	},
});

type Props = {
    componentId: string,
};

type State = {};

class Home extends Component<Props, State> {
    state = { isVisible: true };

    handleSettingsClick = () => {
        console.log(this.props.componentId);
        Router.goToSettings({}, this.props.componentId);
	};
	
	renderAccountSelectorItem = ({accountName, balance}) => {
		return (
			<TouchableOpacity style={styles.accountBox}>
				<Text type="bold">
					{accountName}
				</Text>
				<Text type="regular" align="right">
					{balance}
				</Text>
			</TouchableOpacity>
		);
	};

	renderMenuItem = ({iconName, text, screenName}) => {
		return (
			<TouchableOpacity onPress={() => Router.goToScreen(screenName, {}, this.props.componentId)}>
				<Row fullWidth style={styles.menuItem}>
					<Icon name={iconName} style={styles.menuItemIcon}/>
					<Text theme="light" style={styles.menuItemText}>{text}</Text>
				</Row>
			</TouchableOpacity>
		);
	};

    render = () => {
        const { contentStyle = {}, componentId, accountName, balance } = this.props;
		const { isVisible } = this.state;
		const accountList = [ // Mock. TODO: replace with data from store
			{ accountName, balance },
			{ accountName: 'New account', balance: 1 }, 
			{ accountName: 'New account 2', balance: 0 }
		];

		const menuItems = [
			{ iconName: 'account', text: 'Account Details', screenName: SETTINGS_SCREEN },
			{ iconName: 'accounts_edit', text: 'Manage Accounts', screenName: SETTINGS_SCREEN },
			{ iconName: 'settings', text: 'Settings', screenName: SETTINGS_SCREEN },
		];

		if(!isVisible)
			return null;

        return ( // TODO: restyle
            <TouchableOpacity style={styles.root} onPress={() => this.setState({isVisible: false})}>
                <GradientBackground theme="light" style={styles.menuContainer}>
					<Col justify="space-between" fullHeight>
						<Section style={{paddingVertical: 16, paddingHorizontal: 8}}>
							<Text type="title" theme="light">
								Accounts
							</Text>
						</Section>
						<Section isScrollable>
							{accountList.map(this.renderAccountSelectorItem)}
						</Section>
						<Section style={styles.menuBottomContainer}>
							{menuItems.map(this.renderMenuItem)}
						</Section>
					</Col>
				</GradientBackground>
            </TouchableOpacity>
        );
    }
}

export default connect(state => ({
	accountName: state.account.selectedAccount.name,
	balance: state.account.balance,
}))(Home);
