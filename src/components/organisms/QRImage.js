import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Section, Text, Row, Col } from '@src/components';
import { Router } from '@src/Router';
import { connect } from 'react-redux';
import { ContactQR, AddressQR, AccountQR } from 'symbol-qr-library';
import GlobalStyles from '@src/styles/GlobalStyles';

const styles = StyleSheet.create({
    root: {
		backgroundColor: GlobalStyles.color.WHITE,
		padding: 8,
		minHeight: 158,
		minWidth: 136
	},
	qr: {
        width: 120,
        height: 120,
    }
});

type Props = {};

type State = {};

class QRImage extends Component<Props, State> {
	state = {
		isLoading: false,
		image: null,
		title: ''
	};

	componentDidMount = async () => {
		const { 
			networkType,
			generationHash,
			accountName = 'Account',
			address,
			privateKey,
			transaction,
			type = 'address'
		} = this.props;

		let image;
		let title;

		this.setState({isLoading: true});

		switch(type) {
			case 'address':
				image = await this.getAddressQR(accountName, address, networkType, generationHash);
				title = 'Address';
				break;
			case 'transaction':
				// TODO
				break;
			case 'mnemonic':
				// TODO
				break;
		};

		this.setState({
			image,
			title,
			isLoading: false
		});
	};
	
	getAddressQR = async (accountName, address, networkType, generationHash) => {
		try {
			const addressQR = new AddressQR(accountName, address, networkType, generationHash);
			return addressQR.toBase64().toPromise();
		}
		catch(e) { console.error(e); };
	};

	getPrivateKeyQR = async (privateKey, password, networkType, generationHash) => {
		try {
			const privateKeyQR = new AccountQR(privateKey, password, networkType, generationHash);
			return privateKeyQR.toBase64().toPromise();
		}
		catch(e) { console.error(e); };
	};
	
    render = () => {
        const { style = {} } = this.props;
		const { 
			isLoading, 
			image, 
			title,
		} = this.state;
		
        return (
			<Col justify="center" alighn="center" style={[styles.root, style]}>
				{image && <Image style={styles.qr} source={{ uri: image }} />}
				<Text theme="light" type="bold" align="center">{title.toUpperCase()}</Text>
			</Col>       
        );
    };
}

export default connect(state => ({
	networkType: state.network.selectedNetwork.type,
	generationHash: state.network.generationHash,
}))(QRImage);
