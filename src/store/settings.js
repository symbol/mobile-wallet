import {
    getDefaultCurrency,
    getDefaultLanguage,
    getDefaultSyncInterval,
} from '@src/config/environment';
import { AsyncCache } from '@src/utils/storage/AsyncCache';
import {setI18nConfig} from "@src/locales/i18n";

export default {
    namespace: 'settings',
    state: {
        selectedLanguage: getDefaultLanguage(),
        selectedCurrency: getDefaultCurrency(),
        selectedSyncInterval: getDefaultSyncInterval(),
        isPasscodeSelected: false,
    },
    mutations: {
        setSelectedLanguage(state, payload) {
            state.settings.selectedLanguage = payload;
            return state;
        },
        setSelectedCurrency(state, payload) {
            state.settings.selectedCurrency = payload;
            return state;
        },
        setSelectedSyncInterval(state, payload) {
            state.settings.selectedSyncInterval = payload;
            return state;
        },
        setIsPasscodeSelected(state, payload) {
            state.settings.isPasscodeSelected = payload;
            return state;
        },
    },
    actions: {
        initState: async ({ commit, state }) => {
            const selectedLanguage = await AsyncCache.getSelectedLanguage();
            commit({ type: 'settings/setSelectedLanguage', payload: selectedLanguage });
            const selectedCurrency = await AsyncCache.getSelectedCurrency();
            commit({ type: 'settings/setSelectedCurrency', payload: selectedCurrency });
            const selectedNotification = await AsyncCache.getSelectedNotification();
            commit({ type: 'settings/setSelectedSyncInterval', payload: selectedNotification });
            const isPasscodeSelected = await AsyncCache.getIsPasscodeSelected();
            commit({ type: 'settings/setIsPasscodeSelected', payload: isPasscodeSelected });
        },
        saveSelectedCurrency: async ({ commit, state }, payload) => {
            await AsyncCache.setSelectedCurrency(payload);
            commit({ type: 'settings/setSelectedCurrency', payload: payload });
        },
        saveSelectedLanguage: async ({ commit, state }, payload) => {
            await AsyncCache.setSelectedLanguage(payload);
            await setI18nConfig(payload);
            commit({ type: 'settings/setSelectedLanguage', payload: payload });
        },
        saveSelectedSyncInterval: async ({ commit, state }, payload) => {
            await AsyncCache.setSelectedSyncInterval(payload);
            commit({ type: 'settings/setSelectedSyncInterval', payload: payload });
        },
        saveIsPasscodeSelected: async ({ commit, state }, payload) => {
            await AsyncCache.setIsPasscodeSelected(payload);
            commit({ type: 'settings/setIsPasscodeSelected', payload: payload });
        },
    },
};
