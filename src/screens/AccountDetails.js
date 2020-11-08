import React, { Component } from 'react';
import { Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { Section, GradientBackground, TitleBar, Input, Text } from '@src/components';
import { Router } from '@src/Router';
import { connect } from 'react-redux';
import { getExplorerURL } from '@src/config/environment';

const styles = StyleSheet.create({});

type Props = {};

type State = {};

class AccountDetails extends Component<Props, State> {
    openExplorer() {
        const { address } = this.props;
        Linking.openURL(`${getExplorerURL()}accounts/${address.replace(/-/g, '')}`);
    }

    render = () => {
        const { accountName, address, publicKey, privateKey, balance } = this.props;
        return (
            <GradientBackground name="mesh_small_2" theme="light">
                <TitleBar theme="light" onBack={() => Router.goBack(this.props.componentId)} title="Account Details" />
                {/* TODO: Create table component and use it to display data below */}
                <Section type="form" style={styles.list} isScrollable>
                    <Section type="form-item">
                        <Input value={accountName} placeholder="Account name" theme="light" fullWidth editable={false} />
                    </Section>
                    {/* TODO: Add copy button */}
                    <Section type="form-item">
                        <Input value={address} placeholder="Address" theme="light" fullWidth editable={false} />
                    </Section>
                    <Section type="form-item">
                        <Input value={publicKey} placeholder="Public key" theme="light" fullWidth editable={false} />
                    </Section>
                    {/* TODO: Add protected field with Passcode and timer */}
                    <Section type="form-item">
                        <Input value={privateKey} placeholder="Private key" theme="light" fullWidth editable={false} />
                    </Section>
                    <Section type="form-item">
                        <Input value={balance} placeholder="Balance" theme="light" fullWidth editable={false} />
                    </Section>
                    <Section type="form-item">
                        <TouchableOpacity onPress={() => this.openExplorer()}>
                            <Text type="bold" theme="light">
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
