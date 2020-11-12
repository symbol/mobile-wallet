import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import {
	Icon,
	Section,
	Text,
	Row,
	CopyView,
	SecretView
} from '@src/components';
import translate from "@src/locales/i18n";
import Store from '@src/store';
import GlobalStyles from '@src/styles/GlobalStyles';
import { copyToClipboard } from '@src/utils';
import { connect } from 'react-redux';


const TRANSLATION_ROOT_KEY = 'table';
const renderTypeMap = {
	copyButton: ['address', 'recipientAddress', 'signerAddress', 'publicKey'],
	boolean: ['messageEncrypted'],
	amount: ['amount', 'fee'],
	secret: ['privateKey']
};
const styles = StyleSheet.create({
	amount: {
		color: GlobalStyles.color.RED
	}
});

type Props = {};

type State = {};


class TableView extends Component<Props, State> {
	state = {};

	render_copyButton = (value) => {
		return <CopyView theme="light">{value}</CopyView>
	};
	render_secret = (value) => {
		return <SecretView theme="light">{value}</SecretView>
	};
	render_boolean = (value) => {
		return <Icon name={value + '_light'} size="small"/>
	};
	render_amount = (value) => {
		return <Text type="regular" theme="light" style={styles.amount}>-{value}</Text>
	};

	renderItem = (key, value) => {
		let itemTemplate;

		Object.keys(renderTypeMap)
			.find(itemType => renderTypeMap[itemType]
				.find(el => {
					if(el === key) {
						itemTemplate = this['render_' + itemType](value);
						return true;
					}
				}));
			

		return itemTemplate ? itemTemplate : <Text type="regular" theme="light">{value}</Text>
		
	};

    render = () => {
		const {
			data
		} = this.props;
		
		let _data = data;

		if(data === null || typeof data !== 'object')
			return null;
			
		if(!Array.isArray(data))
			_data = Object
				.keys(data)
				.map(key => ({
					key, 
					value: data[key]
				}));

        return (
			_data.map(el => <Section type="form-item">
				<Text type="bold" theme="light">{translate(`${TRANSLATION_ROOT_KEY}.${el.key}`)}:</Text>
				{this.renderItem(el.key, el.value)}
			</Section>)
        );
    };
}

export default TableView;
// connect(state => ({

// }))(TableView);