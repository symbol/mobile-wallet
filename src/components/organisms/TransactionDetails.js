import React, { Component } from 'react';
import { 
    Text, 
    Row, 
    Button, 
    ListItem,
    ListContainer,
    TitleBar,
    SwipeablePanel
} from '@src/components';
import { View, FlatList } from 'react-native';
import type { AggregateTransactionModel } from '@src/storage/models/TransactionModel';
// import { SwipeablePanel } from 'rn-swipeable-panel';
import { connect } from 'react-redux';
import { getPublicKeyFromPrivateKey } from '@src/utils/account';
import store from '@src/store';
import TableView from '@src/components/organisms/TableView';
import { showPasscode } from '@src/utils/passcode';
import translate from '@src/locales/i18n';
import TransactionService from '@src/services/TransactionService';
import { FormatTransaction } from '@src/services/FormatTransaction';

type Props = {
    transaction: AggregateTransactionModel,
};

class TransactionDetails extends Component<Props, State> {
    state = {
        fullTransaction: null,
        isActive: false,
        isLoading: false
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
                isLoading: false
            })
        });
    }

    async fetchTransactionDetails() {
        const { selectedNode, transaction } = this.props;

        //try {
            const rawTransactionDetails = await TransactionService.getTransaction(transaction.hash, selectedNode);
            let formattedInnerTransactions = [];

            for (const innerTransaction of rawTransactionDetails.innerTransactions) {
                formattedInnerTransactions.push(await FormatTransaction.format(innerTransaction));
            }

            return formattedInnerTransactions;
        // }
        // catch(e) {
        //     throw e;
        // }
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

    render() {
        const { transaction } = this.props;
        const { isActive, isLoading, fullTransaction } = this.state;
        
        return <SwipeablePanel 
            isActive={isActive}
            fullWidth
            openLarge
            onlyLarge
            onClose={() => this.onClose()}
            onPressCloseButton={() => this.onClose()}
            style={{backgroundColor: '#f3f4f8'}}
        >
                <TitleBar 
                    theme="light" 
                    title={translate('history.title')} 
                    onBack={() => this.onClose()} 
                />
                <View style={{ flex: 1 }}>
                <ListContainer isScrollable={false} isLoading={isLoading}>
                    <FlatList
                        data={fullTransaction}
                        renderItem={this.renderTransactionItem}
                        keyExtractor={(item, index) => '' + index + 'details'}
                        contentContainerStyle={{ flexGrow: 1 }}
                    />
                    </ListContainer>
                </View>
            {/* </View> */}
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
