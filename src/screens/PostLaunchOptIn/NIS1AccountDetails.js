import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { GradientBackground, Section, TableView, TitleBar } from '@src/components';
import { Router } from '@src/Router';
import { connect } from 'react-redux';
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
    },
});

type Props = {};

type State = {
    loading: boolean,
    networkKeys: {
        vrf: any,
        linked: any,
        node: any,
    },
};

class NIS1AccountDetails extends Component<Props, State> {
    state = {};

    render = () => {
        const { selectedAccount, componentId } = this.props;

        const data = {
            address: selectedAccount.address,
            publicKey: selectedAccount.publicKey,
            privateKey: selectedAccount.privateKey,
        };

        return (
            <GradientBackground name="mesh_small_2" theme="light">
                <TitleBar theme="light" onBack={() => Router.goBack(this.props.componentId)} title="NIS1 Account Details" />
                <Section type="form" style={styles.list} isScrollable>
                    <TableView componentId={componentId} data={data} />
                </Section>
            </GradientBackground>
        );
    };
}

export default connect(state => ({
    selectedAccount: state.optin.selectedNIS1Account,
}))(NIS1AccountDetails);
