import React, { Component } from 'react';
import { View, Image, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { Text } from '@src/components';
import TextLink from '@src/components/atoms/TextLink';
import Card from '@src/components/atoms/Card';

const styles = StyleSheet.create({
	root: {
		backgroundColor: '#fffe',
		marginBottom: 10,
	}
});

type Props = {
    title: string,
    body: string,
    url: string,
    publicationDate: string,
    creator: string,
};

export default class New extends Component<Props> {
    onPress(url: string) {
        Linking.openURL(url);
    }

    render() {
        return (
            <Card style={styles.root}>
				<TouchableOpacity onPress={() => this.onPress(this.props.url)}>
					<Text theme="light" type="bold" style={styles.title}>
						{this.props.title}
					</Text>
					<Text theme="light"  type="regular" align={'right'} style={styles.content}>
						{this.props.publicationDate}
					</Text>
					{/* <Text theme="light" type="regular" align={'right'} style={styles.content}>
						{this.props.creator}
					</Text> */}
				</TouchableOpacity>
                
            </Card>
        );
    }
}
