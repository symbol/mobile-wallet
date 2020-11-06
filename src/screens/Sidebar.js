import React, { Component } from 'react';
import { 
	StyleSheet, 
	View, 
	TouchableOpacity, 
	TouchableWithoutFeedback, 
	Image 
} from 'react-native';
import {
    Section,
    GradientBackground,
	Text,
	Icon,
	Col,
	OptionsMenu,
	Row,
	SymbolGradientContainer,
	Trunc
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
		backgroundColor: '#0005',
	},
	menuContainer: {
		width: '70%',
		height: '100%',
		paddingTop: 4,
		backgroundColor: GlobalStyles.color.DARKWHITE
	},
	selectedAccountBox: {
		width: null,
		borderRadius: 5,
		margin: 4,
		marginHorizontal: 8,
		paddingHorizontal: 17,
		paddingVertical: 8
	},
	selectedAccountName: {
		fontSize: 1 * 12,
		lineHeight: 1.75 * 12,
	},
	selectedAccountAddress: {
		fontSize: 1 * 12,
		lineHeight: 1.75 * 12,
		marginBottom: 13,
	},
	selectedAccountMosaic: {
		fontSize: 1.5 * 12,
		lineHeight: 2.25 * 12,
	},
	selectedAccountBalance: {
		fontSize: 2.5 * 12,
		lineHeight: 3.25 * 12
	},
	connectorImage: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		width: '100%',
		height: undefined,
		resizeMode: 'contain',
		aspectRatio: 1
	},
	accountBox: {
		backgroundColor: GlobalStyles.color.SECONDARY,
		borderRadius: 5,
		margin: 4,
		marginHorizontal: 8,
		paddingHorizontal: 17,
		paddingVertical: 8
	},
	optionsIcon: 
	{
		width: 30, 
		height: 40, 
		alignItems: 'flex-end', 
		paddingTop: 4, 
		paddingRight: 10, 
		marginRight: -16
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

class Sidebar extends Component<Props, State> {
    state = {};

	handleSelectAccount = (index) => {
		console.log('Select account #' + index);
	};

	handleDeleteAccount = (index) => {
		console.log('Delete account #' + index);
	};

	handleRenameAccount = (index) => {
		console.log('Rename account #' + index);
	};

	handleAddAccount = () => {
		console.log('Add account');
	};

	handleAccountDetails = () => {
		Router.goToAccountDetails({}, this.props.componentId);
	};

	handleSettingsClick = () => {
        Router.goToSettings({}, this.props.componentId);
	};

	renderSelectedAccountItem = () => {
		const { address, accountName, balance, nativeMosaicNamespace } = this.props;
		return (
			<TouchableOpacity onPress={() => this.handleAccountDetails()}>
				<SymbolGradientContainer noPadding style={styles.selectedAccountBox}>
					<Image source={require('@src/assets/backgrounds/connector.png')} style={styles.connectorImage} />
					<Text style={styles.selectedAccountName} type="bold" theme="dark">{accountName}</Text>
					<Text style={styles.selectedAccountAddress} theme="dark"> 
						<Trunc type="address">{address}</Trunc>
					</Text>
					<Text style={styles.selectedAccountMosaic} theme="dark">{nativeMosaicNamespace}</Text>
					<Text style={styles.selectedAccountBalance} theme="dark">{balance}</Text>
				</SymbolGradientContainer>
			</TouchableOpacity>
		);
	};
	
	renderAccountSelectorItem = ({accountName, balance, index}) => {
		const options = [
			{iconName: 'edit_light', label: 'Rename', onPress: () => this.handleRenameAccount(index)},
			{iconName: 'delete_light', label: 'Delete', onPress: () => this.handleDeleteAccount(index)}
		];

		return (
			<TouchableOpacity style={styles.accountBox} onPress={() => this.handleSelectAccount(index)}>
				<Row justify="space-between" fullWidth>
					<Text type="bold">
						{accountName}
					</Text>
					<OptionsMenu list={options} style={styles.optionsIcon}>
						<Icon name="options_dark" size="small"/>
					</OptionsMenu>
				</Row>
				
				<Text type="regular" align="right">
					{balance} {this.props.nativeMosaicNamespace}
				</Text>
			</TouchableOpacity>
		);
	};

	renderMenuItem = ({iconName, text, onPress}) => {
		return (
			<TouchableOpacity onPress={() => onPress()}>
				<Row fullWidth style={styles.menuItem} align="center">
					<Icon name={iconName} style={styles.menuItemIcon}/>
					<Text theme="light" type="bold" style={styles.menuItemText}>{text}</Text>
				</Row>
			</TouchableOpacity>
		);
	};

    render = () => {
		const { 
			accountList,
			isVisible
		} = this.props;
		const { } = this.state;
		const menuItems = [
			{ iconName: 'add_filled_light', text: 'Account Details', onPress: () => this.handleAccountDetails() },
			{ iconName: 'add_filled_light', text: 'Add Account', onPress: () => this.handleAddAccount() },
			{ iconName: 'settings_filled_light', text: 'Settings', onPress: () => this.handleSettingsClick() },
		];


		if(!isVisible)
			return null;

        return ( // TODO: restyle
            <TouchableOpacity style={styles.root} onPress={() => this.props.onHide()}>
                <GradientBackground theme="light" name="mesh" style={styles.menuContainer}>
					<TouchableOpacity onPress={()=>{}}>
					<Col justify="space-between" fullHeight>
						<Section isScrollable>
							{this.renderSelectedAccountItem()}
							{accountList.map(this.renderAccountSelectorItem)}
						</Section>
						<Section style={styles.menuBottomContainer}>
							{menuItems.map(this.renderMenuItem)}
						</Section>
					</Col>
					</TouchableOpacity>
				</GradientBackground>
            </TouchableOpacity>
        );
    }
}

export default connect(state => ({
	address: state.account.selectedAccountAddress,
	accountName: state.account.selectedAccount.name,
	balance: state.account.balance,
	nativeMosaicNamespace: 'XYM',
	accountList: [ 
		{ index: 2, accountName: 'New account', balance: 1 }, 
		{ index: 3, accountName: 'New account 2', balance: 0 }
	]
}))(Sidebar);
