import React, { Component } from 'react';
import { View, Image, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { Text, Row, Col, } from '@src/components';
import GlobalStyles from '@src/styles/GlobalStyles';
import TextLink from '@src/components/atoms/TextLink';
import Card from '@src/components/atoms/Card';

const styles = StyleSheet.create({
	root: {
		width: '100%',
        borderRadius: 6,
        backgroundColor: GlobalStyles.color.WHITE
	},
	content: {
		marginTop:0
	},
	title: {
		fontFamily: 'NotoSans-SemiBold',
		fontWeight: '600',
		fontSize: 14,
		lineHeight: 20,
		marginBottom: 6
	},
	date: {
		fontSize: 12,
	},
	source: {
		fontSize: 12,
		fontStyle: 'italic'
	},
	body: {
		fontFamily: 'NotoSans-Light',
		fontSize: 12,
	},
	link: {
		fontSize: 12,
		color: GlobalStyles.color.BLUE,
		textDecorationLine: 'underline'
	},
});

type Props = {
    title: string,
	body: string,
	contentSnippet: string,
    url: string,
    publicationDate: string,
    creator: string,
};

export default class New extends Component<Props> {
    onPress() {
        Linking.openURL(this.props.url);
    }

    render() {
        return (
			<View onPress={() => this.onPress(this.props.url)} style={styles.root}>
				<Row justify="space-between" fullWidth>
					<Col style={{flex: 0.6}}>
						<Text theme="light" style={styles.title}>
							{this.props.title}
						</Text>
					</Col>
					<Col style={{flex: 0.4}}>
						<Text theme="light" align="right" style={styles.date}>
							{this.props.publicationDate}
						</Text>
						<Text theme="light" align="right" style={styles.source}>
							blog.nem.io
						</Text>
					</Col>
				</Row>
				<Row justify="space-between" align="end" fullWidth>
					<Col style={{flex: 1}}>
						<Text theme="light" style={styles.body}>
							{this.props.body}
						</Text>
					</Col>
				</Row>
				<Row justify="space-between" align="end" fullWidth>
					<Col style={{flex: 1}}>
						<TouchableOpacity onPress={() => this.onPress()}>
							<Text theme="light" align="right" style={styles.link}>
								Read more
							</Text>
						</TouchableOpacity>
					</Col>
				</Row>
				{/* <Text theme="light" type="bold" style={styles.title}>
					{this.props.title}
				</Text>
				<Text theme="light"  type="regular" align={'right'} style={styles.content}>
					{this.props.publicationDate}
				</Text> */}
			</View>
        );
    }
}
