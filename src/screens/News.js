import React, { Component } from 'react';
import { Linking, StyleSheet, View, FlatList } from 'react-native';
import { GradientBackground, ListContainer, TitleBar } from '@src/components';
import New from '@src/components/organisms/New';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
    list: {
        marginBottom: 36,
    },
});

type Props = {};
type State = {};

class News extends Component<Props, State> {
    constructor(props: {}) {
        super(props);
    }

    render() {
		const { news, onOpenMenu, onOpenSettings } = this.props;
		const dataManager = {};

        return (
            <GradientBackground name="connector_small" theme="light" dataManager={dataManager}>
                <TitleBar 
					theme="light"
					title="News" 
					onOpenMenu={() => onOpenMenu()} 
					onSettings={() => onOpenSettings()}
				/>
                <ListContainer type="list" style={styles.list}>
                    {news.map(item => {
						return <New 
							title={item.title} 
							body={item.content} 
							url={item.link} 
							publicationDate={item.pubDate} 
							creator={item.creator} 
						/>;
                    })}
                </ListContainer>
            </GradientBackground>
        );
    }
}

export default connect(state => ({
    news: state.news.news,
}))(News);
