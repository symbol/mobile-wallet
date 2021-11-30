/**
 * @format
 * @flow
 */

import { MnemonicQR, QRCodeGenerator } from 'symbol-qr-library';
import { NetworkType, Password, PublicAccount } from 'symbol-sdk';
import Observable from 'rxjs';

/**
 * Creates an Mnemonic QR based on  mnemonic and password.
 *
 * @param plain
 * @param {Password} password
 */
const generateMnemonicQR = (plain: string, plainPassword?: string): Observable => {
    const exportMnemonic = new MnemonicQR(plain, NetworkType.MAIN_NET, 'no-chain-id', plainPassword);
    return exportMnemonic.toString('svg');
};

/**
 * Creates an Address QR based on name and publicKey.
 *
 * @param {string} name
 * @param {string} publicKey
 * @param networkType
 * @param generationHash
 */
const generateAddressQR = (name: string, publicKey: string, networkType: NetworkType, generationHash: string): Observable => {
    const account = PublicAccount.createFromPublicKey(publicKey, networkType);
    const request = QRCodeGenerator.createAddContact(name, account, networkType, generationHash);
    return request.toString('svg');
};

/**
 * Creates an Transaction QR based on publicKey, amount and message.
 *
 * @param {string} publicKey
 * @param {number} amount
 * @param {string} message
 * @param {string} networkCurrency

 */
/*
const generateTransactionQR = (
    publicKey: string,
    amount: number,
    message: string,
    networkCurrency?: string
): Observable => {
    return WalletRepository.getNetworkConfig().pipe(
        mergeMap(networkInfo => {
            const mosaic = networkCurrency || networkInfo.currency;
            return of(
                TransferTransaction.create(
                    Deadline.create(),
                    Address.createFromPublicKey(publicKey, networkInfo.type),
                    [new Mosaic(new MosaicId(mosaic), UInt64.fromUint(amount * 1000000))],
                    PlainMessage.create(message),
                    networkInfo.type
                )
            ).pipe(
                map(
                    transfer =>
                        new TransactionQR(
                            transfer,
                            networkInfo.type,
                            networkInfo.generationHash,
                            QRCodeType.RequestTransaction
                        )
                )
            );
        }),
        switchMap(requestTx => requestTx.toString('svg'))
    );
};
*/

/**
 * Parse Transaction QR.
 *
 * @param {string} data
 */
const fromTransactionQR = (data: string) => {
    return QRCodeGenerator.fromJSON(data).account;
};

/**
 * Parse QR.
 *
 * @param {string} data
 */
const parseQR = (data: string) => {
    return QRCodeGenerator.fromJSON(data);
};

/**
 * Parse Mnemonic QR.
 *
 * @param {string} data
 * @param password
 */
const fromMnemonicQR = (data: string, password: Password) => {
    const importMnemonic = MnemonicQR.fromJSON(data, password.value);
    return importMnemonic.mnemonic.plain;
};

/**
 * Convert a string to Password type to use basci type validation.
 *
 * @param passwordString
 */
const passwordValidation = (passwordString: string) => {
    return new Password(passwordString);
};

export {
    generateMnemonicQR,
    generateAddressQR,
    // generateTransactionQR,
    fromTransactionQR,
    fromMnemonicQR,
    passwordValidation,
    parseQR,
};
