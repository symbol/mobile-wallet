import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Section, GradientBackground, TitleBar, Input, InputAddress } from '@src/components';
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
        const { network } = this.props;
        const { recipientAddress, message } = this.state;
        try {
            const imgData = await TransactionService.getReceiveSvgQRData(recipientAddress, network, message);
            this.setState({ imgData });
        } catch (e) {
            this.setState({ imgData: null });
        }
    };

    render = () => {
        const { recipientAddress, amount, message, imgData } = this.state;

        return (
            <GradientBackground name="mesh_small_2" theme="light">
                <TitleBar theme="light" onBack={() => Router.goBack(this.props.componentId)} title="Receive" />
                <Section type="form" style={styles.list} isScrollable>
                    <Section type="form-item">
                        <InputAddress
                            value={recipientAddress}
                            placeholder="Recipient Address"
                            theme="light"
                            fullWidth
                            onChangeText={this.handleRecipientAddressChange}
                        />
                    </Section>
                    <Section type="form-item">
                        <Input value={amount} placeholder="Amount" theme="light" onChangeText={this.handleAmountChange} />
                    </Section>
                    <Section type="form-item">
                        <Input value={message} placeholder="Message / Memo" theme="light" onChangeText={this.handleMessageChange} />
                    </Section>
                    {imgData && <SvgXml style={styles.qr} xml={imgData} width="240px" height="240px" />}
                </Section>
            </GradientBackground>
        );
    };
}

export default connect(state => ({
    currentAddress: state.account.selectedAccountAddress,
    network: state.network.selectedNetwork,
}))(Receive);
