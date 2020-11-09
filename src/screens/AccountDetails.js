import React, { Component } from 'react';
import { Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { Section, GradientBackground, TitleBar, Input, Text, TableView } from '@src/components';
import { Router } from '@src/Router';
import { connect } from 'react-redux';
import { getExplorerURL } from '@src/config/environment';
import GlobalStyles from '@src/styles/GlobalStyles';

const styles = StyleSheet.create({
	textButton: {
		color: GlobalStyles.color.PRIMARY
	}
});

type Props = {};

type State = {};

class AccountDetails extends Component<Props, State> {
    openExplorer() {
        const { address } = this.props;
        Linking.openURL(`${getExplorerURL()}accounts/${address.replace(/-/g, '')}`);
    }

    render = () => {
		const { accountName, address, publicKey, privateKey, balance } = this.props;
		const data = {
			accountName,
			address,
			publicKey,
			privateKey,
			balance
		};
		
        return (
            <GradientBackground name="mesh_small_2" theme="light">
                <TitleBar theme="light" onBack={() => Router.goBack(this.props.componentId)} title="Account Details" />
                <Section type="form" style={styles.list} isScrollable>
					<TableView data={data} />
                    <Section type="form-item">
                        <TouchableOpacity onPress={() => this.openExplorer()}>
                            <Text type="bold" theme="light" style={styles.textButton}>
                                Reveal account in the Block Explorer
                            </Text>
                        </TouchableOpacity>
                    </Section>
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
}))(AccountDetails);
