import React, { Component, useRef } from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	TouchableHighlight,
	Modal,
	FlatList,
	ActivityIndicator
} from 'react-native';
import Popover from 'react-native-popover-view';
import GlobalStyles from '@src/styles/GlobalStyles';
import { Icon, Row, Text } from '@src/components';


const styles = StyleSheet.create({
	root: {
		paddingVertical: 8,
	},
	listItem: {
		paddingVertical: 8,
		paddingHorizontal: 16
	},
	icon: {
		marginRight: 16
	},
	label: {

	},
});

type Theme = 'light'
	| 'dark';

type ListItem = {
	onPress: () => void,
	iconName: String,
	label: string
};

interface Props {
	theme: Theme;
	list: ListItem[];
};

type State = { isVisible: boolean };


export default class OptionsMenu extends Component<Props, State> {
	state = {
		isVisible: false
	};

	renderItem = (item) => {
		const onPress = () => {
			if (typeof item.item.onPress === 'function')
				item.item.onPress();
			this.setState({isVisible: false})
		};

		return (
			<TouchableHighlight
				underlayColor="#0001"
				onPress={() => onPress()}
			>
				<Row style={styles.listItem} align="center">
					<Icon style={styles.icon} name={item.item.iconName} size="small" />
					<Text style={styles.label} type="bold" theme="light">{item.item.label}</Text>
				</Row>
			</TouchableHighlight>
		);
	};

	render = () => {
		const {
			style = {},
			list = [],
			children
		} = this.props;
		const {
			isVisible
		} = this.state;
		let touchable;

		return (
			<>
				
				<Popover
					from={
						<TouchableOpacity style={style} onPress={() => this.setState({isVisible: true})}>
							{children}
						</TouchableOpacity>
					}
					isVisible={isVisible}
					animationConfig={{ duration: 200}}
					arrowStyle={{ backgroundColor: 'transparent' }}
					onRequestClose={() => this.setState({isVisible: false})}
				>
					<FlatList
						style={styles.root}
						data={list}
						renderItem={this.renderItem}
						keyExtractor={(item, index) => item.label + index}
					/>
				</Popover>
			</>
		);
		return (
			<View style={rootStyle}>
				{!children && <Text style={titleStyle}>{title}</Text>}
				{!children && <TouchableOpacity
					style={inputStyles}
					onPress={() => !isLoading && this.openSelector()}
				>
					{selectedOption &&
						(!customInputReneder
							? <Text style={styles.inputText}>{selectedOption.label}</Text>
							: customInputReneder(selectedOption)
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
				{isLoading && <ActivityIndicator size="small" color={GlobalStyles.color.PINK} style={styles.loading} />}
			</View>
		);
	};
}
