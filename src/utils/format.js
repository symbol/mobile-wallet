import { LocalDateTime } from 'js-joda';
import translate from '@src/locales/i18n';
import type { AppNetworkType } from '@src/storage/models/NetworkModel';

export const formatTransactionLocalDateTime = (dt: LocalDateTime): string => {
    return `${dt.dayOfMonth()}/${dt.monthValue()}/${dt.year()}`;
};

export const formatDate = (date: LocalDateTime): string => {
    const days = [
        translate('date.sunday'),
        translate('date.monday'),
        translate('date.tuesday'),
        translate('date.wednesday'),
        translate('date.thursday'),
        translate('date.friday'),
        translate('date.saturday'),
    ];

    const dateObj = new Date(date);
    return `${days[dateObj.getDay()].slice(0, 3)}, ${pad(dateObj.getDate(), 2)}/${pad(dateObj.getMonth() + 1, 2)}/${dateObj.getFullYear()}`;
};

export const pad = (num, size) => {
    num = num.toString();
    while (num.length < size) num = '0' + num;
    return num;
};

export const durationStringToSeconds = (str: string): number => {
    return Math.floor(durationStringToMilliseconds(str) / 1000);
};

export const durationStringToMilliseconds = (value: string): number => {
    let str = value;
    let total = 0;
    const milliSeconds = str.match(/(\d+)\s*ms/);
    if (milliSeconds) {
        str = str.replace(milliSeconds[0], '');
        total += parseInt(milliSeconds[1]);
    }
    const days = str.match(/(\d+)\s*d/);
    if (days) {
        str = str.replace(days[0], '');
        total += parseInt(days[1]) * 24 * 60 * 60 * 1000;
    }
    const hours = str.match(/(\d+)\s*h/);
    if (hours) {
        str = str.replace(hours[0], '');
        total += parseInt(hours[1]) * 60 * 60 * 1000;
    }
    const minutes = str.match(/(\d+)\s*m/);
    if (minutes) {
        str = str.replace(minutes[0], '');
        total += parseInt(minutes[1]) * 60 * 1000;
    }
    const seconds = str.match(/(\d+)\s*s/);
    if (seconds) {
        str = str.replace(seconds[0], '');
        total += parseInt(seconds[1]) * 1000;
    }
    return total;
};

export const formatSeconds = (second: number): string => {
    if (!second && second !== 0) {
        return '';
    }
    let d = 0,
        h = 0,
        m = 0;

    if (second > 86400) {
        d = Math.floor(second / 86400);
        second = second % 86400;
    }
    if (second > 3600) {
        h = Math.floor(second / 3600);
        second = second % 3600;
    }
    if (second > 60) {
        m = Math.floor(second / 60);
        second = second % 60;
    }
    let result = '';
    // seconds less than 60s
    if (second > 0 && m == 0 && h == 0 && d == 0) {
        result = `${second} s ${result}`;
    }
    if (m > 0 || h > 0 || d > 0) {
        result = `${m} m ${result}`;
    }
    if (h > 0 || d > 0) {
        result = `${h} h ${result}`;
    }
    if (d > 0) {
        result = `${d} d ${result}`;
    }

    return result;
};

export const durationToRelativeTime = (durationInBlocks: number, blockGenerationTargetTime: number): string => {
    try {
        const isDurationNegative = durationInBlocks < 0;
        const absoluteDuration = isDurationNegative ? durationInBlocks * -1 : durationInBlocks;
        const relativeTime = formatSeconds(absoluteDuration * blockGenerationTargetTime);
        const prefix = isDurationNegative ? '- ' : '';
        return `${prefix}${relativeTime}`;
    } catch (error) {
        console.error('durationToRelativeTime -> error', error);
        return '';
    }
};

export const shortifyAddress = (address: string): string => {
    return `${address.slice(0, 6)}-...-${address.slice(42)}`;
};

export const getAccountIndexFromDerivationPath = (path: string, network: AppNetworkType): number => {
    const startPath = network === 'testnet' ? "m/44'/1'/" : "m/44'/4343'/";
    const endPath = "'/0'/0'";
    return path ? parseInt(path.replace(startPath, '').replace(endPath, '')) : null;
};

export const resoveAmount = (rawAmount, divisibility) => {
    return rawAmount / Math.pow(10, divisibility);
};
