/**
 * @format
 * @flow
 */
import { hasUserSetPinCode, deleteUserPinCode } from '@haskkor/react-native-pincode';
import store from '@src/store';
import { Router } from '@src/Router';

const getPasscodeStatus = (serviceName?: string): boolean => {
    return hasUserSetPinCode(serviceName);
};

const deletePasscode = (serviceName?: string): boolean => {
    return deleteUserPinCode(serviceName);
};

const createPasscode = componentId => {
    const setPasscode = () => {
        store.dispatchAction({ type: 'settings/saveIsPasscodeSelected', payload: true }).then(_ => {
            Router.goToWalletLoading({});
        });
    };
    Router.showPasscode(
        {
            resetPasscode: false,
            onSuccess: setPasscode,
        },
        componentId
    );
};

const showPasscode = (componentId, callback) => {
    const isPin = store.getState().settings.isPasscodeSelected;
    if (isPin) {
        Router.showPasscode(
            {
                showCancel: true,
                resetPasscode: false,
                onSuccess: async () => {
                    callback();
                    //Router.goBack(componentId);
                },
            },
            componentId
        );
    } else {
        callback();
    }
};

export { getPasscodeStatus, deletePasscode, showPasscode, createPasscode };
