import React, { Component } from 'react';
import {Image, StyleSheet} from 'react-native';
import { 
	Section, 
	GradientBackground, 
	TitleBar, 
	Input,  
	CopyView,
	Button,
	QRImage
} from '@src/components';
import { Router } from '@src/Router';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
    transactionPreview: {
        width: '100%',
        height: 60,
        borderRadius: 6,
        marginTop: 4,
        marginBottom: 4,
        padding: 17,
        paddingTop: 8,
        backgroundColor: '#fff5',
    },
});

type Props = {};

type State = {};

class Receive extends Component<Props, State> {
    state = {
        recipientAddress: this.props.currentAddress,
        amount: '0',
        message: '',
		imgData: null,
		isQrVisible: true,
		isLoading: false
	};
	
	qrImageRef = {};

    componentDidMount() {
        this.updateImgQR();
    }

    handleRecipientAddressChange = recipientAddress => {
        this.setState({ recipientAddress, isQrVisible: false  });
    };

    handleAmountChange = amount => {
        this.setState({ amount, isQrVisible: false  });
    };

    handleMessageChange = message => {
		this.setState({ message, isQrVisible: false  });
    };

    updateImgQR = async () => {
		if(typeof this.qrImageRef.updateQR === 'function') {
			this.setState({ isQrVisible: true, isLoading: true });
			this.qrImageRef.updateQR();
		}	
    };

    render = () => {
		const { recipientAddress, amount, message, isQrVisible, isLoading } = this.state;
		
		const onQrReady = () => {
			this.setState({ isQrVisible: true, isLoading: false });
		};

        return (
            <GradientBackground name="mesh_small_2" theme="light">
                <TitleBar theme="light" onBack={() => Router.goBack(this.props.componentId)} title="Receive" />
                <Section type="form" style={styles.list} isScrollable>
					<Section type="form-item">
						<Section type="center">
							<QRImage
								childRef={r => this.qrImageRef = r} 
								type="transaction" 
								recipientAddress={recipientAddress}
								amount={amount}
								message={message}
								isQrVisible={isQrVisible}
								onReady={() => onQrReady()}
							/>
						</Section>
					</Section>
                    <Section type="form-item">
						<CopyView theme="light" placeholder="Address" fullWidth>{recipientAddress}</CopyView>
                    </Section>
                    <Section type="form-item">
                        <Input value={amount} placeholder="Amount" theme="light" onChangeText={this.handleAmountChange} />
                    </Section>
                    <Section type="form-item">
                        <Input value={message} placeholder="Message / Memo" theme="light" onChangeText={this.handleMessageChange} />
                    </Section>
					<Section type="form-item">
                        <Button text="Create QR" isLoading={isLoading} theme="light" onPress={() => this.updateImgQR()} />
                    </Section>
                </Section>
            </GradientBackground>
        );
    };
}

export default connect(state => ({
    currentAddress: state.account.selectedAccountAddress,
    network: state.network.selectedNetwork,
}))(Receive);
