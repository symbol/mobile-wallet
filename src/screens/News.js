import React, { Component } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { ImageBackground, Section, Text, TitleBar } from '@src/components';
import New from '@src/components/organisms/New';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
    list: {
        marginTop: 30,
    },
});

type Props = {};
type State = {};

class News extends Component<Props, State> {
    constructor(props: {}) {
        super(props);
    }

    render() {
        const { news } = this.props;
        console.log(news);
        return (
            <ImageBackground name="tanker">
                <TitleBar theme="light" title="News" />
                <Section type="list" style={styles.list}>
                    {news.map(item => {
                        return <New title={item.title} body={item.content} url={item.link} publicationDate={item.pubDate} creator={item.creator} />;
                    })}
                </Section>
            </ImageBackground>
        );
    }
}

export default connect(state => ({
    news: state.news.news,
}))(News);
