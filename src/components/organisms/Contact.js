import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@src/components';
import Card from '@src/components/atoms/Card';
import { Router } from '@src/Router';
import store from '@src/store';

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#fffe',
        marginBottom: 10,
    },
});

type Props = {
    address: string,
    name: string,
    phone: string,
    email: string,
    label: string,
    notes: string,
    id: string,
    componentId: string,
};

export default class Contact extends Component<Props> {
    onPress(contact) {
        store.dispatchAction({ type: 'addressBook/selectContact', payload: contact }).then(_ => Router.goToContactProfile({}, this.props.componentId));
    }

    render() {
        return (
			<TouchableOpacity onPress={() => this.onPress(this.props)}>
				<Card style={styles.root}>
					<Text theme="light" type="bold" style={styles.title}>
						{this.props.name}
					</Text>
					<Text theme="light" type="regular" align={'left'} style={styles.content}>
						{this.props.address}
					</Text>
				</Card>
			</TouchableOpacity> 
        );
    }
}
