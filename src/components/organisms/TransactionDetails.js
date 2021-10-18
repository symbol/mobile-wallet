import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet,Image, TouchableOpacityBase } from 'react-native';
import { 
    Text, 
    Row, 
    Button, 
    ListItem,
    ListContainer,
    TitleBar,
    SwipeablePanel, 
    FadeView,
    LinkExplorer,
    Section,
    RandomImage,
    Checkbox,
    Input,
    Icon
} from '@src/components';
import TransactionGraphic from '@src/components/transaction-graphic/TransactionGraphic';
import type { AggregateTransactionModel } from '@src/storage/models/TransactionModel';
// import { SwipeablePanel } from 'rn-swipeable-panel';
import { connect } from 'react-redux';
import { getPublicKeyFromPrivateKey } from '@src/utils/account';
import store from '@src/store';
import TableView from '@src/components/organisms/TableView';
import { showPasscode } from '@src/utils/passcode';
import translate from '@src/locales/i18n';
import TransactionService from '@src/services/TransactionService';
import FetchTransactionService from '@src/services/FetchTransactionService';
import { FormatTransaction } from '@src/services/FormatTransaction';
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
        height: 60,
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

class TransactionDetails extends Component<Props, State> {
    state = {
        fullTransaction: null,
        raw: null,
        isActive: false,
        isLoading: false,
        isWhitelisted: false,
        userUnderstand: false,
        userWishToBlacklist: false,
        blacklistAccountName: '',
        selectedTab: 'info'
    };

    componentDidMount() {
        this.setState({
            isActive: true,
            isLoading: true,
            fullTransaction: null
        })

        this.fetchTransactionDetails()
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

    async fetchTransactionDetails() {
        const { selectedNode, transaction } = this.props;
        const rawTransactionDetails = await TransactionService.getTransaction(transaction.hash, selectedNode);
        rawTransactionDetails.hash = transaction.hash;
        const preLoadedMosaics = await FetchTransactionService._preLoadMosaics(rawTransactionDetails.innerTransactions, selectedNode);
        
        return FormatTransaction.format(rawTransactionDetails, selectedNode, preLoadedMosaics);
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
        return !isMultisig && transaction.cosignaturePublicKeys.indexOf(accountPubKey) === -1 && transaction.status !== 'confirmed';
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

    renderTransactionGraphicItem({index, item}) {
        return <ListItem><TransactionGraphic {...item} /></ListItem>
        
    }

    renderInnerTransactionTable() {
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

    renderGraphic() {
        const { isLoading, fullTransaction } = this.state;

        return <FadeView style={{ flex: 1 }}>
            <ListContainer isScrollable={false} isLoading={isLoading || !fullTransaction} style={{flex: 1}}>
                {fullTransaction && <FlatList
                    data={fullTransaction.innerTransactions}
                    renderItem={this.renderTransactionGraphicItem}
                    keyExtractor={(item, index) => '' + index + 'details'}
                    contentContainerStyle={{ flexGrow: 1 }}
                />}
                </ListContainer>
        </FadeView>
    }

    renderInfo() {
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
        const { isWhitelisted, userUnderstand, userWishToBlacklist, blacklistAccountName } = this.state;

        if (!isWhitelisted && !userWishToBlacklist) {
            return <Section type="form" style={styles.acceptanceForm}>
                <Section type="form-item">
                    <Text type="bold">Transaction requires signature. Do you trust the signatory of this transaction?</Text>
                </Section>
                <Section type="form-item">
                    <Button 
                        text={'Accept'} 
                        theme="dark" 
                        onPress={() => this.setState({
                            isWhitelisted: true,
                            selectedTab: 'innerTransactions'
                        })} 
                    />
                </Section>
                <Section type="form-item">
                    <Button 
                        text={'Reject'} 
                        theme="dark" 
                        onPress={() => this.setState({userWishToBlacklist: true})} 
                    />
                </Section>
            </Section>
        }
        else if (userWishToBlacklist) {
            return <Section type="form" style={styles.acceptanceForm}>
                    <Section type="form-item">
                        <TouchableOpacity onPress={() => this.setState({userWishToBlacklist: false})}>
                            <Row align="center">
                                <Icon name="back_dark" size="small" style={{marginRight: 10}} />
                                <Text type="bold">Blacklist this address?</Text>
                            </Row>
                        </TouchableOpacity>
                    </Section>
                    <Section type="form-item">
                    <Input 
                        value={blacklistAccountName} 
                        placeholder={'Note'} 
                        theme="light" 
                        onChangeText={value => this.setState({blacklistAccountName: value})} 
                    />
                    </Section>
                    <Section type="form-item">
                        <Button 
                            text={'Blacklist'} 
                            theme="dark" 
                            onPress={() => this.setState({isWhitelisted: false})} 
                        />
                    </Section>
                </Section>
        }
        else {
            return <FadeView style={styles.signFormContainer}>
                <RandomImage style={styles.randomImage} isContainer>
                    <Text style={styles.textCaution} type="title" theme="dark" align="center">CAUTION</Text>
                </RandomImage>
                <Section type="form" style={styles.signForm}>
                    <Section type="form-item">
                        <Text type="bold">You are about to sign this transaction. Please review carefully. Sign it only if you understand it. Otherwise, it can lead to the loss of all of your funds.</Text>
                    </Section>
                    <Section type="form-item">
                        <Checkbox
                            value={userUnderstand}
                            title={'I understand'}
                            theme="dark"
                            onChange={value => this.setState({userUnderstand: value})}
                        />
                    </Section>
                    <Section type="form-item">
                        <Button  
                            isDisabled={!userUnderstand} 
                            text={translate('plugin.send')} 
                            theme="light" 
                            onPress={() => this.sign()} 
                        /> 
                    </Section>
                </Section>
            </FadeView>
            
        }
    }

    render() {
        const { isActive, isLoading, fullTransaction, selectedTab } = this.state;
        let Content = null;

        switch(selectedTab) {
            default:
            case 'innerTransactions':
                Content = this.renderInnerTransactionTable();
                break;
            case 'info':
                Content = this.renderInfo();
                break;
            case 'graphic':
                Content = this.renderGraphic();
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
                    onBack={() => this.onClose()} 
                />
                <Row style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'info' && styles.activeTab]}
                        onPress={() => this.setState({selectedTab: 'info'})}
                    >
                        <Text type="bold" theme="light">
                            {translate('history.infoTransactionTab')} 
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
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'graphic' && styles.activeTab]}
                        onPress={() => this.setState({selectedTab: 'graphic'})}
                    >
                        <Text type="bold" theme="light">
                            {translate('history.graphicTab')} 
                        </Text>
                    </TouchableOpacity>
                    
                </Row>
                {Content}
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
}))(TransactionDetails);
