/**
 * @format
 * @flow
 */
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';

class CustomFlashMessage extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <FlashMessage position="top" animationDuration={180} />
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
