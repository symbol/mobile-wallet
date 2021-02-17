import RSSParser from 'rss-parser';
import { htmlToPlainString, removeRSSContentEnd } from '@src/utils';
import { formatDate } from '@src/utils/format';

export default {
    namespace: 'news',
    state: {
        isLoading: false,
        news: [],
    },
    mutations: {
        setLoading(state, payload) {
            state.news.isLoading = payload;
            return state;
        },
        setNews(state, payload) {
            state.news.news = payload;
            return state;
        },
    },
    actions: {
        loadNews: async ({ commit }) => {
            commit({ type: 'news/setLoading', payload: true });
            try {
                const response = await fetch('http://rssmix.com/u/11801188/rss.xml');
                const responseText = await response.text();
                const rss = await new RSSParser().parseString(responseText);
                const news = rss.items.map(el => ({
                    ...el,
                    content: removeRSSContentEnd(htmlToPlainString(el.content)),
                    pubDate: formatDate(el.pubDate)
                }));
                commit({ type: 'news/setNews', payload: news});
            } catch (e) {
                console.log('Error loading news');
                commit({ type: 'news/setNews', payload: [] });
            }
            commit({ type: 'news/setLoading', payload: false });
        },
    },
};
