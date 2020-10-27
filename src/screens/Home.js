import React, { Component } from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {
	Section,
	GradientBackground,
	BalanceWidget,
	Text, Icon
} from '@src/components';
import translate from "@src/locales/i18n";
import { Router } from "@src/Router";
import store from '@src/store';
import Button from "react-native-share/components/Button";


const styles = StyleSheet.create({});

type Props = {
	componentId: string,
};

type State = {};


export default class Home extends Component<Props, State> {
	state = {};

	handleSettingsClick = () => {
		console.log(this.props.componentId);
		Router.goToSettings({}, this.props.componentId);
	};

    render() {
		const {} = this.props;
		const {} = this.state;

        return (
			<GradientBackground name='mesh'>
				<Section type="title">
					<Text type='title'>Home</Text>
				</Section>
				<Section type="button">
					<TouchableOpacity onPress={this.handleSettingsClick} >
						<Icon name="settings" size="medium" style={styles.icon} click/>
					</TouchableOpacity>
				</Section>
				<Section type="title">
					<Text type='subtitle'>Switch account button, qr, etc..</Text>
				</Section>
				<Section type="center">
					<BalanceWidget/>
				</Section>
			</GradientBackground>
        );
    };
}
