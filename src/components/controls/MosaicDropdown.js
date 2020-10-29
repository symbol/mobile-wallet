import React, { Component } from 'react';
import { 
	StyleSheet, 
	Text,
} from 'react-native';
import GlobalStyles from '@src/styles/GlobalStyles';
import { Dropdown, Row } from '@src/components';


const styles = StyleSheet.create({
	root: {
		paddingHorizontal: 10
	},
	text: {
		color: GlobalStyles.color.PRIMARY
	},
	rootActive: {
		
	},
	textActive: {
		fontFamily: 'NotoSans-SemiBold',
		fontWeight: '400'
	},
	balance: {
		fontSize: 12,
		color: GlobalStyles.color.GREY3
	},
});


interface Props {};
type State = {};


export default class MosaicDropdown extends Component<Props, State> {
	state = {
		isSelectorOpen: false
	};

	renderItem = (item) => {
		const isActive = item.isActive;
		const textStyles = [];
		const rootStyles = [];

		if(item.isListItem) {
			textStyles.push(styles.text);
			rootStyles.push(styles.root);
		}

		if(isActive) {
			textStyles.push(styles.textActive);
			rootStyles.push(styles.rootActive);
		}
			
		return (
			<Row style={rootStyles} justify ="space-between">
				<Text style={textStyles}>
					{item.label}
				</Text>
				<Text style={[styles.balance, textStyles]}>
					{item.balance}
				</Text>
			</Row>
		);
	};

    render = () => {
		const { ...rest } = this.props;

        return <Dropdown customItemReneder={this.renderItem} {...rest} />
    };
}
