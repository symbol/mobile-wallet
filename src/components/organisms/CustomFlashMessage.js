/**
 * @format
 * @flow
 */
import React, { Component } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { Router } from '@src/Router';

class CustomFlashMessage extends Component<Props> {
    componentDidMount = () => {
        const { componentId } = this.props;
        setTimeout(() => Router.closeOverlay(componentId), 2400);
    };

    render() {
        return (
            <View style={styles.container}>
				<FlashMessage 
					position="top" 
					animationDuration={200}
					floating={true}
					position={{top: StatusBar.currentHeight}}
				/>
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
