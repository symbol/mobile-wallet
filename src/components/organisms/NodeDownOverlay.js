/**
 * @format
 * @flow
 */
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@src/components';

class NodeDownOverlay extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text align="center">Node is down</Text>
                <Text align="center" style={{ fontSize: 9 }}>Select a different node on settings page</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#aa0000',
        position: 'absolute',
        bottom: 0,
        height: 60,
        width: '100%',
        padding: 12,
    },
});

export default NodeDownOverlay;
