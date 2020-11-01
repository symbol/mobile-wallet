import React, { Component } from 'react';
import {Linking, StyleSheet, View } from 'react-native';
import { ImageBackground, Text, TitleBar } from '@src/components';
import RSSParser from 'rss-parser';
import TextLink from "@src/components/atoms/TextLink";

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

type Props = {};
type State = {};

export default class News extends Component<Props, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            feed: [],
        };
    }

    onPress(url) {
        Linking.openURL(url);
    }

    async componentDidMount() {
        await fetch('http://rssmix.com/u/11801188/rss.xml')
            .then(response => response.text())
            .then(responseData => new RSSParser().parseString(responseData))
            .then(rss => {
                let parsedStream = rss.items.map(({ title, pubDate, creator, link }) => ({
                    title,
                    pubDate,
                    creator,
                    link,
                }));
                this.setState({
                    feed: parsedStream.slice(0, 4),
                });
            });
    }


    render() {
        const {} = this.props;
        let { feed } = this.state;

        return (
            <ImageBackground name="tanker">
                <TitleBar theme="light" title="News" />
                {feed.map(item => (
                    <View>
                        <Text theme={'light'} style={styles.title}> {item.title} </Text>
                        <TextLink style={styles.link} href={() => this.onPress(item.link)} > More info </TextLink>
                        <Text theme={'dark'} align={'right'} style={styles.content}> {item.pubDate} </Text>
                        <Text theme={'dark'} align={'right'} style={styles.content}> {item.creator} </Text>
                    </View>
                ))}
            </ImageBackground>
        );
    }
}
