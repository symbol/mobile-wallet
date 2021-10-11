import React, { Component } from 'react';
import { 
    Text, 
    Row, 
    Button, 
    ListItem,
    ListContainer,
    TitleBar,
    SwipeablePanel, 
    FadeView,
    LinkExplorer
} from '@src/components';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
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
        selectedTab: 'innerTransactions'
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
        if (this.isPostLaunchOptIn()) return false;
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
        }
        
        return <SwipeablePanel 
            isActive={isActive}
            fullWidth
            openLarge
            onlyLarge
            onClose={() => this.onClose()}
            onPressCloseButton={() => this.onClose()}
            style={{backgroundColor: '#f3f4f8', height: '80%'}}
        >
                <TitleBar 
                    theme="light" 
                    title={translate('history.transactionDetails')} 
                    onBack={() => this.onClose()} 
                />
                <Row style={styles.tabs}>
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
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'info' && styles.activeTab]}
                        onPress={() => this.setState({selectedTab: 'info'})}
                    >
                        <Text type="bold" theme="light">
                            {translate('history.infoTransactionTab')} 
                        </Text>
                    </TouchableOpacity>
                </Row>
                {/* {this.state.raw&&<Text theme="light">
                    {JSON.stringify(this.state.raw)}
                </Text>} */}
                {Content}
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
