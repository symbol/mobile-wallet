import React from 'react';

import { Alert, View } from 'react-native';

type Action = {
    text: string,
    onPress: () => void,
};

type Props = {
    title: string,
    message: string,
    actions: Action[],
};

export default function BasicAlert(props: Props) {
    const { title, message, actions } = props;
    return <View>{Alert.alert(title, message, actions, { cancelable: true })}</View>;
}
