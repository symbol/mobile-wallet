import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Clipboard } from 'react-native';
import { Input, Icon } from '@src/components';
import { Router } from '@src/Router';
import { ContactQR } from 'symbol-qr-library';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
    },
    fullWidth: {
        width: '100%',
    },
    icon: {
        position: 'absolute',
        bottom: 0,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

type Theme = 'light' | 'dark';

interface Props {
    componentId: number;
    fullWidth: boolean;
    theme: Theme;
}

type State = {};

class InputAccount extends Component<Props, State> {
    importWithAddressBook = () => {
        setTimeout(() => {
            if (typeof this.props.onChangeText === 'function') this.props.onChangeText('This is from AddressBook');
        }, 1000);
    };

    onReadQRCode = res => {
        try {
            const contactQR = ContactQR.fromJSON(res.data);
            this.props.onChangeText(contactQR.accountPublicKey.address.address);
        } catch (e) {
            console.log(e);
            this.props.onChangeText('Invalid QR');
        }
    };

    importWithQR = () => {
        Router.scanQRCode(this.onReadQRCode, () => {});
    };

    importWithClipboard = async () => {
        if (typeof this.props.onChangeText === 'function') {
            const clip = await Clipboard.getString();
            this.props.onChangeText(clip);
        }
    };

    getIconPosition = (index, k, offset) => {
        return {
            right: index * k + offset,
            width: k,
        };
    };

    getInputStyle = (numberOfIcons, k, offset) => {
        return {
            paddingRight: numberOfIcons * k + offset,
        };
    };

    render = () => {
        const { style = {}, fullWidth, ...rest } = this.props;
        let rootStyle = [styles.root, style];
        const iconSize = 'small';
        const iconTouchableWidth = 30;
        const iconOffset = 8;
        const numberOfIcons = 2;

        if (fullWidth) rootStyle.push(styles.fullWidth);

        return (
            <View style={rootStyle}>
                <Input {...rest} fullWidth={fullWidth} inputStyle={this.getInputStyle(numberOfIcons, iconTouchableWidth, iconOffset)} />
                {/* <TouchableOpacity
					style={[styles.icon, this.getIconPosition(2, iconTouchableWidth, iconOffset)]}
					onPress={() => this.importWithAddressBook()}
				>
					<Icon name="paste" size={iconSize} />
				</TouchableOpacity> */}
                <TouchableOpacity style={[styles.icon, this.getIconPosition(1, iconTouchableWidth, iconOffset)]} onPress={() => this.importWithQR()}>
                    <Icon name="qr" size={iconSize} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.icon, this.getIconPosition(0, iconTouchableWidth, iconOffset)]} onPress={() => this.importWithClipboard()}>
                    <Icon name="paste" size={iconSize} />
                </TouchableOpacity>
            </View>
        );
    };
}

export default connect(state => ({
    network: state.network.selectedNetwork,
}))(InputAccount);
