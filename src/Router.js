import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { TermsAndPrivacy } from './screens/TermsAndPrivacy';
import { CreateOrImport } from './screens/CreateOrImport';
import WalletName from './screens/WalletName';
import React from 'react';
import store from '@src/store';
import GenerateBackup from './screens/GenerateBackup';
import ShowQRCode from './screens/ShowQRCode';
import Dashboard from './screens/Dashboard';
import ImportOptions from './screens/ImportOptions';
import EnterMnemonics from './screens/EnterMnemonics';
import ScanQRCode from '@src/screens/ScanQRCode';
import WalletLoading from '@src/screens/WalletLoading';
import VerifyMnemonics from './screens/VerifyMnemonics';
import ShowMnemonics from './screens/ShowMnemonics';
import Settings from '@src/screens/Settings';
import Passcode from '@src/screens/Passcode';
import Send from '@src/screens/Send';
import ConfirmTransaction from '@src/screens/ConfirmTransaction';
import Harvest from '@src/screens/Harvest';
import AddressBook from '@src/screens/AddressBook';
import AddContact from '@src/screens/AddContact';
import ContactProfile from '@src/screens/ContactProfile';
import AccountDetails from '@src/screens/AccountDetails';
import CreateAccount from '@src/screens/CreateAccount';
import Receive from '@src/screens/Receive';
import QRScanner from '@src/screens/QRScanner';
import ScanGenericQRCode from '@src/screens/ScanGenericQRCode';
import CustomFlashMessage from '@src/components/organisms/CustomFlashMessage';
import { showMessage } from 'react-native-flash-message';
import LinkedKeysDetails from '@src/screens/LinkedKeysDetails';

export const BASE_SCREEN_NAME = 'com.nemgroup.wallet';
export const CUSTOM_FLASH_MESSAGE = `${BASE_SCREEN_NAME}.CUSTOM_FLASH_MESSAGE`;
export const TERMS_AND_PRIVACY_SCREEN = `${BASE_SCREEN_NAME}.TERMS_AND_CONDITIONS`;
export const CREATE_OR_IMPORT_SCREEN = `${BASE_SCREEN_NAME}.CREATE_OR_IMPORT`;
export const WALLET_NAME_SCREEN = `${BASE_SCREEN_NAME}.WALLET_NAME`;
export const GENERATE_BACKUP_SCREEN = `${BASE_SCREEN_NAME}.GENERATE_BACKUP_SCREEN`;
export const CREATE_QR_PASSWORD = `${BASE_SCREEN_NAME}.CREATE_QR_PASSWORD`;
export const SHOW_QR_CODE_SCREEN = `${BASE_SCREEN_NAME}.SHOW_QR_CODE_SCREEN`;
export const IMPORT_OPTION_SCREEN = `${BASE_SCREEN_NAME}.IMPORT_OPTION_SCREEN`;
export const SCAN_QR_CODE_SCREEN = `${BASE_SCREEN_NAME}.SCAN_QR_CODE_SCREEN`;
export const SCAN_GENERIC_QR_CODE_SCREEN = `${BASE_SCREEN_NAME}.SCAN_GENERIC_QR_CODE_SCREEN`;
export const ENTER_MNEMONICS_SCREEN = `${BASE_SCREEN_NAME}.ENTER_MNEMONICS_SCREEN`;
export const DASHBOARD_SCREEN = `${BASE_SCREEN_NAME}.DASHBOARD_SCREEN`;
export const VERIFY_MNEMONICS_SCREEN = `${BASE_SCREEN_NAME}.VERIFY_MNEMONICS_SCREEN`;
export const SHOW_MNEMONICS_SCREEN = `${BASE_SCREEN_NAME}.SHOW_MNEMONICS_SCREEN`;
export const WALLET_LOADING_SCREEN = `${BASE_SCREEN_NAME}.WALLET_LOADING_SCREEN`;
export const SETTINGS_SCREEN = `${BASE_SCREEN_NAME}.SETTINGS_SCREEN`;
export const PASSCODE_SCREEN = `${BASE_SCREEN_NAME}.PASSCODE_SCREEN`;
export const START_HARVESTING_SCREEN = `${BASE_SCREEN_NAME}.START_HARVESTING_SCREEN`;
export const CREATE_REMOTE_ACCOUNT_SCREEN = `${BASE_SCREEN_NAME}.CREATE_REMOTE_ACCOUNT_SCREEN`;
export const SEND_SCREEN = `${BASE_SCREEN_NAME}.SEND_SCREEN`;
export const RECEIVE_SCREEN = `${BASE_SCREEN_NAME}.RECEIVE_SCREEN`;
export const CONFIRM_TRANSACTION_SCREEN = `${BASE_SCREEN_NAME}.CONFIRM_TRANSACTION_SCREEN`;
export const HARVEST_SCREEN = `${BASE_SCREEN_NAME}.HARVEST_SCREEN`;
export const ADDRESS_BOOK_SCREEN = `${BASE_SCREEN_NAME}.ADDRESS_BOOK_SCREEN`;
export const ADD_CONTACT_SCREEN = `${BASE_SCREEN_NAME}.ADD_CONTACT_SCREEN`;
export const CONTACT_PROFILE_SCREEN = `${BASE_SCREEN_NAME}.CONTACT_PROFILE_SCREEN`;
export const ACCOUNT_DETAILS_SCREEN = `${BASE_SCREEN_NAME}.ACCOUNT_DETAILS_SCREEN`;
export const CREATE_ACCOUNT_SCREEN = `${BASE_SCREEN_NAME}.CREATE_ACCOUNT_SCREEN`;
export const QR_SCANNER_SCREEN = `${BASE_SCREEN_NAME}.QR_SCANNER_SCREEN`;
export const SHOW_LINKED_KEYS_SCREEN = `${BASE_SCREEN_NAME}.SHOW_LINKED_KEYS_SCREEN`;

