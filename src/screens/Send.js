import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Checkbox, Section, GradientBackground, TitleBar, Input, InputAddress, Button, Dropdown, MosaicDropdown } from '@src/components';
import ConfirmTransaction from '@src/screens/ConfirmTransaction';
import Store from '@src/store';
import { Router } from '@src/Router';
import { connect } from 'react-redux';
import type { MosaicModel } from '@src/storage/models/MosaicModel';

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

class Send extends Component<Props, State> {
    state = {
        recipientAddress: '',
        mosaicName: this.props.network.currencyMosaicId,
        amount: '0',
        message: '',
        isEncrypted: false,
        fee: 0.5,
        isConfirmShown: false,
    };

    componentDidMount = () => {
        Store.dispatchAction({ type: 'transfer/clear' });
	};
	
	verify = () => {
		if(!this.state.recipientAddress.length) {
			console.error('Alert("Invalid recipient address")');
			return false;
		}
		if(+this.props.ownedMosaics
			.find(mosaic => mosaic.mosaicId === this.state.mosaicName)
			.amount < +this.state.amount
		) {
			console.error('Alert("Invalid amount")');
			return false;
		}
		return true;
	};

    submit = () => {
        const { ownedMosaics } = this.props;
        const mosaic: MosaicModel = ownedMosaics.find(mosaic => mosaic.mosaicId === this.state.mosaicName);
		mosaic.amount = this.state.amount;
		if(this.verify()) {
			Store.dispatchAction({
				type: 'transfer/setTransaction',
				payload: {
					recipientAddress: this.state.recipientAddress,
					mosaics: [mosaic],
					message: this.state.message,
					messageEncrypted: this.state.isEncrypted,
					fee: this.state.fee,
				},
			});
			this.setState({
				isConfirmShown: true,
			});
		}
    };

    showSendForm = () => {
        this.setState({
            isConfirmShown: false,
        });
    };

    renderConfirmTransaction = () => {
        return (
            <ConfirmTransaction
                componentId={this.props.componentId}
                isLoading={this.props.isLoading}
                isError={this.props.isError}
                errorMessage={this.props.errorMessage}
                isSuccessfullySent={this.props.isSuccessfullySent}
                transaction={this.props.transaction}
                submitActionName="transfer/broadcastTransaction"
                onBack={() => this.showSendForm()}
            />
        );
    };

    render = () => {
        const { ownedMosaics, isOwnedMosaicsLoading, network } = this.props;
        const { recipientAddress, mosaicName, amount, message, isEncrypted, fee, isConfirmShown } = this.state;
        const mosaicList = ownedMosaics.map(mosaic => ({
            value: mosaic.mosaicId,
            label: mosaic.mosaicName,
            balance: mosaic.amount / Math.pow(10, mosaic.divisibility),
        }));

        if (mosaicList.length === 0) {
            mosaicList.push({
                value: network.currencyMosaicId,
                label: 'symbol.xym',
                balance: 0,
            });
        }

        const feeList = [
            { value: 0.1, label: '0.1 XEM - slow' },
            { value: 0.5, label: '0.5 XEM - normal' },
            { value: 1, label: '1 XEM - fast' },
        ];

        return isConfirmShown ? (
            this.renderConfirmTransaction()
        ) : (
            <GradientBackground name="mesh_small_2" theme="light">
                <TitleBar theme="light" onBack={() => Router.goBack(this.props.componentId)} title="Send" />
                <Section type="form" style={styles.list} isScrollable>
                    <Section type="form-item">
                        <InputAddress
                            value={recipientAddress}
                            placeholder="Recipient Address"
                            theme="light"
                            fullWidth
                            onChangeText={recipientAddress => this.setState({ recipientAddress })}
                        />
                    </Section>
                    <Section type="form-item">
                        <MosaicDropdown
                            value={mosaicName}
                            title="Mosaic"
                            theme="light"
                            editable={true}
                            isLoading={isOwnedMosaicsLoading}
                            list={mosaicList}
                            onChange={mosaicName => this.setState({ mosaicName })}
                        />
                    </Section>
                    <Section type="form-item">
                        <Input value={amount} placeholder="Amount" theme="light" onChangeText={amount => this.setState({ amount })} />
                    </Section>
                    <Section type="form-item">
                        <Input value={message} placeholder="Message / Memo" theme="light" onChangeText={message => this.setState({ message })} />
                    </Section>
                    <Section type="form-item">
                        <Checkbox value={isEncrypted} title="Encrypted message" theme="light" onChange={isEncrypted => this.setState({ isEncrypted })} />
                    </Section>
                    <Section type="form-item">
                        <Dropdown value={fee} title="Fee" theme="light" editable={true} list={feeList} onChange={fee => this.setState({ fee })} />
                    </Section>
                    <Section type="form-bottom">
                        <Button isLoading={false} isDisabled={false} text="Send" theme="light" onPress={() => this.submit()} />
                    </Section>
                </Section>
            </GradientBackground>
        );
    };
}

export default connect(state => ({
    isLoading: state.transfer.isLoading,
    isError: state.transfer.isError,
    errorMessage: state.transfer.errorMessage,
    isSuccessfullySent: state.transfer.isSuccessfullySent,
    transaction: state.transfer.transaction,
    network: state.network.selectedNetwork,
    ownedMosaics: state.account.ownedMosaics,
    isOwnedMosaicsLoading: state.account.isLoading,
}))(Send);
