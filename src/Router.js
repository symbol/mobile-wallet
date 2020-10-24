import {Dimensions, Platform, View} from "react-native";
import {Provider} from 'react-redux';
import { Navigation } from 'react-native-navigation';
import {gestureHandlerRootHOC} from "react-native-gesture-handler";
import {TermsAndPrivacy} from "./screens/TermsAndPrivacy";
import {CreateOrImport} from "./screens/CreateOrImport";
import WalletName from "./screens/WalletName";
import store from "./redux/Store";
import React from "react";
import GenerateBackup from "./screens/GenerateBackup";
import ShowQRCode from "./screens/ShowQRCode";
import CreateQRPassword from "./screens/CreateQRPassword";
import Dashboard from "./screens/Dashboard";
import ImportOptions from "./screens/ImportOptions";
import EnterMnemonics from "./screens/EnterMnemonics";
import ScanQRCode from "@src/screens/ScanQRCode";
import WalletLoading from "@src/screens/WalletLoading";

export const BASE_SCREEN_NAME = 'com.nemgroup.wallet';
export const TERMS_AND_PRIVACY_SCREEN = `${BASE_SCREEN_NAME}.TERMS_AND_CONDITIONS`;
export const CREATE_OR_IMPORT_SCREEN = `${BASE_SCREEN_NAME}.CREATE_OR_IMPORT`;
export const WALLET_NAME_SCREEN = `${BASE_SCREEN_NAME}.WALLET_NAME`;
export const GENERATE_BACKUP_SCREEN = `${BASE_SCREEN_NAME}.GENERATE_BACKUP_SCREEN`;
export const CREATE_QR_PASSWORD = `${BASE_SCREEN_NAME}.CREATE_QR_PASSWORD`;
export const SHOW_QR_CODE_SCREEN = `${BASE_SCREEN_NAME}.SHOW_QR_CODE_SCREEN`;
export const IMPORT_OPTION_SCREEN = `${BASE_SCREEN_NAME}.IMPORT_OPTION_SCREEN`;
export const SCAN_QR_CODE_SCREEN = `${BASE_SCREEN_NAME}.SCAN_QR_CODE_SCREEN`;
export const ENTER_MNEMONICS_SCREEN = `${BASE_SCREEN_NAME}.ENTER_MNEMONICS_SCREEN`;
export const DASHBOARD_SCREEN = `${BASE_SCREEN_NAME}.DASHBOARD_SCREEN`;
export const WALLET_LOADING_SCREEN = `${BASE_SCREEN_NAME}.WALLET_LOADING_SCREEN`;

/**
 * Class to handle Routing between screens
 */
export class Router {
    static screens = [
        [TERMS_AND_PRIVACY_SCREEN, TermsAndPrivacy],
        [CREATE_OR_IMPORT_SCREEN, CreateOrImport],
        [WALLET_NAME_SCREEN, WalletName],
        [GENERATE_BACKUP_SCREEN, GenerateBackup],
        [CREATE_QR_PASSWORD, CreateQRPassword],
        [SHOW_QR_CODE_SCREEN, ShowQRCode],
        [IMPORT_OPTION_SCREEN, ImportOptions],
        [SCAN_QR_CODE_SCREEN, ScanQRCode],
        [ENTER_MNEMONICS_SCREEN, EnterMnemonics],
		[SHOW_QR_CODE_SCREEN, ShowQRCode],
		[DASHBOARD_SCREEN, Dashboard],
        [WALLET_LOADING_SCREEN, WalletLoading],
    ];

    static registerScreens() {
        function WrappedComponentWithStore(Component) {
            return function inject(props) {
                const EnhancedComponent = () => (
                    <Provider store={store}>
                        <Component {...props}/>
                    </Provider>
                );
                return <EnhancedComponent />;
            };
        }

        this.screens.forEach(([key, ScreenComponent]) =>
            Navigation.registerComponent(key, () => WrappedComponentWithStore(gestureHandlerRootHOC(ScreenComponent)))
        );
    }

