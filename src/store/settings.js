import { getDefaultCurrency, getDefaultLanguage, getDefaultSyncInterval } from '@src/config/environment';
import { AsyncCache } from '@src/utils/storage/AsyncCache';

export default {
    namespace: 'settings',
    state: {
        selectedLanguage: getDefaultLanguage(),
        selectedCurrency: getDefaultCurrency(),
        selectedSyncInterval: getDefaultSyncInterval(),
    },
    mutations: {
        setSelectedLanguage(state, payload) {
            state.settings.selectedLanguage = payload;
            return state;
        },
        setSelectedCurrency(state, payload) {
            state.settings.selectedLanguage = payload;
            return state;
        },
        setSelectedSyncInterval(state, payload) {
            state.settings.selectedLanguage = payload;
            return state;
        },
    },
    actions: {
        initState: async ({ commit, state }) => {
            const selectedLanguage = await AsyncCache.getSelectedLanguage();
            const selectedCurrency = await AsyncCache.getSelectedCurrency();
            const selectedNotification = await AsyncCache.getSelectedNotification();
            commit({ type: 'settings/setSelectedLanguage', payload: selectedLanguage });
            commit({ type: 'settings/setSelectedCurrency', payload: selectedCurrency });
            commit({ type: 'settings/setSelectedSyncInterval', payload: selectedNotification });
        },
    },
};
