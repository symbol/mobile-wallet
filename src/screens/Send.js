import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { 
	Section, 
	GradientBackground,
	TitleBar,
	Input,
	Button
} from '@src/components';
import translate from "@src/locales/i18n";
import { Router } from "@src/Router";
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
		backgroundColor: '#fff5'
	},
});

type Props = {};

type State = {};


class Send extends Component<Props, State> {
	state = {
		recipientAddress: '',
		mosaicNamespaceName: 'Symbol.XYM',
		amount: '0',
		message: '',
		isEncrypted: false,
		fee: '0.5'
	};

    render = () => {
		const {} = this.props;
		const {
			recipientAddress,
			mosaicNamespaceName,
			amount,
			message,
			isEncrypted,
			fee
		} = this.state;

        return (
			<GradientBackground name="connector_small" theme="light">
				<TitleBar
					theme="light"
					onBack={()=>Router.goBack(this.props.componentId)}
					title="Send"
				/>
					<Section type="form" style={styles.list} isScrollable>
						<Section type="form-item">
							<Input 
								value={recipientAddress}
								placeholder="Recipient Address"
								theme="light"
								onChangeText={recipientAddress => this.setState({recipientAddress})}
							/>
						</Section>
						<Section type="form-item">
							<Input 
								value={mosaicNamespaceName}
								placeholder="Mosaic"
								theme="light"
								editable={false}
								onChangeText={mosaicNamespaceName => this.setState({mosaicNamespaceName})}
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
							<Input 
								value={fee}
								placeholder="Fee"
								theme="light"
								onChangeText={fee => this.setState({fee})}
							/>
						</Section>
						<Section type="form-bottom">
							<Button
								isLoading={false}
								isDisabled={false}
								text="Send"
								theme="light"
								onPress={() => console.log('button click')}
							/>
						</Section>
					</Section>
			</GradientBackground>
        );
    };
}

export default connect(() => ({

}))(Send);