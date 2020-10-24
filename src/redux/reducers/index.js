import { combineReducers } from 'redux';
import { CreateWalletReducer } from "./CreateWalletReducer";
import { MainWalletReducer } from "./MainWalletReducer";

export default combineReducers({
    createWallet: CreateWalletReducer,
    mainWallet: MainWalletReducer
});
