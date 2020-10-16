import {Platform} from "react-native";
import { Navigation } from 'react-native-navigation';
import {gestureHandlerRootHOC} from "react-native-gesture-handler";
import {TermsAndPrivacy} from "./screens/TermsAndPrivacy";
import {CreateOrImport} from "./screens/CreateOrImport";

export const BASE_SCREEN_NAME = 'com.nemgroup.wallet';
export const TERMS_AND_PRIVACY_SCREEN = `${BASE_SCREEN_NAME}.TERMS_AND_CONDITIONS`;
export const CREATE_OR_IMPORT_SCREEN = `${BASE_SCREEN_NAME}.CREATE_OR_IMPORT`;

/**
 * Class to handle Routing between screens
 */
export class Router {
    static screens = [
        [TERMS_AND_PRIVACY_SCREEN, TermsAndPrivacy],
        [CREATE_OR_IMPORT_SCREEN, CreateOrImport],
    ];

    static registerScreens() {
        this.screens.forEach(([key, ScreenComponent]) =>
            Navigation.registerComponent(key, () => gestureHandlerRootHOC(ScreenComponent))
        );
    }

    static goToTermsAndPrivacy(passProps, parentComponent?){
        return this.goToScreen(TERMS_AND_PRIVACY_SCREEN, passProps, parentComponent);
    }
    static goToCreateOrImport(passProps, parentComponent?){
        return this.goToScreen(CREATE_OR_IMPORT_SCREEN, passProps, parentComponent);
    }

    static goToScreen(screen: string, passProps, parentComponent?){
        setDefaultNavOptions();
        if (parentComponent){
            return pushToStack(parentComponent, screen, passProps);
        } else {
            return newStack(screen, passProps);
        }
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
