import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Section, GradientBackground, TitleBar, LinkFaucet, LinkExplorer, Text, TableView } from '@src/components';
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

class AccountDetails extends Component<Props, State> {
	state = {
        isLoading: false,
        contactQR: null,
	};
	
	componentDidMount = async () => {
		const { 
			networkType,
			generationHash,
			accountName,
			address 
		} = this.props;

		this.setState({isLoading: true});

		try {
			
			const addressQR = new AddressQR(accountName, address, networkType, generationHash);
			const addressQRsvg = await addressQR.toBase64().toPromise();
			this.setState({
				contactQR: addressQRsvg,
			});
		}
		catch(e) {
			console.error(e)
		};

		this.setState({isLoading: false});
	}
	
    render = () => {
        const { accountName, address, publicKey, privateKey, balance, networkType, componentId, isPasscodeSelected } = this.props;
		const { contactQR, isLoading } = this.state;
		const data = {
            accountName,
            address,
            publicKey,
            privateKey,
            balance,
        };
        return (
            <GradientBackground name="mesh_small_2" theme="light" dataManager={{isLoading}}>
                <TitleBar theme="light" onBack={() => Router.goBack(this.props.componentId)} title="Account Details" />
                <Section type="form" style={styles.list} isScrollable>
					<Section type="form-item">
                        <Section type="center">
                            {contactQR && <Image style={styles.qr} source={{ uri: contactQR }} />}
                        </Section>
                    </Section>
                    <TableView componentId={componentId} data={data} />
                    <Section type="form-item">
                        <LinkExplorer type="account" value={this.props.address} />
                    </Section>
                    {networkType === 'testnet' && (
                        <Section type="form-item">
                            <LinkFaucet value={this.props.address} />
                        </Section>
                    )}
                </Section>
            </GradientBackground>
        );
    };
}

export default connect(state => ({
    accountName: state.wallet.selectedAccount.name,
    address: state.account.selectedAccountAddress,
    publicKey: state.wallet.selectedAccount.id,
    privateKey: state.wallet.selectedAccount.privateKey,
    balance: '' + state.account.balance,
	networkType: state.network.selectedNetwork.type,
	generationHash: state.network.generationHash, 
    isPasscodeSelected: state.settings.isPasscodeSelected,
}))(AccountDetails);
