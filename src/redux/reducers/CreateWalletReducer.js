import {SET_MNEMONIC_PASSPHRASE, SET_NAME, SET_PASSWORD} from "../actions/CreateWalletAction";

const initialState = {
    name: '',
    mnemonic: null,
    password: null,
};

export const CreateWalletReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_NAME:
            return {
                ...state,
                name: action.payload
            };
        case SET_MNEMONIC_PASSPHRASE:
            return {
                ...state,
                mnemonic: action.payload
            };
        case SET_PASSWORD:
            return {
                ...state,
                password: action.payload
            };
        default:
            return state
    }
};
