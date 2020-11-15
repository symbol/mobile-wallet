import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Row } from '@src/components';
import { AddressComponent } from '@src/components/controls';
import type { TransferTransactionModel } from '@src/storage/models/TransactionModel';
import { connect } from 'react-redux';
import { Account, Address, NetworkType, PublicAccount, RepositoryFactoryHttp, TransactionGroup } from "symbol-sdk";
import SecretView from '@src/components/controls/SecretView';

const styles = StyleSheet.create({
    root: {
        width: '100%',
        borderRadius: 6,
        marginTop: 0,
        marginBottom: 8,
        padding: 17,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: '#fffd',
    },
});

type Props = {
    transaction: TransferTransactionModel,
    showDetails: boolean,
    componentId: string,
};

class TransferTransaction extends Component<Props> {
    state = {
        messageDecrypted: 'encrypted',
    };

    async decrypt(transaction) {
        const networkType = NetworkType.TEST_NET;
        const { network, privateKey } = this.props;
        const certificateAccount = Account.createFromPrivateKey(privateKey, networkType);
        const repositoryFactory = await new RepositoryFactoryHttp(network.node);
        const accountHttp = repositoryFactory.createAccountRepository();
        const recipientAddress = Address.createFromRawAddress(transaction.signerAddress);
        const accountInfo = await accountHttp.getAccountInfo(recipientAddress).toPromise();
        const publicAccount = PublicAccount.createFromPublicKey(accountInfo.publicKey, networkType);
        const transactionHttp = repositoryFactory.createTransactionRepository();
        const transactionHash = transaction.hash;

        await transactionHttp.getTransaction(transactionHash, TransactionGroup.Confirmed).subscribe(
            tx => {
                if (tx.message.type === 1) {
                    this.setState({
                        messageDecrypted: certificateAccount.decryptMessage(tx.message, publicAccount).payload,
                    });
                }
            },
            err => console.log(err)
        );
    }

    async componentDidMount() {
        const { transaction } = this.props;
        if (transaction.messageEncrypted) await this.decrypt(transaction);
    }

    render() {
        console.log("hola");
        const { transaction, network, showDetails, openExplorer } = this.props;
        const currencyMosaic = transaction.mosaics.find(mosaic => mosaic.mosaicId === network.currencyMosaicId);
        return (
            <View style={styles.root}>
                <Row justify="space-between">
                    <Text type="regular" theme="light">
                        {transaction.type}
                    </Text>
                    <Text type="regular" theme="light">
                        {transaction.deadline}
                    </Text>
                </Row>
                <Row justify="space-between">
                    <AddressComponent type="bold" theme="light">
                        {transaction.signerAddress}
                    </AddressComponent>
                    <Text type="bold" theme="light">
                        Amount: {currencyMosaic ? currencyMosaic.amount / Math.pow(10, currencyMosaic.divisibility) : 0}
                    </Text>
                </Row>
                {showDetails && (
                    <View>
                        <Row justify="space-between">
                            <Text type="bold" theme="light">
                                Mosaics:
                            </Text>
                        </Row>
                        {transaction.mosaics.map(mosaic => {
                            return (
                                <Row justify="space-between">
                                    <Text type="regular" theme="light" align="right">
                                        {mosaic.mosaicName || mosaic.mosaicId}
                                    </Text>
                                    <Text type="regular" theme="light">
                                        {mosaic.amount / Math.pow(10, mosaic.divisibility)}
                                    </Text>
                                </Row>
                            );
                        })}
                        <Row justify="space-between">
                            <Text type="bold" theme="light">
                                Message:
                            </Text>
                        </Row>
                        {transaction.messageEncrypted ? (
                            <SecretView props={this.props.componentId} title="Decrypt" type="regular" theme="light">
                                {this.state.messageDecrypted}
                            </SecretView>
                        ) : (
                            <Text type="bold" theme="light">
                                {transaction.messageText}
                            </Text>
                        )}

                        <Row justify="space-between">
                            <Text type="bold" theme="light">
                                Hash:
                            </Text>
                            <Text type="regular" theme="light">
                                {transaction.hash.slice(0, 24)}...
                            </Text>
                        </Row>

                        <TouchableOpacity onPress={openExplorer}>
                            <Row justify="end">
                                <Text type="regular" theme="light">
                                    Open in the explorer
                                </Text>
                            </Row>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }
}

export default connect(state => ({
    network: state.network.selectedNetwork,
    addressBook: state.addressBook.addressBook,
    privateKey: state.wallet.selectedAccount.privateKey,
    networkType: state.network.selectedNetwork.type,
}))(TransferTransaction);
