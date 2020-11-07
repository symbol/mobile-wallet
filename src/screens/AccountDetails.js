import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Section, GradientBackground, TitleBar, Input, Text } from '@src/components';
import { Router } from '@src/Router';
import { connect } from 'react-redux';

const styles = StyleSheet.create({});

type Props = {};

type State = {};

class AccountDetails extends Component<Props, State> {
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
                        <Text type="bold" theme="light">
                            Reveal account in the Block Explorer *link
                        </Text>
                    </Section>
                </Section>
            </GradientBackground>
        );
    };
}

export default connect(state => ({
    accountName: state.account.selectedAccount.name,
    address: state.account.selectedAccountAddress,
    publicKey: state.account.selectedAccount.id,
    privateKey: state.account.selectedAccount.privateKey,
    balance: '' + state.account.balance,
}))(AccountDetails);
