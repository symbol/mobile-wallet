import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Section, Text, Row, Col } from '@src/components';
import { Router } from '@src/Router';
import { connect } from 'react-redux';
import { AddressQR } from 'symbol-qr-library';
import GlobalStyles from '@src/styles/GlobalStyles';

const styles = StyleSheet.create({
    textButton: {
        color: GlobalStyles.color.PRIMARY,
	},
	qr: {
        marginTop: 8,
        marginBottom: 8,
        padding: 8,
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

		switch(type) {
			case 'address':
				image = await this.getAddressQR(accountName, address, networkType, generationHash);
				title = 'Address';
				break;
		};

	};
	
	getAddressQR = async (accountName, address, networkType, generationHash) => {
		let image;

		this.setState({isLoading: true});

		try {
			const addressQR = new AddressQR(accountName, address, networkType, generationHash);
			image = await addressQR.toBase64().toPromise();
		}
		catch(e) { console.error(e); };

		this.setState({isLoading: false});

		return image;
	};
	
    render = () => {
        
		const { 
			isLoading, 
			image, 
			title 
		} = this.state;
		
		

        return (
			<View>
				{image && <Image style={styles.qr} source={{ uri: image }} />}
				<Text theme="light" type="bold">{title.toUpperCase()}</Text>
			</View>       
        );
    };
}

export default connect(state => ({
	networkType: state.network.selectedNetwork.type,
	generationHash: state.network.generationHash,
}))(QRImage);
