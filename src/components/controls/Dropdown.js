import React, { Component } from 'react';
import { 
	StyleSheet, 
	Text, 
	View, 
	TouchableOpacity, 
	TouchableWithoutFeedback,
	Modal,
	FlatList
} from 'react-native';
import GlobalStyles from '@src/styles/GlobalStyles';
import { Icon, Row } from '@src/components';


const styles = StyleSheet.create({
	root: {
		//backgroundColor: '#f005',
	},
	fullWidth: {
		width: '100%',
	},
	titleLight: {
		color: GlobalStyles.color.GREY3,
	},
	titleDark: {
		color: GlobalStyles.color.WHITE,
	},
	placeholder: {
		opacity: 0.6
	},
	input: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		fontSize: 12,
		fontFamily: 'NotoSans-SemiBold',
		fontWeight: '300'
	},
	inputLight: {
		borderWidth: 1,
		borderRadius: 2,
		borderColor: GlobalStyles.color.GREY4,
		color: GlobalStyles.color.GREY1,
		backgroundColor: GlobalStyles.color.DARKWHITE,
	},
	inputDark: {
		borderRadius: 6,
		color: GlobalStyles.color.PRIMARY,
		backgroundColor: GlobalStyles.color.WHITE,
	},
	icon: {
		position: 'absolute',
		bottom: 0,
		height: 45,
		justifyContent: 'center',
		alignItems: 'center'
	},
	modalOverlay: {
		position: 'absolute',
		left: 0,
		top: 0,
		height: '100%',
		width: '100%',
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalWrapper: {
		padding: 34,
		height: '100%',
		justifyContent: 'center'
	},
	modal: {
		maxHeight: '80%',
		width: '100%',
		backgroundColor: GlobalStyles.color.DARKWHITE,
		opacity: 0.95,
		borderRadius: 6,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	modalTitleContainer: {
		borderBottomWidth: 1,
		borderColor: GlobalStyles.color.GREY4,
		padding: 12,
	},
	modalTitleText: {
		color: GlobalStyles.color.onLight.TEXT,
		fontFamily: 'NotoSans-SemiBold',
		fontSize: 18
	},
	listItem: {
		//borderBottomWidth: 1,
		borderColor: GlobalStyles.color.onLight.TEXT,
		padding: 12,
	},
	listItemText: {
		textAlign: 'center',
		color: GlobalStyles.color.PRIMARY,
	},
	listItemTextActive: {
		fontFamily: 'NotoSans-SemiBold',
		fontWeight: '400'
	}
});

type Theme = 'light' 
	| 'dark';

type ListItem = {
	value: string | number | Boolean,
	label: string
};

interface Props {
	fullWidth: boolean;
	theme: Theme;
	list: ListItem[];
	title: String;
	customItemReneder: (value: String) => void;
};

type State = {};


export default class Dropdown extends Component<Props, State> {
	state = {
		isSelectorOpen: false
	};

	getselectedOption = (value, list) => {
		const selectedOption = list.find(el => el.value === value);
		return selectedOption;
	};

	getIconPosition = (k, offset) => {
		return {
			right: offset,
			width: k
		}
	};

	getInputStyle = (k, offset) => {
		return {
			paddingRight: k + offset
		}
	};

	openSelector = () => {
		this.setState({isSelectorOpen: true});
	};

	closeSelector = () => {
		this.setState({isSelectorOpen: false});
	};

	onChange = (value) => {
		if(typeof this.props.onChange === 'function')
			this.props.onChange(value);
		this.closeSelector();
	};


	renderItem = (item) => {
		const { customItemReneder } = this.props;
		const isActive = this.props.value === item.item.value;
		const textStyles = [styles.listItemText];
		if(isActive)
			textStyles.push(styles.listItemTextActive);
			
		return (
			<TouchableOpacity 
				style={styles.listItem} 
				onPress={() => this.onChange(item.item.value)}
			>
				{(!customItemReneder 
					? <Text style={textStyles}>
						{item.item.label}
					</Text>
					: customItemReneder({ ...item.item, isActive, isListItem: true })
				)}
			</TouchableOpacity>
		);
	};

    render = () => {
		const { 
			style = {}, 
			inputStyle = {},
			theme, 
			fullWidth, 
			list = [],
			value, 
			placeholder = 'Please select..', 
			title,
			customItemReneder,
			children,
			...rest 
		} = this.props;
		const {
			isSelectorOpen
		} = this.state;
		let _inputStyle = {};
		let titleStyle = {};
		let rootStyle = [styles.root, style];
		const iconSize = 'small';
		const iconWrapperWidth = 30;
		const iconOffset = 8;
		const selectedOption = this.getselectedOption(value, list);

		if(fullWidth)
			rootStyle.push(styles.fullWidth);

		if(theme === 'light') {
			_inputStyle = styles.inputLight;
			titleStyle = styles.titleLight;
		}	
		else {
			_inputStyle = styles.inputDark;
			titleStyle = styles.titleDark;
		}

        return (
			<View style={rootStyle}>
				{!children && <Text style={titleStyle}>{title}</Text>}
				{!children && <TouchableOpacity 
					style={[styles.input, _inputStyle, inputStyle, this.getInputStyle(iconWrapperWidth, iconOffset)]}
					onPress={() => this.openSelector()}
				>
					{selectedOption &&
						(!customItemReneder 
							? <Text>{selectedOption.label}</Text>
							: customItemReneder(selectedOption)
						)
					}
					{!selectedOption && <Text style={styles.placeholder}>{placeholder}</Text>}
					<View style={[styles.icon, this.getIconPosition(iconWrapperWidth, iconOffset)]}>
						<Icon name="expand" size={iconSize} />
					</View>
				</TouchableOpacity>}
				{children && <TouchableOpacity 
					onPress={() => this.openSelector()}
				>
					{children}
				</TouchableOpacity>}

				<Modal
					animationType="fade"
					transparent
					visible={isSelectorOpen}
					onRequestClose={() => this.closeSelector()}
				>
					<TouchableWithoutFeedback onPress={() => this.closeSelector()}>
						<View style={styles.modalOverlay}></View>
					</TouchableWithoutFeedback>
					<View style={styles.modalWrapper}>
						<View style={styles.modal}>
							<Row justify="center" style={styles.modalTitleContainer}>
								<Text style={styles.modalTitleText}>{title}</Text>
							</Row>
							<FlatList 
								data={list} 
								renderItem={this.renderItem} 
								keyExtractor={(item) => item.value} 
							/>
						</View>
					</View>
				</Modal>
			</View>
        );
    };
}
