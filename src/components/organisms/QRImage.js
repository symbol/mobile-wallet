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
import PasswordModal from '@src/components/molecules/PasswordModal';
import { showPasscode } from '@src/utils/passcode';
import { Router } from '@src/Router';
import { connect } from 'react-redux';
import NetworkService from '@src/services/NetworkService';
import { ContactQR, AddressQR, AccountQR } from 'symbol-qr-library';
import GlobalStyles from '@src/styles/GlobalStyles';
import TransactionService from '@src/services/TransactionService';


const styles = StyleSheet.create({
    root: {
		backgroundColor: GlobalStyles.color.WHITE,
		padding: 8,
		paddingBottom: 6,
		minHeight: 158,
		minWidth: 136
	},
	qr: {
        width: 120,
        height: 120,
	},
	hiddenQR: {
		backgroundColor: GlobalStyles.color.GREY5
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
	progressBar: {
        width: '100%',
    },
    progressBarInner: {
        height: 2,
        backgroundColor: GlobalStyles.color.GREEN,
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
		showPasswordModal: false
	};

	componentDidMount = () => {
		const { childRef = () => {} } = this.props;
    	childRef(this);
		this.updateQR();
	};

	componentWillUnmount= () => {
		const { childRef = () => {} } = this.props;
    	childRef(undefined);
	};

	onReady = () => {
		if(typeof this.props.onReady === 'function')
			this.props.onReady()
	};

	updateQR = async () => {
		const { 
			networkType,
			generationHash,
			accountName = 'Account',
			address,
			network,
			recipientAddress, 
			message, 
			amount,
			type = 'address'
		} = this.props;

		let image;
		let title = '';

		setTimeout(() => this.setState({image: null, isLoading: true}), 0);

		switch(type) {
			case 'address':
				image = await this.getAddressQR(accountName, address, networkType, generationHash);
				title = 'Address';
				break;
			case 'transaction':
				title = 'Transaction';
				image = await this.getTransactionQR(recipientAddress, amount, network, message);
				break;
			case 'mnemonic':
				title = 'Mnemonic';
				break;
			case 'privateKey':
				title = 'Private Key';
				break;
		};
		setTimeout(() => {
		this.setState({
			image,
			title,
			isLoading: false
		});
		this.onReady();
	}, 1000);
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
			const privateKeyQR = new AccountQR(privateKey, networkType, generationHash, password);
			return privateKeyQR.toBase64().toPromise();
		}
		catch(e) { console.error(e); };
	};

	getTransactionQR = async (recipientAddress, amount, network, message) => {
		try {
			return TransactionService.getReceiveSvgQRData(recipientAddress, amount, network, message);
		}
		catch(e) { console.error(e); };
	};

	onSetPassword = async (password) => {
		const { 
			networkType,
			generationHash,
			privateKey
		} = this.props;
		this.setState({ isLoading: true, showPasswordModal: false, isSecretShown: true });
		this.setState({ counter: 0 });
		setTimeout(async () => {
			const image = await this.getPrivateKeyQR(privateKey, password, networkType, generationHash);
			this.setState({image});
			this.onShowClick();
			this.setState({isLoading: false});
			this.onReady();
		}, 100);
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
			type,
			isQrVisible = true
		} = this.props;
		const { 
			isLoading, 
			image, 
			title,
			isSecretShown,
			counter,
			showPasswordModal
		} = this.state;
		
		const QR = (
			<>
				{!!image && isQrVisible && <Image style={styles.qr} source={{ uri: image }} />}
				{!image && isQrVisible && <View style={styles.qr} />}
				{!isQrVisible && <Col justify="center" align="center" fullHeight style={[styles.qr, styles.hiddenQR]}/>}
			</>
		);

		const ShowButton = (
			<TouchableOpacity style={[styles.qr, { padding: 7 }]} onPress={() => this.setState({ showPasswordModal: true })}>
				<Col justify="center" align="center" fullHeight style={styles.hiddenQR}>
					<Text type="bold" style={styles.showButton} align="center">
						Show
					</Text>
				</Col>
			</TouchableOpacity>
		);

		const Content = type !== 'privateKey' || isSecretShown
			? QR
			: ShowButton;

        return (<>
			<Col justify="center" alighn="center" style={[styles.root, style]}>
				<ManagerHandler dataManager={{isLoading}} theme="light" noLoadingText>
					{ Content }
				</ManagerHandler>
				<Text theme="light" type="bold" align="center">{title.toUpperCase()}</Text>
				<View 
					style={[
						{ width: counter * 10 + '%' }, 
						styles.progressBarInner, 
						!(type === 'privateKey' && isSecretShown) && { opacity: 0 }
					]}
				/>
			</Col>   
			<PasswordModal
				showModal={showPasswordModal}
				title={'Encrypt QR'}
				onSubmit={this.onSetPassword}
				onClose={() => this.setState({ showPasswordModal: false })}
			/>  
        </>);
    };
}

export default connect(state => ({
	network: state.network.selectedNetwork,
	networkType: NetworkService.getNetworkTypeFromModel(state.network.selectedNetwork),
	generationHash: state.network.generationHash,
}))(QRImage);
