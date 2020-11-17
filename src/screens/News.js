import React, { Component } from 'react';
import { RefreshControl, StyleSheet, View, FlatList } from 'react-native';
import { GradientBackground, ListContainer, ListItem, TitleBar } from '@src/components';
import New from '@src/components/organisms/New';
import GlobalStyles from '@src/styles/GlobalStyles';
import { connect } from 'react-redux';
import store from '@src/store';

const styles = StyleSheet.create({
    list: {
		marginBottom: 10,
	},
	inner: {
		borderRadius: 6,
		backgroundColor: GlobalStyles.color.WHITE,
	}
});

type Props = {};
type State = {};

class News extends Component<Props, State> {
    constructor(props: {}) {
        super(props);
	}

	refresh = () => {
		store.dispatchAction({type: 'news/loadNews'});
	}
	
	renderNewsItem = (item) => {
		return <ListItem>
			<New
				title={item.item.title} 
				contentSnippet={item.item.contentSnippet}
				body={item.item.content} 
				url={item.item.link} 
				publicationDate={item.item.pubDate} 
				creator={item.item.creator} 
			/> 
		</ListItem>
	}

    render() {
		const { news, onOpenMenu, onOpenSettings, isLoading } = this.props;
		const dataManager = {isLoading};

        return (
			<GradientBackground 
				name="connector_small" 
				theme="light" 
				dataManager={dataManager}
				titleBar={<TitleBar 
					theme="light"
					title="News" 
					onOpenMenu={() => onOpenMenu()} 
					onSettings={() => onOpenSettings()}
				/>}
			>
                
                <ListContainer type="list" style={styles.list} isScrollable={false}>
					<FlatList
						// style={{ height: '100%' }}
						data={news}
						renderItem={this.renderNewsItem}
						onEndReachedThreshold={0.9}
						keyExtractor={(item, index) => '' + index + 'news'}
						refreshControl={
							<RefreshControl
								//refresh control used for the Pull to Refresh
								refreshing={isLoading}
								onRefresh={() => this.refresh()}
							/>
						}
					/>
					
					{/* <View style={styles.inner}>
						{news.map(this.renderNewsItem)}
					</View> */}
                </ListContainer>
            </GradientBackground>
        );
    }
}

export default connect(state => ({
	news: state.news.news,
	isLoading: state.news.isLoading
}))(News);
