/**
 * @format
 * @flow
 */

import React from 'react';

import { Alert, View } from 'react-native';
import translate from '@src/locales/i18n';

type Props = {
    hideWarning: () => void,
    message: string,
};

const Warning = (props: Props) => {
    const { message, hideWarning } = props;
    const invalidAlert = () => {
        Alert.alert(
            translate('Shared.Warning.warning'),
            message,
            [
                {
                    text: translate('Shared.Warning.cancelModalButton'),
                    onPress: () => hideWarning(),
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };

    return <View testID="showWarning">{invalidAlert()}</View>;
};

export default Warning;
