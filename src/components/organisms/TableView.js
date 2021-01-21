import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import {
	Icon,
	Section,
	Text,
	Row,
	CopyView,
	SecretView,
	View,
	MosaicDisplay,
	Trunc
} from '@src/components';
import translate from "@src/locales/i18n";
import GlobalStyles from '@src/styles/GlobalStyles';
import { copyToClipboard } from '@src/utils';
import { connect } from 'react-redux';


const TRANSLATION_ROOT_KEY = 'table';
const renderTypeMap = {
	copyButton: ['address', 'recipientAddress', 'signerAddress', 'publicKey'],
	boolean: [],
	amount: ['amount', 'fee'],
	secret: ['privateKey'],
	mosaics: ['mosaics'],
	ecryption: ['messageEncrypted'],
};
const styles = StyleSheet.create({
	amount: {
		color: GlobalStyles.color.RED
	},
	mosaic: {
		backgroundColor: GlobalStyles.color.WHITE,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: GlobalStyles.color.SECONDARY,
		paddingVertical: 8,
		paddingHorizontal: 16
	}
});

type Props = {};

type State = {};


class TableView extends Component<Props, State> {

	render_copyButton = (value) => {
		if(typeof value === 'string')
			return <CopyView theme="light">{value}</CopyView>
		else
			return <Text type="regular" theme="light">{translate('table.null')}</Text>;
	};
	render_secret = (value) => {
		return <SecretView componentId={this.props.componentId} title="Show " theme="light">{value}</SecretView>
	};
	render_boolean = (value) => {
		return <Icon name={value + '_light'} size="small"/>
	};
	render_ecryption = (value) => {
		return <Text type="regular" theme="light">{translate('table.' + (value ? 'encrypted' : 'unencrypted'))}</Text>;
	};
	render_amount = (value) => {
		if (value === 0) return <Text type="regular" theme="light" style={styles.amount}>{value}</Text>
		return <Text type="regular" theme="light" style={styles.amount}>-{value}</Text>
	};
	render_mosaics = (value) => {
		const mosaics = Array.isArray(value) ? value : [];
		if(mosaics.length)
			return mosaics.map((el, index) => (<Row justify="space-between" fullWidth style={styles.mosaic} key={'' + index + 'tv-mosaics'}>
				<Row align="center">
					<Icon name="mosaic_custom" size="small" style={{marginRight: 8}}/>
					<Text type="regular" theme="light"><Trunc type="namespaceName">{el.mosaicName}</Trunc></Text>
				</Row>
				{this.render_amount(el.amount / Math.pow(10, el.divisibility))}
		</Row>));
		return <Text type="regular" theme="light">{translate('table.null')}</Text>
	}

	renderItem = (key, value) => {
		let ItemTemplate;

		Object.keys(renderTypeMap)
			.find(itemType => renderTypeMap[itemType]
				.find(el => {
					if(el === key) {
						ItemTemplate = this['render_' + itemType](value);
						return true;
					}
				}));

		if(!ItemTemplate && typeof value === 'object' && value !== null)
			return this.renderTable(value);
		return ItemTemplate ? ItemTemplate : <Text type="regular" theme="light">{value}</Text>
	};

	renderTable = (data) => {
		let _data = data;
		if(data === null || typeof data !== 'object')
			return null;

		if(!Array.isArray(data))
			_data = Object
				.keys(data)
				.filter(key => data[key] !== null && data[key] !== undefined)
				.map(key => ({
					key,
					value: data[key]
				}));
		_data = _data.slice(0,6);
        return (
			_data.map((el, item) => <Section type="form-item" key={''+ item + 'table' + el.key}>
				<Text type="bold" theme="light">{translate(`${TRANSLATION_ROOT_KEY}.${el.key}`)}:</Text>
				{this.renderItem(el.key, el.value)}
			</Section>)
        );
	}

	render = () => {
		const {
			data
		} = this.props;

		return this.renderTable(data);
    };
}

export default TableView;
// connect(state => ({

// }))(TableView);
