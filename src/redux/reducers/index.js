import { combineReducers } from 'redux';
import { CreateWalletReducer } from "./CreateWalletReducer";

export default combineReducers({
    createWallet: CreateWalletReducer
});
