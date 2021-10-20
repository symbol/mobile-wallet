import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, FlatList, TouchableOpacity, StyleSheet, } from 'react-native';
import { 
    Text, 
    Row, 
    Button, 
    ListItem,
    ListContainer,
    LoadingAnimationFlexible,
    TableView,
    TitleBar,
    TransactionGraphic,
    SwipeablePanel, 
    FadeView,
    LinkExplorer,
    Section,
    RandomImage,
    Checkbox,
    Input,
    Icon
} from '@src/components';
import store from '@src/store';
import TransactionService from '@src/services/TransactionService';
import type { AggregateTransactionModel } from '@src/storage/models/TransactionModel';
import { getPublicKeyFromPrivateKey } from '@src/utils/account';
import { showPasscode } from '@src/utils/passcode';
import translate from '@src/locales/i18n';
import GlobalStyles from '@src/styles/GlobalStyles';

const styles = StyleSheet.create({
    panel: {
        backgroundColor: GlobalStyles.color.DARKWHITE
    },
	tabs: {
		borderBottomWidth: 2,
		borderColor: GlobalStyles.color.WHITE,
        marginBottom: 20
	},
	tab: {
        marginLeft: 20,
		paddingBottom: 5
	},
	activeTab: {
		borderBottomColor: GlobalStyles.color.PINK,
		borderBottomWidth: 2,
		marginBottom: -2
	},
    graphicItem: {
        backgroundColor: GlobalStyles.color.WHITE,
        marginBottom: 16,
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
        flex: null
    },
    signFormContainer: {
        backgroundColor: GlobalStyles.color.ORANGE,
    },
    randomImage: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    textCaution: {
        textShadowColor: GlobalStyles.color.SECONDARY,
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 15
    },
    signForm: {
        backgroundColor: GlobalStyles.color.ORANGE,
        paddingTop: 17,
        flex: null
    }
});

type Props = {
    transaction: AggregateTransactionModel,
};

class AggregateTransactionDetails extends Component<Props, State> {
    state = {
        fullTransaction: null,
        raw: null,
        isActive: false,
        isLoading: false,
        expandGraphic: false,
        showLastWarning: false,
        userUnderstand: false,
        showBlacklistForm: false,
        blacklistAccountName: '',
        selectedTab: 'info'
    };

    componentDidMount() {
        const { selectedNode, transaction } = this.props;

        this.setState({
            isActive: true,
            isLoading: true,
            fullTransaction: null
        })

        TransactionService.getTransactionDetails(transaction.hash, selectedNode)
            .then(async tx => {
                this.setState({ 
                    fullTransaction: tx,
                    isLoading: false
                });
            })
            .catch((e) => {
                console.error(e)
                this.setState({
                    isActive: false,
                    isLoading: false
                })
            });
    }

    sign() {
        showPasscode(this.props.componentId, () => {
            const { transaction } = this.props;
            store.dispatchAction({ type: 'transfer/signAggregateBonded', payload: transaction }).then(_ => {
                store.dispatchAction({ type: 'transaction/changeFilters', payload: {} });
            });
        });
    }

    needsSignature = () => {
        const { transaction, selectedAccount, isMultisig } = this.props;
        const accountPubKey = getPublicKeyFromPrivateKey(selectedAccount.privateKey);
        return !isMultisig 
            && transaction.cosignaturePublicKeys.indexOf(accountPubKey) === -1 
            && transaction.status !== 'confirmed';
    };

    onClose() {
        const { onClose } = this.props;
        this.setState({
            isActive: false
        })
        setTimeout(() => {
            onClose();
        }, 200); 
    }

    renderTransactionItem({index, item}) {
        return <ListItem>
            <TableView data={{'innerTransactionNo': index + 1, ...item}} />
        </ListItem>
    }

    renderGraphicItem = (expand) => ({index, item}) => {
        return <View type="form-item" style={styles.graphicItem} key={'graphic' + index}>
            <TransactionGraphic index={index} forceExpand={expand} {...item} />
        </View>        
    }

    renderTabInnerTransactions() {
        const { isLoading, fullTransaction } = this.state;

        return <FadeView style={{ flex: 1 }}>
            <ListContainer isScrollable={false} isLoading={isLoading || !fullTransaction} style={{flex: 1}}>
                {fullTransaction && <FlatList
                    data={fullTransaction.innerTransactions}
                    renderItem={this.renderTransactionItem}
                    keyExtractor={(item, index) => '' + index + 'details'}
                    contentContainerStyle={{ flexGrow: 1 }}
                />}
                </ListContainer>
        </FadeView>
    }

    renderTabGraphic() {
        const { isLoading, fullTransaction, expandGraphic } = this.state;

        return isLoading || !fullTransaction
        ? <LoadingAnimationFlexible isFade text={' '} theme="light" />
        : <FadeView style={{ flex: 1 }}>
            <Section type="form">
                <FlatList
                    data={fullTransaction.innerTransactions}
                    renderItem={this.renderGraphicItem(expandGraphic)}
                    keyExtractor={(item, index) => '' + index + 'details'}
                    contentContainerStyle={{ flexGrow: 1 }}
                />
            </Section>
        </FadeView>
    }

