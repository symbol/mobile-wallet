import AccountService from '@src/services/AccountService';
import NamespaceService from '@src/services/NamespaceService';
import { of } from 'rxjs';
import { GlobalListener } from '@src/store/index';
import { Address, RepositoryFactoryHttp } from 'symbol-sdk';
import { catchError, map } from 'rxjs/operators';
import _ from 'lodash';

export default {
    namespace: 'account',
    state: {
        refreshingObs: null,
        selectedAccount: {},
        selectedAccountAddress: '',
        loading: true,
        balance: 0,
        isMultisig: false,
        ownedMosaics: [],
        accounts: [],
        cosignatoryOf: [],
        pendingSignature: false,
        multisigGraphInfo: [],
        names: [],
    },
    mutations: {
        setRefreshingObs(state, payload) {
            state.account.refreshingObs = payload;
            return state;
        },
        setSelectedAccountAddress(state, payload) {
            state.account.selectedAccountAddress = payload;
            return state;
        },
        setLoading(state, payload) {
            state.account.loading = payload;
            return state;
        },
        setBalance(state, payload) {
            state.account.balance = payload;
            return state;
        },
        setIsMultisig(state, payload) {
            state.account.isMultisig = payload;
            return state;
        },
        setOwnedMosaics(state, payload) {
            state.account.ownedMosaics = payload;
            return state;
        },
        setCosignatoryOf(state, payload) {
            state.account.cosignatoryOf = payload;
            return state;
        },
        setMultisigGraphInfo(state, payload) {
            state.account.multisigGraphInfo = payload;
            return state;
        },
        setNames(state, payload) {
            state.account.names = payload;
            return state;
        },
    },
    actions: {
        loadAllData: async ({ commit, dispatchAction, state }, reset) => {
            try {
                commit({ type: 'account/setLoading', payload: true });
                const address = AccountService.getAddressByAccountModelAndNetwork(state.wallet.selectedAccount, state.network.network);
                commit({
                    type: 'account/setSelectedAccountAddress',
                    payload: address,
                });
                await dispatchAction({ type: 'account/loadMultisigTree' });
                if (reset) {
                    await dispatchAction({ type: 'account/loadCosignatoryOf' });
                    commit({ type: 'account/setBalance', payload: 0 });
                    commit({ type: 'account/setOwnedMosaics', payload: [] });
                }
                await dispatchAction({ type: 'account/loadBalance' });
                await dispatchAction({ type: 'account/loadAccountNames' });
                await dispatchAction({ type: 'transaction/init' });
                if (state.account.refreshingObs) {
                    state.account.refreshingObs.unsubscribe();
                }
                dispatchAction({ type: 'harvesting/init' });
                commit({ type: 'account/setLoading', payload: false });
            } catch (e) {
                commit({ type: 'account/setLoading', payload: false });
                console.log(e);
            }
        },
        loadBalance: async ({ commit, state }) => {
            const address = await AccountService.getAddressByAccountModelAndNetwork(state.wallet.selectedAccount, state.network.network);
            const { balance, ownedMosaics } = await AccountService.getBalanceAndOwnedMosaicsFromAddress(
                address,
                state.network.selectedNetwork
            );
            commit({ type: 'account/setBalance', payload: balance });
            commit({ type: 'account/setOwnedMosaics', payload: ownedMosaics });
        },
        loadCosignatoryOf: async ({ commit, state }) => {
            const address = AccountService.getAddressByAccountModelAndNetwork(state.wallet.selectedAccount, state.network.network);
            const msigInfo = await AccountService.getCosignatoryOfByAddress(address, state.network.selectedNetwork);
            let multisigAccountGraph = state.account.multisigGraphInfo;

            // find account signers
            if (multisigAccountGraph !== undefined) {
                const accountSigners = AccountService.getSigners(Address.createFromRawAddress(address), multisigAccountGraph);
                let allSigners = [];
                accountSigners.forEach(signer => {
                    allSigners.push(signer.address.pretty());
                    signer.parentSigners.forEach(parent => {
                        allSigners.push(parent.address.pretty());
                        parent.parentSigners.forEach(topLevel => {
                            allSigners.push(topLevel.address.pretty());
                        });
                    });
                });
                allSigners = _.uniq(allSigners);
                allSigners.forEach(signer => {
                    if (!msigInfo.cosignatoryOf.some(cosignatory => cosignatory == signer) && signer !== address) {
                        msigInfo.cosignatoryOf.push(signer);
                    }
                });
            }
            for (let cosignatoryOf of msigInfo.cosignatoryOf) {
                GlobalListener.addConfirmed(cosignatoryOf, state.account.cosignatoryOf.length > 0);
                GlobalListener.addUnconfirmed(cosignatoryOf, state.account.cosignatoryOf.length > 0);
                GlobalListener.addPartial(cosignatoryOf, state.account.cosignatoryOf.length > 0);
            }
            commit({
                type: 'account/setCosignatoryOf',
                payload: msigInfo.cosignatoryOf,
            });
            commit({
                type: 'account/setIsMultisig',
                payload: msigInfo.isMultisig,
            });
        },
        // load multisig tree data
        loadMultisigTree: async ({ commit, state }) => {
            const address = AccountService.getAddressByAccountModelAndNetwork(state.wallet.selectedAccount, state.network.network);
            const repositoryFactory = new RepositoryFactoryHttp(state.network.selectedNode);
            const multisigRepo = repositoryFactory.createMultisigRepository();
            await multisigRepo
                .getMultisigAccountGraphInfo(Address.createFromRawAddress(address))
                .pipe(
                    map(g => {
                        commit({
                            type: 'account/setMultisigGraphInfo',
                            payload: g.multisigEntries,
                        });
                        return of(g);
                    }),
                    catchError(() => {
                        commit({
                            type: 'account/setMultisigGraphInfo',
                            payload: undefined,
                        });
                        return of([]);
                    })
                )
                .toPromise();
        },
        loadAccountNames: async ({ commit, state }) => {
            const address = Address.createFromRawAddress(
                AccountService.getAddressByAccountModelAndNetwork(state.wallet.selectedAccount, state.network.network)
            );
            const accountsNames = await NamespaceService.getAccountsNames([address], state.network.selectedNetwork);
            const currentAccountNames = accountsNames.find(accountNames => accountNames.address.equals(address));

            if (currentAccountNames) {
                const formattedCurrentAccountNames = currentAccountNames.names.map(namespace => namespace.name);
                commit({ type: 'account/setNames', payload: formattedCurrentAccountNames });
            }
        },
    },
};
