import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackHandler, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
    Button,
    Checkbox,
    FadeView,
    LinkExplorer,
    ListContainer,
    ListItem,
    LoadingAnimationFlexible,
    Row,
    Section,
    SwipeablePanel,
    TableView,
    Tabs,
    Text,
    TitleBar,
    TransactionGraphic,
} from '@src/components';
import store from '@src/store';
import TransactionService from '@src/services/TransactionService';
import { Router } from '@src/Router';
import { showPasscode } from '@src/utils/passcode';
import { transactionAwaitingSignatureByAccount } from '@src/utils/transaction';
import translate from '@src/locales/i18n';
import GlobalStyles from '@src/styles/GlobalStyles';
import _ from 'lodash';

const styles = StyleSheet.create({
    panel: {
        backgroundColor: GlobalStyles.color.DARKWHITE,
    },
    infoTable: {
        paddingTop: 16,
        paddingBottom: 16,
    },
    graphicItemLast: {
        marginBottom: 18,
    },
    graphicItem: {
        backgroundColor: GlobalStyles.color.WHITE,
        marginTop: 16,
        marginHorizontal: 2,
        borderRadius: 6,
        flexDirection: 'row',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 1,
    },
    signFormContainer: {
        flex: null,
    },
    signFormRegular: {
        backgroundColor: GlobalStyles.color.SECONDARY,
        paddingTop: 17,
        flex: null,
    },
    signFormWarning: {
        backgroundColor: GlobalStyles.color.ORANGE,
        paddingTop: 17,
        flex: null,
    },
    linkText: {
        textAlign: 'center',
        textDecorationLine: 'underline',
        opacity: 0.7,
    },
    loadingView: {
        position: 'relative',
        height: '80%',
    },
    warningIcon: {
        fontSize: 8,
        lineHeight: 8,
        borderRadius: 7,
        backgroundColor: GlobalStyles.color.RED,
        color: GlobalStyles.color.WHITE,
        paddingTop: 3,
        paddingBottom: 1,
        paddingHorizontal: 5,
        marginLeft: 5,
    },
});

class AggregateTransactionDetails extends Component {
    state = {
        transactionDetails: null,
        isActive: false,
        isLoading: false,
        isGraphicExpanded: false,
        isSignFormShown: false,
        isBlackListedSigner: false,
        signerAddress: '',
        signFormView: '',
        selectedTab: 'innerTransactions',
    };

    backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        this.backHandler.remove();
        this.close();
        return true;
    });

    componentDidMount() {
        const {
            addressBook,
            cosignatoryOf,
            isMultisig,
            multisigTreeAccounts,
            onError,
            selectedAccount,
            selectedNode,
            transaction,
        } = this.props;

        this.setState({
            isActive: true,
            isLoading: true,
            transactionDetails: null,
        });

        TransactionService.getTransactionDetails(transaction.hash, selectedNode)
            .then(async transactionDetails => {
                const { signerAddress } = transactionDetails;
                const isAwaitingSignature =
                    !isMultisig && transactionAwaitingSignatureByAccount(transaction, selectedAccount, cosignatoryOf);
                const signerContact = addressBook.getContactByAddress(signerAddress);
                const isBlackListedSigner = signerContact && signerContact.isBlackListed;
                const isWhiteListedSigner = signerContact && !isBlackListedSigner;
                const isKnownSigner =
                    !isBlackListedSigner && !!multisigTreeAccounts.find(account => account.accountAddress.plain() === signerAddress);
                let signFormView;

                if (isBlackListedSigner) {
                    signFormView = 'blocked_signer_initial';
                } else if (isWhiteListedSigner) {
                    signFormView = 'trusted_signer_initial';
                } else if (isKnownSigner) {
                    signFormView = 'known_signer_initial';
                } else {
                    signFormView = 'unknown_signer_initial';
                }

                this.setState({
                    isSignFormShown: isAwaitingSignature,
                    isGraphicExpanded: isAwaitingSignature,
                    isBlackListedSigner,
                    signerAddress,
                    signFormView,
                    transactionDetails,
                    isLoading: false,
                });
            })
            .catch(error => {
                Router.showMessage({
                    message: error.message,
                    type: 'danger',
                });
                this.close();
                onError(error);
            });
    }

    close() {
        const { onClose } = this.props;
        this.backHandler.remove();
        this.setState({ isActive: false });
        setTimeout(onClose, 200);
    }

    renderTabInnerTransactions() {
        const { isGraphicExpanded, transactionDetails } = this.state;
        const transactionCount = transactionDetails.innerTransactions.length;

        const getItemStyle = index => (index === transactionCount - 1 ? styles.graphicItemLast : {});

        return (
            <FadeView style={{ flex: 1 }}>
                {transactionDetails && (
                    <FlatList
                        data={transactionDetails.innerTransactions}
                        renderItem={({ index, item }) => (
                            <Section style={getItemStyle(index)}>
                                <View style={styles.graphicItem} key={'graphic' + index}>
                                    <TransactionGraphic index={index} expand={isGraphicExpanded} {...item} />
                                </View>
                            </Section>
                        )}
                        keyExtractor={(item, index) => '' + index + 'details'}
                        contentContainerStyle={{ flexGrow: 1 }}
                    />
                )}
            </FadeView>
        );
    }

    renderTabInfo() {
        const { transactionDetails, isLoading } = this.state;
        const tabledata = _.omit(transactionDetails, ['innerTransactions', 'signTransactionObject', 'cosignaturePublicKeys', 'fee']);

        return (
            <FadeView style={{ flex: 1 }}>
                <ListContainer isScrollable={true} isLoading={isLoading || !transactionDetails} style={styles.infoTable}>
                    {transactionDetails && (
                        <>
                            <ListItem>
                                <TableView data={tabledata} />
                            </ListItem>
                            <ListItem>
                                <LinkExplorer type="transaction" value={transactionDetails.hash} />
                            </ListItem>
                        </>
                    )}
                </ListContainer>
            </FadeView>
        );
    }

    renderSignForm() {
        const { addressBook, componentId, transaction } = this.props;
        const { signerAddress, signFormView, isRiskAccepted } = this.state;

        const goToUnknownSignerOptions = () =>
            this.setState({
                signFormView: 'unknown_signer_options',
            });
        const goToKnownSignerInitial = () =>
            this.setState({
                signFormView: 'known_signer_initial',
                isGraphicExpanded: true,
            });
        const goToKnownSignerConfirm = () =>
            this.setState({
                signFormView: 'known_signer_confirm',
                isRiskAccepted: false,
            });
        const goToContactProfile = async () => {
            this.close();
            const contact = addressBook.getContactByAddress(signerAddress);
            await store.dispatchAction({ type: 'addressBook/selectContact', payload: contact });
            Router.goToContactProfile({}, componentId);
        };
        const addSignerToAddressBook = async listType => {
            this.close();
            await store.dispatchAction({ type: 'addressBook/selectContact', payload: null });
            Router.goToAddContact(
                {
                    address: signerAddress,
                    isBlackListed: listType === 'blacklist',
                },
                componentId
            );
        };
        const signTransaction = () => {
            showPasscode(componentId, async () => {
                await store.dispatchAction({ type: 'transfer/signAggregateBonded', payload: transaction });
                store.dispatchAction({ type: 'transaction/changeFilters', payload: {} });
                this.close();
            });
        };

        switch (signFormView) {
            case 'unknown_signer_initial':
                return (
                    <Section type="form" style={styles.signFormRegular}>
                        <Section type="form-item">
                            <Row align="center">
                                <Text type="bold">{translate('history.cosignFormTitleRequireSignatureUnknown')}</Text>
                                <Text type="bold" style={styles.warningIcon}>
                                    !
                                </Text>
                            </Row>
                        </Section>
                        <Section type="form-item">
                            <Button text={translate('history.cosignFormButtonContinue')} theme="dark" onPress={goToUnknownSignerOptions} />
                        </Section>
                    </Section>
                );

            case 'unknown_signer_options':
                return (
                    <Section type="form" style={styles.signFormRegular}>
                        <Section type="form-item">
                            <Row align="center">
                                <Text type="bold">{translate('history.cosignFormUnknownSignerCaution')}</Text>
                            </Row>
                        </Section>
                        <Section type="form-item">
                            <Row align="center">
                                <Text type="regular-compact">{translate('history.cosignFormUnknownSignerExplanation')}</Text>
                            </Row>
                        </Section>
                        <Section type="form-item">
                            <Row justify="space-between">
                                <TouchableOpacity onPress={() => addSignerToAddressBook('blacklist')}>
                                    <Text type="bold" theme="dark" style={styles.linkText}>
                                        {translate('history.cosignFormButtonBlacklist')}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => addSignerToAddressBook('whitelist')}>
                                    <Text type="bold" theme="dark" style={styles.linkText}>
                                        {translate('history.cosignFormButtonWhitelist')}
                                    </Text>
                                </TouchableOpacity>
                            </Row>
                        </Section>
                    </Section>
                );

            case 'known_signer_initial':
                return (
                    <Section type="form" style={styles.signFormRegular}>
                        <Section type="form-item">
                            <Row align="center">
                                <Text type="bold">{translate('history.cosignFormTitleRequireSignatureUnknown')}</Text>
                                <Text type="bold" style={styles.warningIcon}>
                                    !
                                </Text>
                            </Row>
                        </Section>
                        <Section type="form-item">
                            <Button text={translate('history.cosignFormButtonGoToSign')} theme="dark" onPress={goToKnownSignerConfirm} />
                        </Section>
                        <TouchableOpacity onPress={blockSigner}>
                            <Text type="bold" theme="dark" style={styles.linkText}>
                                {translate('history.cosignFormButtonBlacklist')}
                            </Text>
                        </TouchableOpacity>
                    </Section>
                );

            case 'known_signer_confirm':
                return (
                    //<FadeView style={styles.signFormContainer}>
                    <Section type="form" style={styles.signFormWarning}>
                        <Section type="form-item">
                            <Text type="bold">{translate('history.cosignFormTitleLastWarning')}</Text>
                        </Section>
                        <Section type="form-item">
                            <Checkbox
                                value={isRiskAccepted}
                                title={translate('history.cosignFormCheckbox')}
                                theme="dark"
                                onChange={value => this.setState({ isRiskAccepted: value })}
                            />
                        </Section>
                        <Section type="form-item">
                            <Button
                                isDisabled={!isRiskAccepted}
                                text={translate('history.transaction.sign')}
                                theme="dark"
                                onPress={signTransaction}
                            />
                        </Section>
                        <TouchableOpacity onPress={goToKnownSignerInitial}>
                            <Text type="bold" theme="dark" style={styles.linkText}>
                                {translate('history.cosignFormButtonBack')}
                            </Text>
                        </TouchableOpacity>
                    </Section>
                    //</FadeView>
                );

            case 'trusted_signer_initial':
                return (
                    <Section type="form" style={styles.signFormRegular}>
                        <Section type="form-item">
                            <Text type="bold">{translate('history.cosignFormTitleRequireSignature')}</Text>
                        </Section>
                        <Section type="form-item">
                            <Button text={translate('history.transaction.sign')} theme="dark" onPress={signTransaction} />
                        </Section>
                    </Section>
                );

            case 'blocked_signer_initial':
                return (
                    <Section type="form" style={styles.signFormRegular}>
                        <Section type="form-item">
                            <Text type="bold">{translate('history.cosignFormTitleRequireSignature')}</Text>
                        </Section>
                        <Section type="form-item">
                            <Row align="center">
                                <Text type="regular-compact">{translate('history.cosignFormBlockedSignerExplanation')}</Text>
                            </Row>
                        </Section>
                        <Section type="form-item">
                            <TouchableOpacity onPress={goToContactProfile}>
                                <Text type="bold" theme="dark" style={styles.linkText}>
                                    {translate('history.cosignFormButtonViewContact')}
                                </Text>
                            </TouchableOpacity>
                        </Section>
                    </Section>
                );

            default:
                return null;
        }
    }

    render() {
        const { isActive, isLoading, isSignFormShown, selectedTab, transactionDetails } = this.state;
        const isContentLoaded = !isLoading && transactionDetails;
        const isTabInnerTransactionsShown = isContentLoaded && selectedTab === 'innerTransactions';
        const isTabInfoShown = isContentLoaded && selectedTab === 'info';
        const tabs = [
            {
                value: 'innerTransactions',
                label: translate('history.innerTransactionTab'),
            },
            {
                value: 'info',
                label: translate('history.infoTransactionTab'),
            },
        ];

        return (
            <SwipeablePanel
                isActive={isActive}
                fullWidth
                openLarge
                onlyLarge
                onClose={() => this.close()}
                onPressCloseButton={() => this.close()}
                style={styles.panel}
            >
                <TitleBar theme="light" title={translate('history.transactionDetails')} onClose={() => this.close()} />
                <Tabs value={selectedTab} list={tabs} onChange={selectedTab => this.setState({ selectedTab })} />
                {!isContentLoaded && <LoadingAnimationFlexible isFade text=" " theme="light" style={styles.loadingView} />}
                {isTabInnerTransactionsShown && this.renderTabInnerTransactions()}
                {isTabInfoShown && this.renderTabInfo()}
                {isSignFormShown && this.renderSignForm()}
            </SwipeablePanel>
        );
    }
}

export default connect(state => ({
    address: state.account.selectedAccountAddress,
    addressBook: state.addressBook.addressBook,
    cosignatoryOf: state.account.cosignatoryOf,
    isLoading: state.transfer.isLoading,
    isMultisig: state.account.isMultisig,
    multisigTreeAccounts: state.account.multisigTreeAccounts,
    network: state.network.selectedNetwork.type,
    selectedAccount: state.wallet.selectedAccount,
    selectedNode: state.network.selectedNetwork,
}))(AggregateTransactionDetails);
