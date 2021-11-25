import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
    GradientBackground,
    LinkExplorer,
    LinkFaucet,
    QRImage,
    Row,
    Section,
    TableView,
    Text,
    TitleBar,
} from '@src/components';
import { Router } from '@src/Router';
import { connect } from 'react-redux';
import GlobalStyles from '@src/styles/GlobalStyles';
import { getAccountIndexFromDerivationPath } from '@src/utils/format';
import translate from '@src/locales/i18n';

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
    alert: {
        padding: 5,
        backgroundColor: GlobalStyles.color.ORANGE,
        borderRadius: 5,
        marginBottom: 15,
    },
});

type Props = {};

type State = {};

class AccountDetails extends Component<Props, State> {
    state = {
        isLoading: false,
    };

    render = () => {
        const {
            accountName,
            address,
            publicKey,
            privateKey,
            balance,
            networkType,
            componentId,
            accountType,
            path,
            isPasscodeSelected,
        } = this.props;
        const { contactQR, isLoading } = this.state;
        const seedIndex =
            accountType === 'hd'
                ? getAccountIndexFromDerivationPath(path, networkType)
                : null;
        const data = {
            accountName,
            seedIndex,
            address,
            publicKey,
            privateKey,
            ...(seedIndex ? { seedIndex } : null),
            balance,
        };
        return (
            <GradientBackground
                name="mesh_small_2"
                theme="light"
                dataManager={{ isLoading }}
            >
                <TitleBar
                    theme="light"
                    onBack={() => Router.goBack(this.props.componentId)}
                    title="Account Details"
                />
                <Section type="form" style={styles.list} isScrollable>
                    <Section type="form-item">
                        <Row justify="center">
                            {accountType === 'optin' && (
                                <View style={styles.alert}>
                                    <Text
                                        type="subtitle"
                                        align="center"
                                        theme="dark"
                                    >
                                        {translate(
                                            'unsortedKeys.opt_in_account_alert'
                                        )}
                                    </Text>
                                </View>
                            )}
                        </Row>
                        {/* {contactQR && <Image style={styles.qr} source={{ uri: contactQR }} />} */}
                        <Row justify="center">
                            <QRImage
                                type="address"
                                accountName={accountName}
                                address={address}
                            />
                            {/* <QRImage
								type="privateKey"
								privateKey={privateKey}
							/> */}
                        </Row>
                    </Section>
                    <TableView componentId={componentId} data={data} />
                    <Section type="form-item">
                        <LinkExplorer
                            type="account"
                            value={this.props.address}
                        />
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
    accountType: state.wallet.selectedAccount.type,
    address: state.account.selectedAccountAddress,
    publicKey: state.wallet.selectedAccount.id,
    privateKey: state.wallet.selectedAccount.privateKey,
    balance: '' + state.account.balance,
    path: state.wallet.selectedAccount.path,
    networkType: state.network.selectedNetwork.type,
    generationHash: state.network.generationHash,
    isPasscodeSelected: state.settings.isPasscodeSelected,
}))(AccountDetails);
