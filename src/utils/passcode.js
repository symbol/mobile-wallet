/**
 * @format
 * @flow
 */
import { hasUserSetPinCode, deleteUserPinCode } from '@haskkor/react-native-pincode';
import store from "@src/store";
import {Router} from "@src/Router";

const getPasscodeStatus = (serviceName?: string): boolean => {
    return hasUserSetPinCode(serviceName);
};

const deletePasscode = (serviceName?: string): boolean => {
    return deleteUserPinCode(serviceName);
};

const showPasscode = (componentId, callback) => {
    const isPin = store.getState().settings.isPasscodeSelected;
    if (isPin) {
        Router.showPasscode(
            {
                resetPasscode: false,
                onSuccess: () => {
                    Router.goBack(componentId);
                    callback();
                },
            },
            componentId
        );
    } else {
        callback();
    }
};

export { getPasscodeStatus, deletePasscode, showPasscode };
