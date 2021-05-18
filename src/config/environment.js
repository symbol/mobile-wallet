/**
 * @format
 * @flow
 */
import {
    sessionTimeoutInSeconds,
    marketCurrencyName,
    newsURL,
    explorerURL,
    faucetURL,
    aboutURL,
    currencies,
    lanugages,
    syncIntervals,
    nodeTypes,
    networks,
    defaultSyncInterval,
    optinEnv,
    NISNodes,
    defaultNetworkType,
    nativeMosaicId,
    optInWhiteList,
    nglFinanceBot,
} from 'react-native-env-json';
import { NetworkType } from "symbol-sdk";
import { languageNames } from '@src/locales/i18n';
import type {AppNetworkType} from "@src/storage/models/NetworkModel";

// Session timeout
const getSessionTimeoutInMillis = (): number => {
    return sessionTimeoutInSeconds * 1000;
};

// Market currency
const getMarketCurrencyLabel = (): string => {
    return marketCurrencyName;
};

// News URL
const getNewsURL = (): string => {
    return newsURL;
};

// Explorer URL
const getExplorerURL = (network: AppNetworkType): string => {
    return explorerURL[network];
};

// Explorer URL
const getFaucetUrl = (): string => {
    return faucetURL;
};

// Explorer URL
const getAboutURL = (): string => {
    return aboutURL;
};

// Currency
const getCurrencyList = (): Array<string> => {
    return Object.keys(currencies);
};

const getDefaultCurrency = (): string => {
    return currencies.USD || 'USD';
};

const getCurrencyValue = (currencyKey: string): string => {
    return currencies[currencyKey];
};

// Lanugage
const getLanguageList = (): Array<string> => {
    console.log(lanugages);
    return Object.keys(lanugages);
};

const getDefaultLanguage = (): string => {
    return 'en';
};

const getLanguageValue = (languageKey: string): string => {
    return lanugages[languageKey];
};

// Notification/Sync interval
const getValidSyncIntervals = (): Array<string> => {
    return Object.keys(syncIntervals);
};

const getDefaultSyncInterval = (): string => {
    return defaultSyncInterval || 'OFF';
};

const getSyncIntervalValue = (intervalKey: string): number => {
    return syncIntervals[intervalKey];
};

// Node types
const getAvailableNodeTypes = (): Array<string> => {
    return Object.keys(nodeTypes);
};

const getDefaultNodeType = (): string => {
    return nodeTypes.MAINNET || 'mainnet';
};

const getNodeTypeValue = (nodeTypeKey: string): string => {
    return nodeTypes[nodeTypeKey];
};

const isCustomNode = (nodeType: string): boolean => {
    return nodeType !== undefined && nodeType === nodeTypes.CUSTOM;
};

// Network info
const getNetworkInfo = (nodeType: string): Object => {
    console.log(networks)
    const networkConfig = networks[nodeType];
    // use mainnet as fallback config
    return networkConfig !== undefined ? networkConfig : networks.MAINNET;
};

const getOptinEnv = (): string => {
    return optinEnv
};

const getNISNodes = (network: 'mainnet' | 'testnet' = 'testnet'): string[] => {
    return networks[network].nisNodes;
};

const getDefaultNetworkType = (): NetworkType => {
    return defaultNetworkType;
};

const getNodes = (network: 'mainnet' | 'testnet' = 'testnet'): string[] => {
    return networks[network].nodes;
};

const getNativeMosaicId = (): string[] => {
    return nativeMosaicId;
};

const getWhitelistedPublicKeys = (network: 'mainnnet' | 'testnet' = 'testnet'): string[] => {
    return optInWhiteList[network];
};

const getFinanceBotPublicKeys = (network: 'mainnnet' | 'testnet' = 'testnet'): string[] => {
    return nglFinanceBot[network];
};

export {
    getSessionTimeoutInMillis,
    getMarketCurrencyLabel,
    getNewsURL,
    getExplorerURL,
    getFaucetUrl,
    getAboutURL,
    getCurrencyList,
    getDefaultCurrency,
    getCurrencyValue,
    getLanguageList,
    getDefaultLanguage,
    getLanguageValue,
    getValidSyncIntervals,
    getDefaultSyncInterval,
    getSyncIntervalValue,
    getAvailableNodeTypes,
    getDefaultNodeType,
    getNodeTypeValue,
    isCustomNode,
    getNetworkInfo,
    getOptinEnv,
    getNISNodes,
    getDefaultNetworkType,
    getNodes,
    getNativeMosaicId,
    getWhitelistedPublicKeys,
    getFinanceBotPublicKeys,
};