interface MessageProps {
    message: string;
    type: 'danger' | 'warning' | 'success';
}
/**
 * Class to handle Routing between screens
 */
export class Router {
    static screens = [
        [TERMS_AND_PRIVACY_SCREEN, TermsAndPrivacy],
        [CREATE_OR_IMPORT_SCREEN, CreateOrImport],
        [WALLET_NAME_SCREEN, WalletName],
        [GENERATE_BACKUP_SCREEN, GenerateBackup],
        [SHOW_QR_CODE_SCREEN, ShowQRCode],
        [IMPORT_OPTION_SCREEN, ImportOptions],
        [SCAN_QR_CODE_SCREEN, ScanQRCode],
        [SCAN_GENERIC_QR_CODE_SCREEN, ScanGenericQRCode],
        [ENTER_MNEMONICS_SCREEN, EnterMnemonics],
        [DASHBOARD_SCREEN, Dashboard],
        [VERIFY_MNEMONICS_SCREEN, VerifyMnemonics],
        [SHOW_MNEMONICS_SCREEN, ShowMnemonics],
        [WALLET_LOADING_SCREEN, WalletLoading],
        [SETTINGS_SCREEN, Settings],
        [PASSCODE_SCREEN, Passcode],
        [WALLET_LOADING_SCREEN, WalletLoading],
        [SEND_SCREEN, Send],
        [CONFIRM_TRANSACTION_SCREEN, ConfirmTransaction],
        [HARVEST_SCREEN, Harvest],
        [ADDRESS_BOOK_SCREEN, AddressBook],
        [ADD_CONTACT_SCREEN, AddContact],
        [RECEIVE_SCREEN, Receive],
        [CONFIRM_TRANSACTION_SCREEN, ConfirmTransaction],
        [HARVEST_SCREEN, Harvest],
        [ACCOUNT_DETAILS_SCREEN, AccountDetails],
        [CREATE_ACCOUNT_SCREEN, CreateAccount],
        [CONTACT_PROFILE_SCREEN, ContactProfile],
        [QR_SCANNER_SCREEN, QRScanner],
        [SHOW_LINKED_KEYS_SCREEN, LinkedKeysDetails],
    ];

    static registerScreens() {
        function WrappedComponentWithStore(Component) {
            return function inject(props) {
                const EnhancedComponent = () => (
                    <Provider store={store}>
                        <Component {...props} />
                    </Provider>
                );
                return <EnhancedComponent />;
            };
        }

        Router.screens.forEach(([key, ScreenComponent]) =>
            Navigation.registerComponent(key, () => WrappedComponentWithStore(gestureHandlerRootHOC(ScreenComponent)))
        );

        Navigation.registerComponent(CUSTOM_FLASH_MESSAGE, () => CustomFlashMessage);
    }

