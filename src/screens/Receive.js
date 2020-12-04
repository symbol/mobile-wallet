import React, { Component } from 'react';
import {Image, StyleSheet} from 'react-native';
import { 
	Section, 
	GradientBackground, 
	TitleBar, 
	Input, 
	InputAddress, 
	CopyView,
	QRImage
} from '@src/components';
import { Router } from '@src/Router';
import { connect } from 'react-redux';
import { SvgXml } from 'react-native-svg';
import TransactionService from '@src/services/TransactionService';

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
	};
	
	qrImageRef = {};

    componentDidMount() {
        this.updateImgQR();
    }

    handleRecipientAddressChange = recipientAddress => {
        this.setState({ recipientAddress });
        this.updateImgQR();
    };

    handleAmountChange = amount => {
        this.setState({ amount });
        this.updateImgQR();
    };

    handleMessageChange = message => {
        this.setState({ message });
        this.updateImgQR();
    };

    updateImgQR = async () => {
		if(typeof this.qrImageRef.updateQR === 'function')
        	this.qrImageRef.updateQR();
    };

    render = () => {
        const { recipientAddress, amount, message } = this.state;

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
							/>
						</Section>
					</Section>
                    <Section type="form-item">
						<CopyView theme="light" placeholder="Address" fullWidth>{recipientAddress}</CopyView>
                        {/* <InputAddress
                            value={recipientAddress}
                            placeholder="Recipient Address"
                            theme="light"
                            fullWidth
                            onChangeText={this.handleRecipientAddressChange}
                        /> */}
                    </Section>
                    <Section type="form-item">
                        <Input value={amount} placeholder="Amount" theme="light" onChangeText={this.handleAmountChange} />
                    </Section>
                    <Section type="form-item">
                        <Input value={message} placeholder="Message / Memo" theme="light" onChangeText={this.handleMessageChange} />
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
