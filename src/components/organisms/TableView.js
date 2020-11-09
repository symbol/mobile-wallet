import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import {
	Icon,
	Section,
	Text,
} from '@src/components';
import translate from "@src/locales/i18n";
import Store from '@src/store';
import GlobalStyles from '@src/styles/GlobalStyles';
import { Router } from "@src/Router";
import { connect } from 'react-redux';


const TRANSLATION_ROOT_KEY = 'table';
const renderTypeMap = {
	copyButton: ['recipientAddress', 'signerAddress'],
	boolean: ['messageEncrypted'],
	amount: ['amount', 'fee']
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
		return <Text type="regular" theme="light">copy {value}</Text>
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

		if(data === null || typeof data !== 'object')
			return null;

        return (
			data.map(el => <Section type="form-item">
				<Text type="bold" theme="light">{translate(`${TRANSLATION_ROOT_KEY}.${el.key}`)}:</Text>
				{this.renderItem(el.key, el.value)}
			</Section>)
        );
    };
}

export default connect(state => ({

}))(TableView);
