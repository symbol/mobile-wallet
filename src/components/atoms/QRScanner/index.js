/**
 * @format
 * @flow
 */
import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

import styles from './qrscanner.styl';
import translate from '@src/locales/i18n';

export default class ScanQR extends Component {
    bottomView = () => {
        return (
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.bottomContainerStyle}>
                    <Text style={styles.bottomContainerColor}>
                        {/* Click me to turn on/off the flashlight */}
                        {translate('QRScanner.alert')}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    topView = () => {
        const { closeFn } = this.props;
        return (
            <View style={styles.bottomContainer}>
                <TouchableOpacity onPress={closeFn} style={styles.topContainerStyle}>
                    <Image style={styles.closeIcon} source={require('@src/assets/icons/close_dark.png')} />
                </TouchableOpacity>
            </View>
        );
    };

    render = () => {
        const { onDataHandler } = this.props;
        return (
            <View style={styles.contentContainer}>
                <QRCodeScanner
                    fadeIn={true}
                    onRead={onDataHandler}
                    bottomContent={this.bottomView()}
                    topContent={this.topView()}
                    hintText=""
                    checkAndroid6Permissions
                    showMarker
                />
            </View>
        );
    };
}
