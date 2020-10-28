import React, { Component } from 'react';
import { 
	StyleSheet, 
	Text, 
	View, 
	TouchableOpacity, 
	TouchableWithoutFeedback,
	Modal
} from 'react-native';
import GlobalStyles from '@src/styles/GlobalStyles';
import { Icon } from '@src/components';


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
		right: 0,
		bottom: 0,
		top: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
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

	getSelectedLabel = (value, list) => {
		const selectedOption = list.find(el => el.value === value);
		if(selectedOption)
			return selectedOption.label;
		return null;
	};

	getIconPosition = (k, offset) => {
		return {
			right: offset,
			width: k
		}
	};

	getInputStyle = (numberOfIcons, k, offset) => {
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
		const selectedLabel = this.getSelectedLabel(value, list);

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
				<Text style={titleStyle}>{title}</Text>
				<TouchableOpacity 
					style={[styles.input, _inputStyle, inputStyle]}
					onPress={() => this.openSelector()}
				>
					{selectedLabel && 
						(customItemReneder 
							? <Text>{selectedLabel}</Text>
							: customItemReneder(value)
						)
					}
					{!selectedLabel && <Text style={styles.placeholder}>{placeholder}</Text>}
					<View style={[styles.icon, this.getIconPosition(iconWrapperWidth, iconOffset)]}>
						<Icon name="expand" size={iconSize} />
					</View>
				</TouchableOpacity>

				<Modal
					animationType="fade"
					transparent
					visible={isSelectorOpen}
					onRequestClose={() => this.closeSelector()}
				>
					<TouchableWithoutFeedback onPress={() => this.closeSelector()}>
						<View style={styles.modalOverlay}></View>
					</TouchableWithoutFeedback>
				</Modal>
			</View>
        );
    };
}
