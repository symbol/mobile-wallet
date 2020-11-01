import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, Linking } from 'react-native';
import TextLink from '@src/components/atoms/TextLink';
import Card from '@src/components/atoms/Card';

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        color: '#451063',
        marginLeft: '10%',
        marginRight: '10%',
        marginTop: 15,
        marginBottom: 10,
        padding: 7,
        backgroundColor: 'white',
        fontStyle: 'italic',
        borderRadius: 5,
    },
    content: {
        marginRight: '10%',
    },
    link: {
        textAlign: 'right',
        color: '#451063',
        marginRight: '10%',
    },
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
            <Card>
                <Text theme={'light'} style={styles.title}>
                    {' '}
                    {this.props.title}{' '}
                </Text>
                <TextLink style={styles.link} href={() => this.onPress(this.props.url)}>
                    {' '}
                    More info{' '}
                </TextLink>
                <Text theme={'dark'} align={'right'} style={styles.content}>
                    {' '}
                    {this.props.publicationDate}{' '}
                </Text>
                <Text theme={'dark'} align={'right'} style={styles.content}>
                    {' '}
                    {this.props.creator}{' '}
                </Text>
            </Card>
        );
    }
}
