import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
    main: {
        display: 'flex',
        flexDirection: 'row',
    },
    fullWidth: {
        width: '100%',
    },
    'justify-start': {
        justifyContent: 'flex-start',
    },
    'justify-end': {
        justifyContent: 'flex-end',
    },
    'justify-center': {
        justifyContent: 'center',
    },
    'justify-space-around': {
        justifyContent: 'space-around',
    },
    'justify-space-between': {
        justifyContent: 'space-between',
    },
    'justify-space-evenly': {
        justifyContent: 'space-evenly',
    },
    'align-start': {
        alignItems: 'flex-start',
    },
    'align-center': {
        alignItems: 'center',
    },
    'align-end': {
        alignItems: 'flex-end',
    },
    wrap: {
        flexWrap: 'wrap',
    },
});

type Justify = 'start' | 'end' | 'center' | 'space-around' | 'space-between';

type Align = 'start' | 'center' | 'end';

interface Props {
    justify: Justify;
    align: Align;
    wrap: boolean;
    fullWidth: boolean;
}

type State = {};

export default class Row extends Component<Props, State> {
    render() {
        const {
            children,
            style = {},
            justify,
            align,
            wrap,
            fullWidth,
        } = this.props;
        const stylesArray = [styles.main];

        if (typeof justify === 'string')
            stylesArray.push(styles['justify-' + justify]);
        if (typeof align === 'string')
            stylesArray.push(styles['align-' + align]);
        if (wrap) stylesArray.push(styles.wrap);
        if (fullWidth) stylesArray.push(styles.fullWidth);

        stylesArray.push(style);
        return <View style={stylesArray}>{children}</View>;
    }
}
