import React, { Component } from 'react';
import { 
	StyleSheet, 
	View, 
	Image,
	TouchableOpacity,
	Text as NativeText
} from 'react-native';
import { 
	Section, 
	Text, 
	Row, 
	Col, 
	ManagerHandler 
} from '@src/components';
import { showPasscode } from '@src/utils/passcode';
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
	},
	showButton: {
		width: '80%',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        //borderWidth: 1,
        borderColor: GlobalStyles.color.PRIMARY,
        color: GlobalStyles.color.PRIMARY,
    },
});

type Props = {};

type State = {};

class QRImage extends Component<Props, State> {
	state = {
		isLoading: false,
		image: null,
		title: '',
		isSecretShown: false,
        counter: 10,
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
		let title = '';

		this.setState({isLoading: true});

		switch(type) {
			case 'address':
				image = await this.getAddressQR(accountName, address, networkType, generationHash);
				title = 'Address';
				break;
			case 'transaction':
				title = 'Invoice';
				break;
			case 'mnemonic':
				title = 'Mnemonic';
				break;
			case 'privateKey':
				title = 'Private Key';
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

	onShowClick = () => {
        const { preShowFn } = this.props;
        const callBack = async () => {
            if (preShowFn) await preShowFn();
            this.setState({ isSecretShown: true });
            this.setState({ counter: 10 });

            const timer = setInterval(() => {
                if (this.state.counter === 0) {
                    clearInterval(timer);
                    this.setState({ isSecretShown: false });
                }
                this.setState({ counter: this.state.counter - 1 });
            }, 1000);
        };
        showPasscode(this.props.componentId, callBack);
    };
	
    render = () => {
        const { 
			style = {}, 
			type 
		} = this.props;
		const { 
			isLoading, 
			image, 
			title,
			isSecretShown
		} = this.state;
		
		const QR = (
			<>
				{image && <Image style={styles.qr} source={{ uri: image }} />}
				{!image && <View style={styles.qr} />}
			</>
		);

		const ShowButton = (
			<TouchableOpacity style={styles.qr} onPress={() => this.onShowClick()}>
				<Col justify="center" align="center" fullHeight>
					<Text type="bold" style={styles.showButton} align="center">
						Show
					</Text>
				</Col>
			</TouchableOpacity>
		);

		const Content = type !== 'privateKey' || isSecretShown
			? QR
			: ShowButton;

        return (
			<Col justify="center" alighn="center" style={[styles.root, style]}>
				<ManagerHandler dataManager={{isLoading}} theme="light">
					{ Content }
				</ManagerHandler>
				<Text theme="light" type="bold" align="center">{title.toUpperCase()}</Text>
			</Col>       
        );
    };
}

export default connect(state => ({
	networkType: state.network.selectedNetwork.type,
	generationHash: state.network.generationHash,
}))(QRImage);
