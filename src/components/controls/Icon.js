import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { TransactionType } from 'symbol-sdk';

const styles = StyleSheet.create({
    large: {
        height: 128,
        width: 128,
    },
    big: {
        height: 64,
        width: 64,
    },
    medium: {
        height: 24,
        width: 24,
    },
    small: {
        height: 16,
        width: 16,
    },
    mini: {
        height: 10,
        width: 10,
    },
});

type IconName =
    | 'none'
    | 'send'
    | 'receive'
    | 'news'
    | 'mosaics'
    | 'home'
    | 'history'
    | 'harvest'
    | 'back_light'
    | 'back_dark'
    | 'settings_light'
    | 'settings_dark'
    | 'paste'
    | 'qr'
    | 'expand'
    | 'incoming_light'
    | 'outgoing_light'
    | 'options_dark'
    | 'add_light'
    | 'add_filled_light'
    | 'delete_light'
    | 'edit_light'
    | 'true_light'
    | 'true_dark'
    | 'false_light'
    | 'copy'
    | 'close'
    | 'optin'
    | 'namespace_light';

type Size = 'large' | 'big' | 'medium' | 'small';

interface Props {
    name: IconName;
    size: Size;
}

type State = {};

export default class C extends Component<Props, State> {
    render() {
        const { style = {}, name, size } = this.props;
        let source;
        let _style = {};

        switch (name) {
            case 'none':
                break;
            case 'news':
                source = require('@src/assets/icons/menu2/news.png');
                break;
            case 'send':
                source = require('@src/assets/icons/send.png');
                break;
            case 'receive':
                source = require('@src/assets/icons/receive.png');
                break;
            case 'mosaics':
                source = require('@src/assets/icons/menu2/mosaics.png');
                break;
            case 'home':
                source = require('@src/assets/icons/menu2/home.png');
                break;
            case 'history':
                source = require('@src/assets/icons/menu2/history.png');
                break;
            case 'harvest':
                source = require('@src/assets/icons/menu2/harvest.png');
                break;
            case 'back_light':
                source = require('@src/assets/icons/back_light.png');
                break;
            case 'back_light_reversed':
                source = require('@src/assets/icons/back_light_reversed.png');
                break;
            case 'back_dark':
                source = require('@src/assets/icons/back_dark.png');
                break;
            case 'settings_light':
                source = require('@src/assets/icons/settings_light.png');
                break;
            case 'settings_filled_light':
                source = require('@src/assets/icons/settings_filled_light.png');
                break;
            case 'settings_dark':
                source = require('@src/assets/icons/settings_dark.png');
                break;
            case 'wallet_filled_light':
                source = require('@src/assets/icons/wallet_filled_light.png');
                break;
            case 'paste':
                source = require('@src/assets/icons/clipboard.png');
                break;
            case 'qr':
                source = require('@src/assets/icons/qr.png');
                break;
            case 'address_book':
                source = require('@src/assets/icons/address_book.png');
                break;
            case 'address_book_filled_light':
                source = require('@src/assets/icons/address_book_filled_light.png');
                break;
            case 'expand':
                source = require('@src/assets/icons/expand.png');
                break;
            case 'incoming_light':
                source = require('@src/assets/icons/transaction/incoming.png');
                break;
            case 'outgoing_light':
                source = require('@src/assets/icons/transaction/outgoing.png');
                break;
            case 'aggregate':
                source = require('@src/assets/icons/transaction/aggregate.png');
                break;
            case 'options_light':
                source = require('@src/assets/icons/options_light.png');
                break;
            case 'options_dark':
                source = require('@src/assets/icons/options_dark.png');
                break;
            case 'add_light':
                source = require('@src/assets/icons/add_light.png');
                break;
            case 'add_filled_light':
                source = require('@src/assets/icons/add_filled_light.png');
                break;
            case 'delete_light':
                source = require('@src/assets/icons/delete_light.png');
                break;
            case 'edit_light':
                source = require('@src/assets/icons/edit_light.png');
                break;
            case 'delete_primary':
                source = require('@src/assets/icons/delete_primary.png');
                break;
            case 'edit_primary':
                source = require('@src/assets/icons/edit_primary.png');
                break;
            case 'true_light':
                source = require('@src/assets/icons/true_light.png');
                break;
            case 'true_dark':
                source = require('@src/assets/icons/true_dark.png');
                break;
            case 'false_light':
                source = require('@src/assets/icons/false_light.png');
                break;
            case 'copy':
                source = require('@src/assets/icons/copy.png');
                break;
            case 'mosaics_filled':
                source = require('@src/assets/icons/mosaics.png');
                break;
            case 'message_filled':
                source = require('@src/assets/icons/message.png');
                break;
            case 'mosaic_native':
                source = require('@src/assets/icons/mosaic_native.png');
                break;
            case 'mosaic_custom':
                source = require('@src/assets/icons/mosaic_custom.png');
                break;
            case 'qr_light':
                source = require('@src/assets/icons/qr_light.png');
                break;
            case 'qr_dark':
                source = require('@src/assets/icons/qr_dark.png');
                break;
            case 'key_dark':
                source = require('@src/assets/icons/key_dark.png');
                break;
            case 'explorer_filled_light':
                source = require('@src/assets/icons/explorer_filled_light.png');
                break;
            case 'explorer_filled_primary':
                source = require('@src/assets/icons/explorer_filled_primary.png');
                break;
            case 'explorer_filled_blue':
                source = require('@src/assets/icons/explorer_filled_blue.png');
                break;
            case 'faucet_filled_light':
                source = require('@src/assets/icons/faucet_filled_light.png');
                break;
            case 'faucet_filled_primary':
                source = require('@src/assets/icons/faucet_filled_primary.png');
                break;
            case 'faucet_filled_blue':
                source = require('@src/assets/icons/faucet_filled_blue.png');
                break;
            case 'success':
                source = require('@src/assets/icons/success.png');
                break;
            case 'contact_light':
                source = require('@src/assets/icons/contact_light.png');
                break;
            case 'qr_scanner':
                source = require('@src/assets/icons/qr_scanner.png');
                break;
            case 'warning':
                source = require('@src/assets/icons/warning_yellow.png');
                break;
            case 'check':
                source = require('@src/assets/icons/check.png');
                break;
            case 'close_light':
                source = require('@src/assets/icons/close_light.png');
                break;
            case 'close_dark':
                source = require('@src/assets/icons/close_dark.png');
                break;
            case 'optin':
                source = require('@src/assets/icons/optin.png');
                break;
            case 'namespace_light':
                source = require('@src/assets/icons/namespace.png');
                break;

            case `transaction_${TransactionType.TRANSFER}`:
                source = require('@src/assets/icons/transaction/transfer.png');
                break;
            case `transaction_${TransactionType.TRANSFER}_incoming`:
                source = require('@src/assets/icons/transaction/incoming.png');
                break;
            case `transaction_${TransactionType.TRANSFER}_outgoing`:
                source = require('@src/assets/icons/transaction/outgoing.png');
                break;
            case `transaction_${TransactionType.AGGREGATE_BONDED}`:
            case `transaction_${TransactionType.AGGREGATE_COMPLETE}`:
                source = require('@src/assets/icons/transaction/aggregate.png');
                break;
            case `transaction_${TransactionType.ADDRESS_ALIAS}`:
                source = require('@src/assets/icons/transaction/namespace.png');
                break;
            case `transaction_${TransactionType.MOSAIC_ALIAS}`:
                source = require('@src/assets/icons/transaction/namespace.png');
                break;
            case `transaction_${TransactionType.NAMESPACE_REGISTRATION}`:
                source = require('@src/assets/icons/transaction/namespace.png');
                break;
            case `transaction_${TransactionType.MOSAIC_DEFINITION}`:
                source = require('@src/assets/icons/transaction/mosaic.png');
                break;
            case `transaction_${TransactionType.MOSAIC_SUPPLY_CHANGE}`:
                source = require('@src/assets/icons/transaction/mosaic.png');
                break;
            case `transaction_${TransactionType.SECRET_LOCK}`:
                source = require('@src/assets/icons/transaction/cross-chain.png');
                break;
            case `transaction_${TransactionType.HASH_LOCK}`:
                source = require('@src/assets/icons/transaction/lock.png');
                break;
            case `transaction_${TransactionType.SECRET_PROOF}`:
                source = require('@src/assets/icons/transaction/cross-chain.png');
                break;
            case `transaction_${TransactionType.VRF_KEY_LINK}`:
                source = require('@src/assets/icons/transaction/key.png');
                break;
            case `transaction_${TransactionType.ACCOUNT_KEY_LINK}`:
                source = require('@src/assets/icons/transaction/key.png');
                break;
            case `transaction_${TransactionType.NODE_KEY_LINK}`:
                source = require('@src/assets/icons/transaction/key.png');
                break;
            case `transaction_${TransactionType.VOTING_KEY_LINK}`:
                source = require('@src/assets/icons/transaction/key.png');
                break;
            case `transaction_${TransactionType.MOSAIC_GLOBAL_RESTRICTION}`:
                source = require('@src/assets/icons/transaction/mosaic-restriction.png');
                break;
            case `transaction_${TransactionType.MOSAIC_ADDRESS_RESTRICTION}`:
                source = require('@src/assets/icons/transaction/mosaic-restriction.png');
                break;
            case `transaction_${TransactionType.ACCOUNT_OPERATION_RESTRICTION}`:
                source = require('@src/assets/icons/transaction/account-restriction.png');
                break;
            case `transaction_${TransactionType.ACCOUNT_ADDRESS_RESTRICTION}`:
                source = require('@src/assets/icons/transaction/account-restriction.png');
                break;
            case `transaction_${TransactionType.ACCOUNT_MOSAIC_RESTRICTION}`:
                source = require('@src/assets/icons/transaction/account-restriction.png');
                break;
            case `transaction_${TransactionType.MULTISIG_ACCOUNT_MODIFICATION}`:
                source = require('@src/assets/icons/transaction/multisig.png');
                break;
            case `transaction_${TransactionType.ACCOUNT_METADATA}`:
                source = require('@src/assets/icons/transaction/metadata.png');
                break;
            case `transaction_${TransactionType.NAMESPACE_METADATA}`:
                source = require('@src/assets/icons/transaction/metadata.png');
                break;
            case `transaction_${TransactionType.MOSAIC_METADATA}`:
                source = require('@src/assets/icons/transaction/metadata.png');
                break;

            default:
                source = require('@src/assets/icons/ic-about.png');
                break;
        }

        switch (size) {
            case 'large':
                _style = styles.large;
                break;
            case 'big':
                _style = styles.big;
                break;
            case 'medium':
                _style = styles.medium;
                break;
            case 'small':
                _style = styles.small;
                break;
            case 'mini':
                _style = styles.mini;
                break;
            default:
                _style = styles.medium;
                break;
        }

        if (!source) return <View style={[_style, style, { paddingHorizontal: 17 }]} />;
        return <Image style={[_style, style]} source={source} />;
    }
}
