import { Address, Listener, RepositoryFactoryHttp } from 'symbol-sdk';
import type { NetworkModel } from '@src/storage/models/NetworkModel';
import { Router } from '@src/Router';
import store from '@src/store';
import translate from '@src/locales/i18n';
import { CommonHelpers } from '@src/utils/commonHelpers';

export default class ListenerService {
    network: NetworkModel;
    repositoryFactory: RepositoryFactoryHttp;
    listener: Listener;

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
        return this.listener
            .open(async (event: { client: string, code: any, reason: any }) => {
                if (event && event.code !== 1005) {
                    await CommonHelpers.retryNTimes(this.listener, 3, 5000);
                } else {
                    this.showMessage('ws_connection_failed', 'danger');
                }
            })
            .then(() => {
                console.log('Listening ' + address.plain());

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
                    store.dispatchAction({
                        type: 'network/updateChainHeight',
                        payload: block.height.compact(),
                    });
                });
            });
    };

    addConfirmed = (rawAddress: string, isMultisig: boolean) => {
        console.log('Adding confirmed listener: ' + rawAddress);
        const address = Address.createFromRawAddress(rawAddress);
        this.listener
            .confirmed(address, undefined, isMultisig)
            //.pipe(filter(transaction => transaction.transactionInfo !== undefined))
            .subscribe(() => {
                this.showMessage(translate('notification.newConfirmed'), 'success');
                store.dispatchAction({ type: 'account/loadAllData' });
            });
    };

    addUnconfirmed = (rawAddress: string, isMultisig: boolean) => {
        console.log('Adding unconfirmed listener: ' + rawAddress);
        const address = Address.createFromRawAddress(rawAddress);
        this.listener
            .unconfirmedAdded(address, undefined, isMultisig)
            //.pipe(filteser(transaction => transaction.transactionInfo !== undefined))
            .subscribe(() => {
                this.showMessage(translate('notification.newUnconfirmed'), 'warning');
                store.dispatchAction({ type: 'account/loadAllData' });
            });
    };

    addPartial = (rawAddress: string, isMultisig: boolean) => {
        console.log('Adding unconfirmed listener: ' + rawAddress);
        const address = Address.createFromRawAddress(rawAddress);
        this.listener.aggregateBondedAdded(address, undefined, isMultisig).subscribe(() => {
            this.showMessage(translate('notification.newAggregate'), 'warning');
            store.dispatchAction({ type: 'account/loadAllData' });
        });
    };

    showMessage = (message: string, type: 'danger' | 'warning' | 'success' = 'success') => {
        Router.showMessage({
            message: message,
            type: type,
        });
    };
}
