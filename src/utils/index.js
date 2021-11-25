// import Clipboard from '@react-native-community/clipboard';
import { Clipboard } from 'react-native'; // Remove after fix https://github.com/react-native-clipboard/clipboard/issues/71

export const getDropdownListFromObjct = obj =>
    Object.keys(obj).map(el => ({
        value: el,
        label: obj[el],
    }));

export const pasteFromClipboard = async () => {
    try {
        const text = await Clipboard.getString();
        return text;
    } catch (e) {
        return '';
    }
};

export const copyToClipboard = (str: string) => {
    Clipboard.setString(str);
};

export const htmlToPlainString = (str: string) => {
    let formattedString = '';

    if (str === null || str === '') return '';

    formattedString = str
        .toString()
        .replace(/&#([0-9]{1,4});/gi, (match, numStr) => {
            const num = parseInt(numStr, 10);
            return String.fromCharCode(num);
        })
        .replace(/(<([^>]+)>)/gi, '');

    return formattedString;
};

export const removeRSSContentEnd = (str: string) => {
    const indexOfDots = str.indexOf('...');
    const lastChar = indexOfDots !== -1 ? indexOfDots : str.length;
    return str.slice(0, lastChar) + '...';
};
