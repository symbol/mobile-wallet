import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Clipboard } from 'react-native';
import { Input, Icon } from '@src/components';
import PasswordModal from '@src/components/molecules/PasswordModal';
import { Router } from '@src/Router';
import { ContactQR, AddressQR, AccountQR } from 'symbol-qr-library';
import { connect } from 'react-redux';
import { Dropdown } from '@src/components';
import {PublicAccount} from "symbol-sdk";
import NetworkService from "@src/services/NetworkService";
import translate from "@src/locales/i18n";

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
    },
    fullWidth: {
        width: '100%',
    },
    icon: {
        position: 'absolute',
        height: 45,
        justifyContent: 'center',
		alignItems: 'center'
    },
});

type Theme = 'light' | 'dark';

interface Props {
    componentId: number;
    fullWidth: boolean;
    theme: Theme;
}

type State = {};
let addressBookList = [];

class InputAccount extends Component<Props, State> {
	state = {
		password: '',
		showPasswordModal: false,
		pkQRData: null
	}

	componentDidMount = () => {
		this.setState({ pkQRData: null });
	};

    importWithAddressBook = address => {
        setTimeout(() => {
            if (typeof this.props.onChangeText === 'function') this.props.onChangeText(address);
        }, 1000);
    };

    onReadQRCode = res => {
        try {
            const contactQR = ContactQR.fromJSON(res.data);
            const { network } = this.props;
            const networkType = NetworkService.getNetworkTypeFromModel(network);
            this.props.onChangeText(PublicAccount.createFromPublicKey(contactQR.accountPublicKey, networkType).address.pretty());
            return;
        } catch (e) {
            console.log(e);
        }
        try {
            const addressQR = AddressQR.fromJSON(res.data);
            this.props.onChangeText(addressQR.accountAddress);
        } catch (e) {
			console.log(e);
			this.props.onChangeText('');
			Router.showMessage({
                message: translate('unsortedKeys.invalidAddressQR'),
                type: 'danger'
			});
        }
	};
	
	onReadPkQRCode = res => {
		this.setState({pkQRData: res.data});
		setTimeout(() => { this.encryptPkQRCode(null);});
	};

	encryptPkQRCode = (password) => {
        const { pkQRData } = this.state;
        
        try {
            const accountQR = AccountQR.fromJSON(pkQRData, password);
			this.props.onChangeText(accountQR.accountPrivateKey);
			this.setState({ pkQRData: null });
        } catch (e) {
			console.log(e);
			if(e.message === 'Could not parse account information.' && typeof password !== 'string') {
				this.props.onChangeText('');
				this.setState({showPasswordModal: true});
			}	
			else
			if(e.message === 'Could not parse account information.'){
				this.props.onChangeText('');
				Router.showMessage({
                    message: translate('unsortedKeys.invalidPassword'),
                    type: 'danger'
				});
				this.setState({ pkQRData: null });
			}
			else {
				this.props.onChangeText('');
				Router.showMessage({
                    message: translate('unsortedKeys.invalidPrivateKeyQR'),
                    type: 'danger'
				});	
				this.setState({ pkQRData: null });
			}
		}
	};

	onSetPassword = (password) => {
		this.setState({ showPasswordModal: false});
		this.encryptPkQRCode(password);
	};

    importWithQR = (callback) => {
        Router.scanQRCode(callback, () => {this.setState({ pkQRData: null });});
    };

    importWithClipboard = async () => {
        if (typeof this.props.onChangeText === 'function') {
            const clip = await Clipboard.getString();
            this.props.onChangeText(clip);
        }
    };

    getIconPosition = (index, k, offset, isBottomOffset) => {
        return {
            right: index * k + offset,
			width: k,
            bottom: isBottomOffset ? 22 : 0
        };
    };

    getInputStyle = (numberOfIcons, k, offset) => {
        return {
            paddingRight: numberOfIcons * k + offset,
        };
    };

    render = () => {
        const { style = {}, fullWidth, errorMessage, showAddressBook = true, showQR = true, qrType = 'address', ...rest } = this.props;
		const { showPasswordModal } = this.state;

		let rootStyle = [styles.root, style];
        const iconSize = 'small';
        const iconTouchableWidth = 30;
        const iconOffset = 8;
        const numberOfIcons = 2;
        const { addressBook } = this.props;
        addressBookList = [];
        addressBook.getAllContacts().map(item => {
            addressBookList.push({ value: item.address, label: item.name + ': ' + item.address.slice(0, 9) + '...' });
        });
		if (fullWidth) rootStyle.push(styles.fullWidth);
		
		let qrCallback = this.onReadQRCode;
		if(qrType === 'privateKey')
			qrCallback = this.onReadPkQRCode;

        return (
            <View style={rootStyle}>
                <Input {...rest} errorMessage={errorMessage} fullWidth={fullWidth} inputStyle={this.getInputStyle(numberOfIcons, iconTouchableWidth, iconOffset)} />
                {/* <TouchableOpacity
					style={[styles.icon, this.getIconPosition(2, iconTouchableWidth, iconOffset, !!errorMessage)]}
					onPress={() => this.importWithAddressBook()}
				>
					<Icon name="paste" size={iconSize} />
				</TouchableOpacity> */}
                {showQR && <TouchableOpacity
                    style={[styles.icon, this.getIconPosition(showAddressBook ? 1 : 0, iconTouchableWidth, iconOffset, !!errorMessage)]}
                    onPress={() => this.importWithQR(qrCallback)}>
                    <Icon name="qr" size={iconSize} />
                </TouchableOpacity>}
                {showAddressBook && (
                    <Dropdown
                        title="Select Contact"
                        editable={true}
                        style={[styles.icon, this.getIconPosition(0, iconTouchableWidth, iconOffset, !!errorMessage)]}
                        list={addressBookList}
                        onChange={address => this.importWithAddressBook(address)}>
                        <Icon name="address_book" size={iconSize} />
                    </Dropdown>
                )}
				<PasswordModal
					showModal={showPasswordModal}
					title={'Decrypt QR'}
					onSubmit={this.onSetPassword}
					onClose={() => this.setState({ showPasswordModal: false })}
				/>  
            </View>
        );
    };
}

export default connect(state => ({
    network: state.network.selectedNetwork,
    addressBook: state.addressBook.addressBook,
}))(InputAccount);
