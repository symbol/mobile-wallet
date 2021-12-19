import React, { Component } from 'react';
import { Text } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';

type Type = 'title' | 'title-small' | 'subtitle' | 'alert' | 'bold';

type Align = 'left' | 'center' | 'right';

type Theme = 'light' | 'dark';

interface Props {
    type: Type;
    align: Align;
    theme: Theme;
}

type State = {};

export default class C extends Component<Props, State> {
    render() {
        const { children, type, style = {}, align, theme } = this.props;
        let globalStyle = {};

        switch (type) {
            case 'title':
                globalStyle = { ...GlobalStyles.text.title };
                break;
            case 'subtitle':
                globalStyle = { ...GlobalStyles.text.subtitle };
                break;
            case 'alert':
                globalStyle = { ...GlobalStyles.text.alert };
                break;
            case 'bold':
                globalStyle = { ...GlobalStyles.text.bold };
                break;
            case 'regular':
                globalStyle = { ...GlobalStyles.text.regular };
                break;
            case 'title-small':
                globalStyle = { ...GlobalStyles.text.titleSmall };
                break;
            case 'warning':
                globalStyle = { ...GlobalStyles.text.warning };
                break;
            case 'error':
                globalStyle = { ...GlobalStyles.text.error };
                break;
        }

        if (typeof align === 'string') globalStyle.textAlign = align;

        if (type !== 'warning' && type !== 'error') {
            if (theme === 'light') globalStyle.color = GlobalStyles.color.lightmode.TEXT;
            else globalStyle.color = GlobalStyles.color.darkmode.TEXT;
        }

        return <Text style={[globalStyle, style]}>{children}</Text>;
    }
}
