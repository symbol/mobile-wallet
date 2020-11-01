import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { 
	Section, 
	GradientBackground,
	TitleBar,
	Input,
	InputAddress,
	Button,
	Dropdown,
	MosaicDropdown
} from '@src/components';
import ConfirmTransaction from '@src/screens/ConfirmTransaction';
import translate from '@src/locales/i18n';
import Store from '@src/store';
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

class Send extends Component<Props, State> {
	state = {
		recipientAddress: '',
		mosaicName: '',
		amount: '0',
		message: '',
		isEncrypted: false,
		fee: 0.5,
		isConfirmShown: false
	};

	componentDidMount = () => {
		Store.dispatchAction({type: 'transfer/clear'});
		Store.dispatchAction({type: 'mosaic/loadOwnedMosaics'});
	};

    submit = () => {
        Store.dispatchAction({
            type: 'transfer/setTransaction',
            payload: {
                recipientAddress: this.state.recipientAddress,
                mosaicNamespaceName: this.state.mosaicName,
                amount: this.state.amount,
                message: this.state.message,
                isEncrypted: this.state.isEncrypted,
                fee: this.state.fee,
            },
        });
        this.setState({
            isConfirmShown: true,
        });
        // Router.goToConfirmTransaction({
        // 	isLoading: this.props.isLoading,
        // 	isError: this.props.isError,
        // 	isSuccessfullySent: this.props.isSuccessfullySent,
        // 	transaction: this.props.transaction,
        // }, this.props.componentId);
    };

    showSendForm = () => {
        this.setState({
            isConfirmShown: false,
        });
    };

    renderConfirmTransaction = () => {
        return (
            <ConfirmTransaction
                isLoading={this.props.isLoading}
                isError={this.props.isError}
                isSuccessfullySent={this.props.isSuccessfullySent}
                transaction={this.props.transaction}
                submitActionName="transfer/broadcastTransaction"
                onBack={() => this.showSendForm()}
            />
        );
    };

    render = () => {
		const { 
			ownedMosaics,
			isOwnedMosaicsLoading
		 } = this.props;
		const {
			recipientAddress,
			mosaicName,
			amount,
			message,
			isEncrypted,
			fee,
			isConfirmShown
		} = this.state;

		const mosaicList = ownedMosaics.map(mosaic => ({
			value: mosaic.mosaicId,
			label: mosaic.mosaicName,
			balance: mosaic.amount
		}))

        const feeList = [
            { value: 0.1, label: '0.1 XEM - slow' },
            { value: 0.5, label: '0.5 XEM - normal' },
            { value: 1, label: '1 XEM - fast' },
        ];

		return (isConfirmShown
			? this.renderConfirmTransaction()
			: (<GradientBackground name="mesh_small_2" theme="light">
				<TitleBar
					theme="light"
					onBack={()=>Router.goBack(this.props.componentId)}
					title="Send"
				/>
					<Section type="form" style={styles.list} isScrollable>
						<Section type="form-item">
							<InputAddress 
								value={recipientAddress}
								placeholder="Recipient Address"
								theme="light"
								fullWidth
								onChangeText={recipientAddress => this.setState({recipientAddress})}
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
								onChange={mosaicName => this.setState({mosaicName})}
							/>
						</Section>
						<Section type="form-item">
							<Input 
								value={amount}
								placeholder="Amount"
								theme="light"
								onChangeText={amount => this.setState({amount})}
							/>
						</Section>
						<Section type="form-item">
							<Input 
								value={message}
								placeholder="Message / Memo"
								theme="light"
								onChangeText={message => this.setState({message})}
							/>
						</Section>
						<Section type="form-item">
							<Dropdown 
								value={fee}
								title="Fee"
								theme="light"
								editable={true}
								list={feeList}
								onChange={fee => this.setState({fee})}
							/>
						</Section>
						<Section type="form-bottom">
							<Button
								isLoading={false}
								isDisabled={false}
								text="Send"
								theme="light"
								onPress={() => this.submit()}
							/>
						</Section>
					</Section>
			</GradientBackground>)
		);
    };
}

export default connect(state => ({
	isLoading: state.transfer.isLoading,
	isError: state.transfer.isError,
	isSuccessfullySent: state.transfer.isSuccessfullySent,
	transaction: state.transfer.transaction,
	ownedMosaics: state.mosaic.ownedMosaics,
	isOwnedMosaicsLoading: state.mosaic.isLoading,
}))(Send);
