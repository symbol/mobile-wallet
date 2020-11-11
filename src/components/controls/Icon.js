import React, { Component } from 'react';
import { StyleSheet, Image, View } from 'react-native';


const styles = StyleSheet.create({
	large: {
		height: 128,
		width: 128
	},
	big: {
		height: 64,
		width: 64
	},
	medium: {
		height: 24,
		width: 24
	},
	small: {
		height: 16,
		width: 16
	},
});


type IconName = 'none'
	| 'send'
	| 'receive'
	| 'news'
	| 'mosaics'
	| 'home'
	| 'history'
	| 'harvest'
	| 'back_light'
	| 'back_dark'
	| 'settings_light'
	| 'settings_dark'
	| 'paste'
	| 'qr'
	| 'expand'
	| 'incoming_light'
	| 'outgoing_light'
	| 'options_dark'
	| 'add_light'
	| 'add_filled_light'
	| 'delete_light'
	| 'edit_light'
	| 'true_light'
	| 'true_dark'
	| 'false_light'
	| 'copy';

type Size = 'large'
	| 'big'
	| 'medium'
	| 'small';

interface Props {
	name: IconName,
	size: Size
};

type State = {};


export default class C extends Component<Props, State> {
    render() {
		const { style = {}, name, size } = this.props;
		let source;
		let _style = {};

        switch (name) {
            case 'none':
                break;
            case 'news':
                source = require('@src/assets/icons/menu/news.png');
                break;
            case 'send':
                source = require('@src/assets/icons/send.png');
                break;
            case 'receive':
                source = require('@src/assets/icons/receive.png');
                break;
            case 'mosaics':
                source = require('@src/assets/icons/menu/mosaics.png');
                break;
            case 'home':
                source = require('@src/assets/icons/menu/home.png');
                break;
            case 'history':
                source = require('@src/assets/icons/menu/history.png');
                break;
            case 'harvest':
                source = require('@src/assets/icons/menu/harvest.png');
                break;
            case 'back_light':
                source = require('@src/assets/icons/back_light.png');
                break;
            case 'back_dark':
                source = require('@src/assets/icons/back_dark.png');
                break;
            case 'settings_light':
                source = require('@src/assets/icons/settings_light.png');
				break;
			case 'settings_filled_light':
				source = require('@src/assets/icons/settings_filled_light.png');
				break;
            case 'settings_dark':
                source = require('@src/assets/icons/settings_dark.png');
                break;
            case 'paste':
				source = require('@src/assets/icons/clipboard.png');
				break;
			case 'qr':
				source = require('@src/assets/icons/qr.png');
				break;
			case 'expand':
				source = require('@src/assets/icons/expand.png');
				break;
			case 'incoming_light':
				source = require('@src/assets/icons/incoming.png');
				break;
			case 'outgoing_light':
				source = require('@src/assets/icons/outgoing.png');
				break;
			case 'options_dark':
				source = require('@src/assets/icons/options_dark.png');
				break;
			case 'add_light':
				source = require('@src/assets/icons/add_light.png');
				break;
			case 'add_filled_light':
				source = require('@src/assets/icons/add_filled_light.png');
				break;
			case 'delete_light':
				source = require('@src/assets/icons/delete_light.png');
				break;
			case 'edit_light':
				source = require('@src/assets/icons/edit_light.png');
				break;
			case 'true_light':
				source = require('@src/assets/icons/true_light.png');
				break;
			case 'true_dark':
				source = require('@src/assets/icons/true_dark.png');
				break;
			case 'false_light':
				source = require('@src/assets/icons/false_light.png');
				break;
			case 'copy':
				source = require('@src/assets/icons/copy.png');
				break;
			default:
                source = require('@src/assets/icons/ic-about.png');
                break;
        }

		switch(size) {
			case 'large':
				_style = styles.large
				break;
			case 'big':
				_style = styles.big
				break;
			case 'medium':
				_style = styles.medium
				break;
			case 'small':
				_style = styles.small
				break;
			default:
				_style = styles.medium
				break;
		}
		
		if(!source) return <View style={[_style, style]} />;
        return <Image style={[_style, style]} source={source} />;
    }
}
