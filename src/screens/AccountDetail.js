import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {
	Section, 
	GradientBackground, 
	TitleBar, 
	Input, 
	Text
} from '@src/components';
import translate from '@src/locales/i18n';
import Store from '@src/store';
import { Router } from '@src/Router';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
});

type Props = {};

type State = {};

class AccountDetail extends Component<Props, State> {
    componentDidMount = () => {
        Store.dispatchAction({ type: 'transfer/clear' });
    };


    render = () => {
        const { 
			address,
			publicKey,
			privateKey,
			balance,
		} = this.props;

       

        return (
            <GradientBackground name="mesh_small_2" theme="light">
                <TitleBar theme="light" onBack={() => Router.goBack(this.props.componentId)} title="Account Details" />
                <Section type="form" style={styles.list} isScrollable>
                    <Section type="form-item">
                        <Input value={address} placeholder="Address" theme="light" fullWidth />
                    </Section>
                    <Section type="form-item">
                        <Input value={publicKey} placeholder="Public key" theme="light" fullWidth />
                    </Section>
					<Section type="form-item">
                        <Input value={privateKey} placeholder="Private key" theme="light" fullWidth />
                    </Section>
					<Section type="form-item">
                        <Input value={balance} placeholder="Balance" theme="light" fullWidth />
                    </Section>
					<Section type="form-item">
                        <Text>
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
    address: state.account.selectedAccount,
	publicKey: 'TODO',
	privateKey: state.account.selectedAccount.privateKey,
	balance: state.account.balance,
}))(AccountDetail);
