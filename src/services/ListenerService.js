import { Address, IListener, RepositoryFactoryHttp } from 'symbol-sdk';
import type { AccountModel } from '@src/storage/models/AccountModel';
import type { NetworkModel } from '@src/storage/models/NetworkModel';
import AccountService from '@src/services/AccountService';
import { showMessage } from 'react-native-flash-message';
import { Router } from '@src/Router';
import store from '@src/store';
import translate from '@src/locales/i18n';

export default class ListenerService {
    network: NetworkModel;
    repositoryFactory: RepositoryFactoryHttp;
    listener: IListener;

    setNetwork = (network: NetworkModel) => {
        if (this.listener) {
            this.listener.close();
        }
        this.network = network;
        this.repositoryFactory = new RepositoryFactoryHttp(network.node, {
            websocketInjected: WebSocket,
        });
        this.listener = this.repositoryFactory.createListener();
    };

    listen = (rawAddress: string) => {
        if (this.listener) {
            this.listener.close();
        }
        this.listener = this.repositoryFactory.createListener();
        const address = Address.createFromRawAddress(rawAddress);
        return this.listener.open().then(() => {
            console.log('Listening ' + address.pretty());

            this.addConfirmed(rawAddress);
            this.addUnconfirmed(rawAddress);

            this.listener
                .aggregateBondedAdded(address)
                //.pipe(filteser(transaction => transaction.transactionInfo !== undefined))
                .subscribe(() => {
                    this.showMessage(translate('notification.newAggregate'), 'success');
                    store.dispatchAction({ type: 'account/loadAllData' });
                });

            this.listener.status(address).subscribe(error => {
                this.showMessage(error.code, 'danger');
                store.dispatchAction({ type: 'account/loadAllData' });
            });

            this.listener.newBlock().subscribe(block => {
                store.dispatchAction({ type: 'network/updateChainHeight', payload: block.height.compact() });
            });
        });
    };

    addConfirmed = (rawAddress: string) => {
        console.log('Adding confirmed listener: ' + rawAddress);
        const address = Address.createFromRawAddress(rawAddress);
        this.listener
            .confirmed(address)
            //.pipe(filter(transaction => transaction.transactionInfo !== undefined))
            .subscribe(() => {
                this.showMessage(translate('notification.newConfirmed'), 'success');
                store.dispatchAction({ type: 'account/loadAllData' });
            });
    };

    addUnconfirmed = (rawAddress: string) => {
        console.log('Adding unconfirmed listener: ' + rawAddress);
        const address = Address.createFromRawAddress(rawAddress);
        this.listener
            .unconfirmedAdded(address)
            //.pipe(filteser(transaction => transaction.transactionInfo !== undefined))
            .subscribe(() => {
                this.showMessage(translate('notification.newUnconfirmed'), 'warning');
                store.dispatchAction({ type: 'account/loadAllData' });
            });
    };

    showMessage = (message: string, type: 'danger' | 'warning' | 'success' = 'success') => {
        Router.showFlashMessageOverlay().then(() => {
            showMessage({
                message: message,
                type: type,
            });
        });
    };
}
