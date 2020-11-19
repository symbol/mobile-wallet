import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Section, GradientBackground, TitleBar, LinkFaucet, LinkExplorer, Text, TableView } from '@src/components';
import { Router } from '@src/Router';
import { connect } from 'react-redux';
import GlobalStyles from '@src/styles/GlobalStyles';

const styles = StyleSheet.create({
    textButton: {
        color: GlobalStyles.color.PRIMARY,
    },
});

type Props = {};

type State = {};

class AccountDetails extends Component<Props, State> {
    render = () => {
        const { accountName, address, publicKey, privateKey, balance, networkType, componentId, isPasscodeSelected } = this.props;
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
    isPasscodeSelected: state.settings.isPasscodeSelected,
}))(AccountDetails);
