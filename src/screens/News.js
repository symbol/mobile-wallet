import React, { Component } from 'react';
import { Linking, StyleSheet, View, FlatList } from 'react-native';
import { GradientBackground, ListContainer, ListItem, TitleBar } from '@src/components';
import New from '@src/components/organisms/New';
import GlobalStyles from '@src/styles/GlobalStyles';
import { connect } from 'react-redux';

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
	
	renderNewsItem = (item, index) => {
		return <ListItem onPress={() => {}} key={'' + item.pubDate + index}>
			<New
				title={item.title} 
				body={item.content} 
				url={item.link} 
				publicationDate={item.pubDate} 
				creator={item.creator} 
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
                
                <ListContainer type="list" style={styles.list}>
					<View style={styles.inner}>
						{news.map(this.renderNewsItem)}
					</View>
                </ListContainer>
            </GradientBackground>
        );
    }
}

export default connect(state => ({
	news: state.news.news,
	isLoading: state.news.isLoading
}))(News);
