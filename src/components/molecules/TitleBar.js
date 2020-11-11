import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Row, Col, Icon, Text, Section } from '@src/components';
import GlobalStyles from '../../styles/GlobalStyles';
import translate from "@src/locales/i18n";
import { Router, BASE_SCREEN_NAME } from "@src/Router";


const styles = StyleSheet.create({
	root: {
		width: '100%',
		height: 72,
		marginTop: 2,
		//backgroundColor: '#f005',

	},
	iconLeft: {
		//backgroundColor: '#f005',
		height: '100%',
		paddingEnd: GlobalStyles.section.title.paddingLeft / 2,
		paddingStart: GlobalStyles.section.title.paddingLeft / 2,
		marginLeft: - (GlobalStyles.section.title.paddingLeft / 2) -5
	},
	iconRight: {
		height: '100%',
		paddingEnd: GlobalStyles.section.title.paddingLeft / 2,
		paddingStart: GlobalStyles.section.title.paddingLeft / 2,
		marginRight: - (GlobalStyles.section.title.paddingLeft / 2) -5
	}
});

type Theme = 'light'
	| 'dark';

interface Props {
	theme: Theme;
	onOpenMenu: function;
	onBack: function;
	onSettings: function;
	title: string;
	subtitle: string;
	buttons: Component[];
};

interface State {
	items: MenuItem[]
};


export default class PluginList extends Component<Props, State> {

	render = () => {
		const {
			style = {},
			theme,
			onOpenMenu,
			onBack,
			onSettings,
			onReload,
			title,
			subtitle,
			buttons
		} = this.props;

		const iconBackName = theme === 'light'
			? 'back_light'
			: 'back_dark';

		const iconSettingsName = theme === 'light'
			? 'settings_light'
			: 'settings_dark';

		const iconMenuName = theme === 'light'
			? 'options_light'
			: 'options_dark';


		return (
			<Section type="title" style={[style]}>
				<Row justify="space-between" align="center" style={styles.root}>
					<Row justify="start" align="center">
						{!!onOpenMenu && <TouchableOpacity style={styles.iconLeft} onPress={onOpenMenu} >
							<Icon name={iconMenuName} size="small" />
						</TouchableOpacity>}
						{!!onBack && <TouchableOpacity style={styles.iconLeft} onPress={onBack} >
							<Icon name={iconBackName} />
						</TouchableOpacity>}
						{!onBack && !onOpenMenu && <Icon name="none" />}
					</Row>
					<Col style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} align="center" justify="center">
						<Text type='title-small' theme={theme} wrap align="center" style={{maxWidth: '70%'}}>{title}</Text>
					</Col>
					<Row justify="end" align="center">
						{buttons}
						{!!onSettings && <TouchableOpacity style={styles.iconRight} onPress={onSettings}>
							<Icon name={iconSettingsName} />
						</TouchableOpacity>}
						{!onSettings && <Icon name="none" />}
					</Row>
				</Row>
			</Section>
		);
	};
}
