/**
 * @format
 * @flow
 */
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Router } from '@src/Router';

class CustomFlashMessage extends Component<Props> {
    componentDidMount = () => {
        const { componentId } = this.props;
        setTimeout(() => Router.closeOverlay(componentId), 2400);
    };

    render() {
        return (
            <View style={styles.container}>
                <FlashMessage animationDuration={200} floating={true} position={{ top: getStatusBarHeight() }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 70,
        width: '100%',
    },
});

export default CustomFlashMessage;
