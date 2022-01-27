import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackHandler, Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
    Button,
    Checkbox,
    FadeView,
    Icon,
    Input,
    LinkExplorer,
    ListContainer,
    ListItem,
    LoadingAnimationFlexible,
    RandomImage,
    Row,
    Section,
    SwipeablePanel,
    TableView,
    Text,
    TitleBar,
    TransactionGraphic,
} from '@src/components';
import store from '@src/store';
import TransactionService from '@src/services/TransactionService';
import type { AggregateTransactionModel } from '@src/storage/models/TransactionModel';
import { showPasscode } from '@src/utils/passcode';
import { transactionAwaitingSignatureByAccount } from '@src/utils/transaction';
import translate from '@src/locales/i18n';
import GlobalStyles from '@src/styles/GlobalStyles';
import { TransactionType } from 'symbol-sdk';
import _ from 'lodash';
import Card from '../atoms/Card';
import BottomModal from '@src/components/atoms/BottomModal/BottomModal';
import modalStyles from './ModalSelector.styl';
import { Router } from '@src/Router';
import { AddressBook } from 'symbol-address-book/AddressBook';
const FULL_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
    panel: {
        backgroundColor: GlobalStyles.color.DARKWHITE,
    },
    tabs: {
        borderBottomWidth: 2,
        borderColor: GlobalStyles.color.WHITE,
        marginBottom: 2,
    },
    tab: {
        marginLeft: 20,
        paddingBottom: 5,
    },
    activeTab: {
        borderBottomColor: GlobalStyles.color.PINK,
        borderBottomWidth: 2,
        marginBottom: -2,
    },
    infoTable: {
        paddingTop: 16,
        paddingBottom: 16,
    },
    table: {
        marginTop: 20,
    },
    contentBottom: {
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
    acceptanceForm: {
        backgroundColor: GlobalStyles.color.SECONDARY,
        paddingTop: 17,
        flex: null,
    },
    blackListedPage: {
        backgroundColor: GlobalStyles.color.SECONDARY,
        paddingTop: 1,
        flex: null,
    },
    warningButtons: {
        backgroundColor: GlobalStyles.color.SECONDARY,
        paddingTop: 35,
        flex: null,
    },
    signFormContainer: {
        backgroundColor: GlobalStyles.color.ORANGE,
    },
    randomImage: {
        width: '100%',
        height: FULL_HEIGHT / 4,
        resizeMode: 'cover',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    textCaution: {
        textShadowColor: GlobalStyles.color.SECONDARY,
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 15,
    },
    signForm: {
        backgroundColor: GlobalStyles.color.ORANGE,
        paddingTop: 17,
        flex: null,
    },
    text: {
        marginTop: 20,
        marginLeft: 2,
        color: '#4C0CBF',
    },
    icon: {
        marginTop: 20,
        marginLeft: 10,
    },
});

type Props = {
    transaction: AggregateTransactionModel,
    addressBook: AddressBook,
};

class AggregateTransactionDetails extends Component<Props, State> {
    state = {
        fullTransaction: null,
        isActive: false,
        isLoading: false,
        expandGraphic: false,
        showLastWarning: false,
        userUnderstand: false,
        showBlacklistForm: false,
        needsSignature: false,
        blacklistAccountName: '',
        selectedTab: 'innerTransactions',
        hasCosignWarning: false,
        contactGotBlackListed: false,
        showBlacklistPopup: false,
    };

    backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        this.backHandler.remove();
        this.onClose();
        return true;
    });

    componentDidMount() {
        const { selectedNode, transaction } = this.props;

        this.setState({
            isActive: true,
            isLoading: true,
            fullTransaction: null,
        });

        TransactionService.getTransactionDetails(transaction.hash, selectedNode)
            .then(async tx => {
                const needsSignature = this.needsSignature();

                this.setState({
                    needsSignature,
                    expandGraphic: needsSignature,
                    fullTransaction: tx,
                    isLoading: false,
                });
            })
            .catch(e => {
                console.error(e);
                this.setState({
                    isActive: false,
                    isLoading: false,
                });
            });
    }

    sign() {
        showPasscode(this.props.componentId, () => {
            const { transaction } = this.props;
            store
                .dispatchAction({
                    type: 'transfer/signAggregateBonded',
                    payload: transaction,
                })
                .then(() => {
                    store.dispatchAction({
                        type: 'transaction/changeFilters',
                        payload: {},
                    });
                });
        });
    }

    needsSignature = () => {
        const { transaction, selectedAccount, isMultisig, cosignatoryOf } = this.props;
        const needsSig = !isMultisig && transactionAwaitingSignatureByAccount(transaction, selectedAccount, cosignatoryOf);
        if (needsSig) {
            this.hasCosignatoryWaning();
        }
        return needsSig;
    };

    //
    hasCosignatoryWaning = () => {
        const { transaction, address, cosignatoryOf, multisigGraphInfo } = this.props;
        const { needsSignature } = this.state;
        const msigAccModificationCurrentAddressAdded =
            transaction.innerTransactions?.length === 1 &&
            transaction.innerTransactions[0].type === TransactionType.MULTISIG_ACCOUNT_MODIFICATION &&
            transaction.innerTransactions[0].addressAdditions.some(addr => [address, ...cosignatoryOf].some(msa => msa === addr.plain()));
        const hasWarning =
            (needsSignature && msigAccModificationCurrentAddressAdded) ||
            (this.multisigAccountGraph && this.isAddressInMultisigTree(multisigGraphInfo, transaction.signerAddress));
        this.setState({
            hasCosignWarning: true,
        });
        return hasWarning;
    };

    //
    isAddressInMultisigTree(multisigAccountGraph, address) {
        for (const [l, levelAccounts] of multisigAccountGraph) {
            for (const levelAccount of levelAccounts) {
                if (
                    levelAccount.accountAddress.plain() === address ||
                    levelAccount.cosignatoryAddresses?.some(c => c.plain() === address)
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    blackListContact(contactName, contactAddress) {
        const { addressBook } = this.props;
        const contactExists = addressBook.getContactByAddress(contactAddress) !== undefined;
        if (!contactExists) {
            const contact = {
                address: contactAddress,
                name: contactName,
                phone: this.state.phone,
                isBlackListed: true,
            };

            store
                .dispatchAction({
                    type: 'addressBook/addContact',
                    payload: contact,
                })
                .then(() =>
                    this.setState({
                        contactGotBlackListed: true,
                        showBlacklistPopup: true,
                        showLastWarning: false,
                    })
                );
        } else {
            Router.showMessage({
                message: 'contact exists',
                type: 'danger',
            });
        }
    }
    onClosePopup() {
        console.log('onClosePopoup');
        if (this.state.showBlacklistPopup) {
            this.setState({
                showBlacklistPopup: false,
            });
        }
    }
    onClose() {
        const { onClose } = this.props;
        this.setState({
            isActive: false,
        });
        setTimeout(() => {
            onClose();
        }, 200);
    }

    renderTransactionItem({ index, item }) {
        return (
            <ListItem>
                <TableView data={{ innerTransactionNo: index + 1, ...item }} />
            </ListItem>
        );
    }

    renderGraphicItem = (expand, count) => ({ index, item }) => {
        return (
            <Section style={count - 1 === index && styles.contentBottom}>
                <View style={styles.graphicItem} key={'graphic' + index}>
                    <TransactionGraphic index={index} expand={expand} {...item} />
                </View>
            </Section>
        );
    };

    renderTabInnerTransactions() {
        const { isLoading, fullTransaction } = this.state;

        return (
            <FadeView style={{ flex: 1 }}>
                <ListContainer isScrollable={true} isLoading={isLoading || !fullTransaction} style={styles.infoTable}>
                    {fullTransaction && (
                        <FlatList
                            data={fullTransaction.innerTransactions}
                            renderItem={this.renderTransactionItem}
                            keyExtractor={(item, index) => '' + index + 'details'}
                            contentContainerStyle={{ flexGrow: 1 }}
                        />
                    )}
                </ListContainer>
            </FadeView>
        );
    }

    renderTabGraphic() {
        const { fullTransaction, expandGraphic } = this.state;

        return (
            <FadeView style={{ flex: 1 }}>
                {fullTransaction && (
                    <FlatList
                        data={fullTransaction.innerTransactions}
                        renderItem={this.renderGraphicItem(expandGraphic, fullTransaction.innerTransactions.length)}
                        keyExtractor={(item, index) => '' + index + 'details'}
                        contentContainerStyle={{ flexGrow: 1 }}
                    />
                )}
            </FadeView>
        );
    }

    renderTabInfo() {
        const { isLoading, fullTransaction } = this.state;
        const tabledata = _.omit(fullTransaction, ['innerTransactions', 'signTransactionObject', 'cosignaturePublicKeys', 'fee']);

        return (
            <FadeView style={{ flex: 1 }}>
                <ListContainer isScrollable={true} isLoading={isLoading || !fullTransaction} style={styles.infoTable}>
                    {fullTransaction && (
                        <>
                            <ListItem>
                                <TableView data={tabledata} />
                            </ListItem>
                            <ListItem>
                                <LinkExplorer type="transaction" value={fullTransaction.hash} />
                            </ListItem>
                        </>
                    )}
                </ListContainer>
            </FadeView>
        );
    }

    renderSign() {
        const { showLastWarning, userUnderstand, showBlacklistForm, blacklistAccountName, hasCosignWarning } = this.state;
        const { transaction } = this.props;
        if (!showLastWarning && !showBlacklistForm) {
            return (
                <Section type="form" style={styles.acceptanceForm}>
                    <Section type="form-item">
                        <Text type="bold">{translate('history.cosignFormTitleRequireSignature')}</Text>
                    </Section>
                    <Section type="form-item">
                        <Button
                            text={translate('history.cosignFormButtonContinue')}
                            theme="dark"
                            onPress={() =>
                                this.setState({
                                    showLastWarning: true,
                                    userUnderstand: false,
                                    selectedTab: 'graphic',
                                })
                            }
                        />
                    </Section>
                    {hasCosignWarning && (
                        <Section type="form-item">
                            <Button
                                text={translate('history.cosignFormButtonMarkSpam')}
                                theme="dark"
                                onPress={() => this.setState({ showBlacklistForm: true })}
                            />
                        </Section>
                    )}
                </Section>
            );
        } else if (showBlacklistForm) {
            return (
                <Section type="form" style={styles.acceptanceForm}>
                    <Section type="form-item">
                        <TouchableOpacity onPress={() => this.setState({ showBlacklistForm: false })}>
                            <Row align="center">
                                <Icon name="back_dark" size="small" style={{ marginRight: 10 }} />
                                <Text type="bold">{translate('history.cosignFormTitleBlacklist')}</Text>
                            </Row>
                        </TouchableOpacity>
                    </Section>
                    <Section type="form-item">
                        <Input
                            value={blacklistAccountName}
                            placeholder={translate('history.cosignFormInputName')}
                            theme="light"
                            onChangeText={value => this.setState({ blacklistAccountName: value })}
                        />
                    </Section>
                    <Section type="form-item">
                        <Button
                            text={translate('history.cosignFormButtonBlacklist')}
                            theme="dark"
                            onPress={() => this.blackListContact(this.state.blacklistAccountName, transaction.signerAddress)}
                        />
                    </Section>
                </Section>
            );
        } else if (hasCosignWarning && contactGotBlackListed) {
            <FadeView>
                <Section type="form-item">
                    <Text theme="light" align="center" type="regular">
                        {'title'}
                    </Text>
                </Section>
            </FadeView>;
        } else {
            return (
                <FadeView style={[styles.signFormContainer, { flex: 1 }]}>
                    <RandomImage style={styles.randomImage} isContainer>
                        <Text style={styles.textCaution} type="title" theme="dark" align="center">
                            {translate('history.caution')}
                        </Text>
                    </RandomImage>
                    <Section type="form" style={styles.signForm} isScrollable>
                        <Section type="form-bottom">
                            <Section type="form-item">
                                <Text type="bold">{translate('history.cosignFormTitleLastWarning')}</Text>
                            </Section>
                            <Section type="form-item">
                                <Checkbox
                                    value={userUnderstand}
                                    title={translate('history.cosignFormCheckbox')}
                                    theme="dark"
                                    onChange={value => this.setState({ userUnderstand: value })}
                                />
                            </Section>
                            <Section type="form-item">
                                <Button
                                    text={translate('history.cosignFormButtonReviewAgain')}
                                    theme="light"
                                    onPress={() =>
                                        this.setState({
                                            showLastWarning: false,
                                            expandGraphic: true,
                                            selectedTab: 'innerTransactions',
                                        })
                                    }
                                />
                            </Section>
                            <Section>
                                <Button
                                    isDisabled={!userUnderstand}
                                    text={translate('history.transaction.sign')}
                                    theme="light"
                                    onPress={() => this.sign()}
                                />
                            </Section>
                        </Section>
                    </Section>
                </FadeView>
            );
        }
    }
    goToAddressBook() {
        this.setState({ showBlacklistPopup: false });
        Router.goToAddressBook({ tab: 'blacklist' }, this.props.componentId);
    }
    render() {
        const {
            isActive,
            showLastWarning,
            isLoading,
            selectedTab,
            fullTransaction,
            needsSignature,
            contactGotBlackListed,
            showBlacklistPopup,
        } = this.state;
        let Content = null;

        switch (selectedTab) {
            default:
            case 'innerTransactions':
                Content = this.renderTabGraphic();
                break;
            case 'info':
                Content = this.renderTabInfo();
                break;
        }
        if (!contactGotBlackListed) {
            return (
                <SwipeablePanel
                    isActive={isActive}
                    fullWidth
                    openLarge
                    onlyLarge
                    onClose={() => this.onClose()}
                    onPressCloseButton={() => this.onClose()}
                    style={{ backgroundColor: '#f3f4f8' }}
                >
                    <TitleBar theme="light" title={translate('history.transactionDetails')} onClose={() => this.onClose()} />
                    {!showLastWarning && (
                        <Row style={styles.tabs}>
                            <TouchableOpacity
                                style={[styles.tab, selectedTab === 'innerTransactions' && styles.activeTab]}
                                onPress={() =>
                                    this.setState({
                                        selectedTab: 'innerTransactions',
                                    })
                                }
                            >
                                <Text type="bold" theme="light">
                                    {translate('history.innerTransactionTab')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tab, selectedTab === 'info' && styles.activeTab]}
                                onPress={() => this.setState({ selectedTab: 'info' })}
                            >
                                <Text type="bold" theme="light">
                                    {translate('history.infoTransactionTab')}
                                </Text>
                            </TouchableOpacity>
                        </Row>
                    )}
                    {(isLoading || !fullTransaction) && (
                        <LoadingAnimationFlexible isFade style={{ position: 'relative', height: '80%' }} text={' '} theme="light" />
                    )}
                    {!showLastWarning && !isLoading && fullTransaction && Content}
                    {needsSignature && !isLoading && this.renderSign()}
                </SwipeablePanel>
            );
        } else {
            return (
                <BottomModal style={{ height: '100%' }} isModalOpen={showBlacklistPopup} onClose={() => this.onClosePopup()}>
                    <Card style={(modalStyles.bottomCard, modalStyles.closeButton)}>
                        <TouchableOpacity style={GlobalStyles.closeButton} onPress={() => this.onClosePopup()}>
                            <Image style={modalStyles.closeIcon} source={require('@src/assets/icons/ic-close-black.png')} />
                        </TouchableOpacity>
                    </Card>
                    <Text style={modalStyles.titleText}>{'Added to blacklist'}</Text>
                    <Text style={modalStyles.subtitleText}>
                        {
                            'Your blacklist lets you save cryptocurrency addresses that are known scammers. These addresses will be automatically blocked'
                        }
                    </Text>
                    <Section type="form-item">
                        <TouchableOpacity style={{ position: 'relative', height: '80%' }} onPress={() => this.goToAddressBook()}>
                            <Row style={(styles.root, modalStyles.link)} align="center">
                                <Icon name="malicious_contact" size="medium" style={styles.icon} />
                                <Text type="bold" theme="light" style={styles.text}>
                                    {'See Blacklist'}
                                </Text>
                            </Row>
                        </TouchableOpacity>
                    </Section>
                </BottomModal>
            );
        }
    }
}

export default connect(state => ({
    selectedNode: state.network.selectedNetwork,
    isLoading: state.transfer.isLoading,
    selectedAccount: state.wallet.selectedAccount,
    isMultisig: state.account.isMultisig,
    cosignatoryOf: state.account.cosignatoryOf,
    network: state.network.selectedNetwork.type,
    address: state.account.selectedAccountAddress,
    multisigGraphInfo: state.account.multisigGraphInfo,
    addressBook: state.addressBook.addressBook,
}))(AggregateTransactionDetails);
