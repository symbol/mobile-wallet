/**
 * @format
 * @flow
 */
import { hasUserSetPinCode, deleteUserPinCode } from '@haskkor/react-native-pincode';

const getPasscodeStatus = (serviceName?: string): boolean => {
    return hasUserSetPinCode(serviceName);
};

const deletePasscode = (serviceName?: string): boolean => {
    return deleteUserPinCode(serviceName);
};

export { getPasscodeStatus, deletePasscode };
