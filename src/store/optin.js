import OptInService from '@src/services/OptInService';

export default {
    namespace: 'optin',
    state: {
        nis1Accounts: [],
        nisAddressOptInBalance: {},
        selectedNIS1Account: null,
        optinAddresses: [],
        selectedNIS1MultisigAccount: null,
        selectedOptInStatus: {
            isMultisig: undefined,
            balance: undefined,
            status: undefined,
            error: undefined,
            destination: undefined,
        },
        selectedSymbolAccount: null,
        selectedMultisigDestinationAccount: null,
        error: null,
        loading: true,
    },
    mutations: {
        setNisAddressOptInBalance(state, payload) {
            state.optin.nisAddressOptInBalance = payload;
            return state;
        },
        setNisAccounts(state, payload) {
            state.optin.nis1Accounts = payload;
            return state;
        },
        setOptinAddresses(state, payload) {
            state.optin.optinAddresses = payload;
            return state;
        },
        setSelectedNIS1MultisigAccount(state, payload) {
            state.optin.selectedNIS1MultisigAccount = payload;
            return state;
        },
        setSelectedMultisigDestinationAccount(state, payload) {
            state.optin.selectedMultisigDestinationAccount = payload;
            return state;
        },
        setLoading(state, payload) {
            state.optin.loading = payload;
            return state;
        },
        setError(state, payload) {
            state.optin.error = payload;
            return state;
        },
        setSelectedNIS1Account(state, payload) {
            state.optin.selectedNIS1Account = payload;
            return state;
        },
        setSelectedOptInStatus(state, payload) {
            state.optin.selectedOptInStatus = payload;
            return state;
        },
        setSelectedSymbolAccount(state, payload) {
            state.optin.selectedSymbolAccount = payload;
            return state;
        },
    },
    actions: {
        load: async ({ commit, dispatchAction, state }, payload) => {
            commit({ type: 'optin/setError', payload: null });
            commit({ type: 'optin/setLoading', payload: true });
            const nis1Accounts = await OptInService.getNISAccounts(state.network.selectedNetwork.type);
            commit({ type: 'optin/setNisAccounts', payload: nis1Accounts });
            commit({ type: 'optin/setLoading', payload: false });
        },
        addPrivateKey: async ({ commit, dispatchAction, state }, payload) => {
            await OptInService.addNISAccount(payload);
            await dispatchAction({ type: 'optin/load' });
        },
        removeNIS1Account: async ({ commit, dispatchAction, state }, payload) => {
            await OptInService.removeNIS1Account(payload);
            await dispatchAction({ type: 'optin/load' });
        },
        loadNIS1Account: async ({ commit, state }, payload) => {
            commit({ type: 'optin/setLoading', payload: true });
            commit({ type: 'optin/setError', payload: null });
            const selectedAccount = state.optin.nis1Accounts[payload];
            commit({ type: 'optin/setSelectedNIS1Account', payload: selectedAccount });
            commit({ type: 'optin/setSelectedNIS1MultisigAccount', payload: null });
            const accountData = await OptInService.fetchNIS1Data(selectedAccount.address, state.network.selectedNetwork.type);
            if (accountData.meta.cosignatories.length > 0) {
                commit({ type: 'optin/setLoading', payload: false });
                commit({ type: 'optin/setError', payload: 'This account is multisig, in order to do multisig opt-in you must use the cosigner accounts' });
                return false;
            }
            const optinAddresses = [selectedAccount.address, ...accountData.meta.cosignatoryOf.map(data => data.address)];
            commit({ type: 'optin/setOptinAddresses', payload: optinAddresses });
            const optinData = await OptInService.getOptInStatus(selectedAccount.address, state.network.selectedNetwork.type);
            commit({ type: 'optin/setSelectedOptInStatus', payload: optinData });
            commit({ type: 'optin/setLoading', payload: false });
            return true;
        },
        loadNIS1MultisigAccount: async ({ commit, state }, payload) => {
            commit({ type: 'optin/setLoading', payload: true });
            commit({ type: 'optin/setError', payload: null });
            commit({ type: 'optin/setSelectedNIS1MultisigAccount', payload: payload });
            const optinData = await OptInService.getOptInStatus(payload, state.network.selectedNetwork.type);
            commit({ type: 'optin/setSelectedMultisigDestinationAccount', payload: optinData.destination });
            commit({ type: 'optin/setSelectedOptInStatus', payload: optinData });
            commit({ type: 'optin/setLoading', payload: false });
        },
        doOptIn: async ({ commit, state }, payload) => {
            commit({ type: 'optin/setLoading', payload: true });
            try {
                if (state.optin.selectedOptInStatus.isMultisig) {
                    const accountData = await OptInService.fetchNIS1Data(state.optin.selectedNIS1MultisigAccount, state.network.selectedNetwork.type);
                    const nis1MultisigPublicKey = accountData.account.publicKey;
                    const multisigDestinationPublicKey = state.optin.selectedMultisigDestinationAccount;
                    const cosignerDestinationPublicKey = state.optin.selectedSymbolAccount.id;
                    const nis1CosignerPrivateKey = state.optin.selectedNIS1Account;
                    await OptInService.doMultisigOptIn(
                        nis1MultisigPublicKey,
                        multisigDestinationPublicKey,
                        cosignerDestinationPublicKey,
                        nis1CosignerPrivateKey.privateKey,
                        state.network.selectedNetwork.type
                    );
                } else {
                    await OptInService.doSimpleOptIn(state.optin.selectedNIS1Account, state.optin.selectedSymbolAccount, state.network.selectedNetwork.type);
                }
                commit({ type: 'optin/setError', payload: null });
            } catch (e) {
                commit({ type: 'optin/setError', payload: e.toString() });
            }
            commit({ type: 'optin/setLoading', payload: false });
        },
    },
};
