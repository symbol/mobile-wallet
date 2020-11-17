import RSSParser from 'rss-parser';

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
            const response = await fetch('http://rssmix.com/u/11801188/rss.xml');
            const responseText = await response.text();
            const rss = await new RSSParser().parseString(responseText);
            let news = rss.items;
            commit({ type: 'news/setNews', payload: news });
            commit({ type: 'news/setLoading', payload: false });
        },
    },
};
