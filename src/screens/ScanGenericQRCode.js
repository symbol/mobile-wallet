/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import QRScanner from '@src/components/atoms/QRScanner';
import { Router } from '@src/Router';
import { BackHandler } from 'react-native';

class ScanGenericQRCode extends Component<Props> {
    backHwHandler: any;
    backHandler: any;

    componentWillUnmount() {
        this.backHandler && this.backHandler.remove();
        this.backHwHandler && this.backHwHandler.remove();
    }

    componentDidMount() {
        this.backHwHandler = BackHandler.addEventListener('hardwareBackPress', () => this.onClose(false));
        this.backHandler = BackHandler.addEventListener('backPress', () => this.onClose(false));
    }

    onClose = (callCallback = true) => {
        const { onClose } = this.props;
        Router.closeOverlay(this.props.componentId);
        callCallback && onClose();
    };

    onRead = res => {
        const { onRead } = this.props;
        Router.closeOverlay(this.props.componentId);
        onRead(res);
    };

    render() {
        return <QRScanner onDataHandler={this.onRead} closeFn={this.onClose} />;
    }
}

export default ScanGenericQRCode;