    renderTabInfo() {
        const { isLoading, fullTransaction } = this.state;
    
        return <FadeView style={{ flex: 1 }}>
            <ListContainer isScrollable={true} isLoading={isLoading || !fullTransaction} style={{flex: 1}}>
                {fullTransaction && <>
                    <ListItem>
                        <TableView data={fullTransaction.info} />
                    </ListItem>
                    <ListItem>
                        <LinkExplorer type="transaction" value={fullTransaction.info.hash} />
                    </ListItem>
                </>}
            </ListContainer>
        </FadeView>
    }

    renderSign() {
        const { showLastWarning, userUnderstand, showBlacklistForm, blacklistAccountName } = this.state;

        if (!showLastWarning && !showBlacklistForm) {
            return <Section type="form" style={styles.acceptanceForm}>
                <Section type="form-item">
                    <Text type="bold">{translate('history.cosignFormTitleRequireSignature')}</Text>
                </Section>
                <Section type="form-item">
                    <Button 
                        text={translate('history.cosignFormButtonContinue')} 
                        theme="dark" 
                        onPress={() => this.setState({
                            showLastWarning: true,
                            selectedTab: 'graphic'
                        })} 
                    />
                </Section>
                {/* <Section type="form-item">
                    <Button 
                        text={translate('history.cosignFormButtonMarkSpam')}  
                        theme="dark" 
                        onPress={() => this.setState({showBlacklistForm: true})} 
                    />
                </Section> */}
            </Section>
        }
        else if (showBlacklistForm) {
            return <Section type="form" style={styles.acceptanceForm}>
                    <Section type="form-item">
                        <TouchableOpacity onPress={() => this.setState({showBlacklistForm: false})}>
                            <Row align="center">
                                <Icon name="back_dark" size="small" style={{marginRight: 10}} />
                                <Text type="bold">{translate('history.cosignFormTitleBlacklist')}</Text>
                            </Row>
                        </TouchableOpacity>
                    </Section>
                    <Section type="form-item">
                    <Input 
                        value={blacklistAccountName} 
                        placeholder={translate('history.cosignFormInputNote')} 
                        theme="light" 
                        onChangeText={value => this.setState({blacklistAccountName: value})} 
                    />
                    </Section>
                    <Section type="form-item">
                        <Button 
                            text={translate('history.cosignFormButtonBlacklist')}  
                            theme="dark" 
                            onPress={() => this.setState({showLastWarning: false})} 
                        />
                    </Section>
                </Section>
        }
        else {
            return <FadeView style={styles.signFormContainer} style={{flex: 1}}>
                <RandomImage style={styles.randomImage} isContainer>
                    <Text style={styles.textCaution} type="title" theme="dark" align="center">{translate('history.caution')}</Text>
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
                                onChange={value => this.setState({userUnderstand: value})}
                            />
                        </Section>
                        <Section type="form-item">
                            <Button  
                                text={translate('history.cosignFormButtonReviewAgain')} 
                                theme="light" 
                                onPress={() => this.setState({
                                    showLastWarning: false, 
                                    expandGraphic: true,
                                    selectedTab: 'graphic'
                                })} 
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
            
        }
    }

    render() {
        const { isActive, showLastWarning, isLoading, selectedTab } = this.state;
        let Content = null;

        switch(selectedTab) {
            default:
            case 'innerTransactions':
                Content = this.renderTabInnerTransactions();
                break;
            case 'info':
                Content = this.renderTabInfo();
                break;
            case 'graphic':
                Content = this.renderTabGraphic();
                break;
        }
        
        return <SwipeablePanel 
            isActive={isActive}
            fullWidth
            openLarge
            onlyLarge
            onClose={() => this.onClose()}
            onPressCloseButton={() => this.onClose()}
            style={{backgroundColor: '#f3f4f8', height: '85%'}}
        >
                <TitleBar 
                    theme="light" 
                    title={translate('history.transactionDetails')} 
                    onClose={() => this.onClose()} 
                />
                {!showLastWarning && <Row style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'info' && styles.activeTab]}
                        onPress={() => this.setState({selectedTab: 'info'})}
                    >
                        <Text type="bold" theme="light">
                            {translate('history.infoTransactionTab')} 
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'graphic' && styles.activeTab]}
                        onPress={() => this.setState({selectedTab: 'graphic'})}
                    >
                        <Text type="bold" theme="light">
                            {translate('history.graphicTab')} 
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'innerTransactions' && styles.activeTab]}
                        onPress={() => this.setState({selectedTab: 'innerTransactions'})}
                    >
                        <Text type="bold" theme="light">
                            {translate('history.innerTransactionTab')} 
                        </Text>
                    </TouchableOpacity>
                </Row>}
                {!showLastWarning && Content}
                {this.needsSignature() && !isLoading && this.renderSign()}
        </SwipeablePanel>
    }
}

export default connect(state => ({
    selectedNode: state.network.selectedNetwork,
    isLoading: state.transfer.isLoading,
    selectedAccount: state.wallet.selectedAccount,
    isMultisig: state.account.isMultisig,
    network: state.network.selectedNetwork.type,
    address: state.account.selectedAccountAddress,
}))(AggregateTransactionDetails);