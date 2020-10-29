/**
 * @format
 * @flow
 */

import React from 'react';

import { View, Alert } from 'react-native';
import translate from "@src/locales/i18n";

type Props = {
  onIgnore: () => void,
  hideWarning: () => void,
  message: string,
  okButtonText: string,
};

const Warning = (props: Props) => {
  const { onIgnore, message, okButtonText, hideWarning } = props;
  const invalidAlert = () => {
    Alert.alert(
      translate('Shared.Warning.warning'),
      message,
      [
        {
          text: okButtonText,
          onPress: () => onIgnore(),
        },
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