    static goToTermsAndPrivacy(passProps, parentComponent?) {
        return Router.goToScreen(TERMS_AND_PRIVACY_SCREEN, passProps, parentComponent);
    }
    static goToCreateOrImport(passProps, parentComponent?) {
        return Router.goToScreen(CREATE_OR_IMPORT_SCREEN, passProps, parentComponent);
    }
    static goToWalletName(passProps, parentComponent?) {
        return Router.goToScreen(WALLET_NAME_SCREEN, passProps, parentComponent);
    }
    static goToGenerateBackup(passProps, parentComponent?) {
        return Router.goToScreen(GENERATE_BACKUP_SCREEN, passProps, parentComponent);
    }
    static goToShowQRCode(passProps, parentComponent?) {
        return Router.goToScreen(SHOW_QR_CODE_SCREEN, passProps, parentComponent);
    }
    static goToDashboard(passProps, parentComponent?) {
        return Router.goToScreen(DASHBOARD_SCREEN, passProps, parentComponent);
    }
    static goToVerifyMnemonics(passProps, parentComponent?) {
        return Router.goToScreen(VERIFY_MNEMONICS_SCREEN, passProps, parentComponent);
    }
    static goToShowMnemonics(passProps, parentComponent?) {
        return Router.goToScreen(SHOW_MNEMONICS_SCREEN, passProps, parentComponent);
    }
    static goToImportOptions(passProps, parentComponent?) {
        return Router.goToScreen(IMPORT_OPTION_SCREEN, passProps, parentComponent);
    }
    static goToScanQRCode(passProps, parentComponent?) {
        return Router.goToScreen(SCAN_QR_CODE_SCREEN, passProps, parentComponent);
    }
    static goToEnterMnemonics(passProps, parentComponent?) {
        return Router.goToScreen(ENTER_MNEMONICS_SCREEN, passProps, parentComponent);
    }
    static goToWalletLoading(passProps, parentComponent?) {
        return Router.goToScreen(WALLET_LOADING_SCREEN, passProps, parentComponent);
    }
    static goToConfirmTransaction(passProps, parentComponent?) {
        return Router.goToScreen(CONFIRM_TRANSACTION_SCREEN, passProps, parentComponent);
    }
    static goToSettings(passProps, parentComponent?) {
        return Router.goToScreen(SETTINGS_SCREEN, passProps, parentComponent);
    }
    static showPasscode(passProps, parentComponent?) {
        return Router.goToScreen(PASSCODE_SCREEN, passProps, parentComponent);
    }
    static goToHarvest(passProps, parentComponent?) {
        return Router.goToScreen(HARVEST_SCREEN, passProps, parentComponent);
    }
    static goToAccountDetails(passProps, parentComponent?) {
        return Router.goToScreen(ACCOUNT_DETAILS_SCREEN, passProps, parentComponent);
    }
    static goToCreateAccount(passProps, parentComponent?) {
        return Router.goToScreen(CREATE_ACCOUNT_SCREEN, passProps, parentComponent);
    }
    static scanQRCode(onRead, onClose) {
        const onCloseCallback = typeof onClose === 'function' ? onClose : () => {};
        showOverlay(SCAN_GENERIC_QR_CODE_SCREEN, {
            onRead,
            onClose: onCloseCallback,
        });
    }
    static goToAddressBook(passProps, parentComponent?) {
        return Router.goToScreen(ADDRESS_BOOK_SCREEN, passProps, parentComponent);
    }
    static goToAddContact(passProps, parentComponent?) {
        return Router.goToScreen(ADD_CONTACT_SCREEN, passProps, parentComponent);
    }
    static goToContactProfile(passProps, parentComponent?) {
        return Router.goToScreen(CONTACT_PROFILE_SCREEN, passProps, parentComponent);
    }
    static goToSend(passProps, parentComponent?) {
        return Router.goToScreen(SEND_SCREEN, passProps, parentComponent);
    }
    static goToShowLinkedKeys(passProps, parentComponent?) {
        return Router.goToScreen(SHOW_LINKED_KEYS_SCREEN, passProps, parentComponent);
    }

    static goToScreen(screen: string, passProps, parentComponent?) {
        setDefaultNavOptions();
        if (parentComponent) {
            return pushToStack(parentComponent, screen, passProps);
        } else {
            return newStack(screen, passProps);
        }
    }

    static popTo(componentId) {
        return Navigation.popTo(componentId);
    }

    static goBack(componentId) {
        return goBack(componentId);
    }

    static closeOverlay(componentId) {
        Navigation.dismissOverlay(componentId);
    }

    static showFlashMessageOverlay = (): Promise<any> => showOverlay(CUSTOM_FLASH_MESSAGE, {});

    static showMessage = (props: MessageProps) => {
        Router.showFlashMessageOverlay().then(() => {
            showMessage({
                message: props.message,
                type: props.type || 'success',
                duration: props.type === 'danger' ? 6000 : 3000,
            });
        });
    };
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
                alpha: {
                    from: 0,
                    to: 1,
                    duration: 300,
                },
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
            passProps: passProps,
            options: {
                bottomTabs: {
                    visible: false,
                    drawBehind: false,
                    animate: true,
                },
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
const goBack = component => {
    return Navigation.pop(component);
};

/**
 * WIX navigation Overlay
 * @param screen
 * @param passProps
 */
const showOverlay = (screen, passProps) => {
    return Navigation.showOverlay({
        component: {
            name: screen,
            passProps: { ...passProps },
            options: {
                overlay: {
                    interceptTouchOutside: false,
                },
                layout: {
                    backgroundColor: 'transparent',
                    componentBackgroundColor: 'transparent',
                    orientation: ['portrait'],
                },
                statusBar: {
                    drawBehind: true,
                    translucent: true,
                },
            },
        },
    });
};