    static goToTermsAndPrivacy(passProps, parentComponent?){
        return this.goToScreen(TERMS_AND_PRIVACY_SCREEN, passProps, parentComponent);
    }
    static goToCreateOrImport(passProps, parentComponent?){
        return this.goToScreen(CREATE_OR_IMPORT_SCREEN, passProps, parentComponent);
    }
    static goToWalletName(passProps, parentComponent?){
        return this.goToScreen(WALLET_NAME_SCREEN, passProps, parentComponent);
    }
    static goToGenerateBackup(passProps, parentComponent?){
        return this.goToScreen(GENERATE_BACKUP_SCREEN, passProps, parentComponent);
    }
    static goToCreateQRPassword(passProps, parentComponent?){
        return this.goToScreen(CREATE_QR_PASSWORD, passProps, parentComponent);
    }
    static goToShowQRCode(passProps, parentComponent?){
        return this.goToScreen(SHOW_QR_CODE_SCREEN, passProps, parentComponent);
	}
	static goToDashboard(passProps, parentComponent?){
        return this.goToScreen(DASHBOARD_SCREEN, passProps, parentComponent);
    }
    static goToImportOptions(passProps, parentComponent?){
        return this.goToScreen(IMPORT_OPTION_SCREEN, passProps, parentComponent);
    }
    static goToScanQRCode(passProps, parentComponent?){
        return this.goToScreen(SCAN_QR_CODE_SCREEN, passProps, parentComponent);
    }
    static goToEnterMnemonics(passProps, parentComponent?){
        return this.goToScreen(ENTER_MNEMONICS_SCREEN, passProps, parentComponent);
    }
    static goToWalletLoading(passProps, parentComponent?){
        return this.goToScreen(WALLET_LOADING_SCREEN, passProps, parentComponent);
    }

    static goToScreen(screen: string, passProps, parentComponent?){
        setDefaultNavOptions();
        if (parentComponent){
            return pushToStack(parentComponent, screen, passProps);
        } else {
            return newStack(screen, passProps);
        }
    };

    static goBack(componentId) {
        return goBack(componentId);
    }
}

/**
 * WIX default navigation options
 */
const setDefaultNavOptions = () => {
    Navigation.setDefaultOptions({
        layout: {
            orientation: ['portrait'],
        },
        topBar: {
            visible: false, // turn of toolbar visibility.
            drawBehind: false,
            height: 0,
        },
        statusBar: {
            drawBehind: true,
            translucent: true,
        },
        blurOnUnmount: true,
        animations: {
            setRoot: {
                waitForRender: true,
                alpha: {
                    from: 0,
                    to: 1,
                    duration: 300,
                },
            },
            push: {
                waitForRender: true,
            },
        },
        ...Platform.select({ ios: { sideMenu: { openGestureMode: 'bezel' } } }),
    });
};

/**
 * Create new stack
 * @param screen
 * @param passProps
 * @return {Promise<any>}
 */
const newStack = (screen: string, passProps) => {
    return Navigation.setRoot({
        root: {
            stack: {
                id: `_STACK_${screen}`,
                children: [
                    {
                        component: {
                            name: screen,
                            passProps: passProps,
                            options: {
                                statusBar: {
                                    drawBehind: true,
                                    translucent: true,
                                },
                                blurOnUnmount: true,
                            },
                        },
                    },
                ],
            },
        },
    });
};

/**
 * Push to stack
 * @param parent
 * @param screen
 * @param passProps
 * @return {Promise<any>}
 */
const pushToStack = (parent, screen: string, passProps) => {
    return Navigation.push(parent, {
        component: {
            name: screen,
            passProps,
            options: {
                bottomTabs: { visible: false, drawBehind: false, animate: true },
                sideMenu: {
                    left: { visible: false },
                },
                statusBar: {
                    drawBehind: true,
                    translucent: true,
                },
                blurOnUnmount: true,
            },
        },
    });
};

/**
 * Go back
 * @param component
 * @return {Promise<any>}
 */
const goBack = (component) => {
    return Navigation.pop(component);
};
