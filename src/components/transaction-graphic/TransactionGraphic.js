import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { TransactionType } from 'symbol-sdk';
import { Icon, Row, Section, TableView, Text } from '@src/components';
import TransferGraphic from './TransferGraphic.js';
import _ from 'lodash';
import AddressAliasGraphic from './AddressAliasGraphic.js';
import MosaicAliasGraphic from './MosaicAliasGraphic.js';
import NamespaceRegistrationGraphic from './NamespaceRegistrationGraphic.js';
import MosaicDefinitionGraphic from './MosaicDefinitionGraphic.js';
import MosaicSupplyChangeGraphic from './MosaicSupplyChangeGraphic.js';
import SecretLockGraphic from './SecretLockGraphic.js';
import HashLockGraphic from './HashLockGraphic.js';
import VrfKeyGraphic from './VrfKeyGraphic.js';
import AccountKeyLinkGraphic from './AccountKeyLinkGraphic.js';
import NodeKeyLinkGraphic from './NodeKeyLinkGraphic.js';
import VotingKeyLinkGraphic from './VotingKeyLinkGraphic.js';
import SecretProofGraphic from './SecretProofGraphic.js';
import AccountMetadataGraphic from './AccountMetadataGraphic.js';
import NamespaceMetadataGraphic from './NamespaceMetadataGraphic.js';
import MosaicMetadataGraphic from './MosaicMetadataGraphic.js';
import MosaicGlobalRestrictionGraphic from './MosaicGlobalRestrictionGraphic.js';
import MosaicAddressRestrictionGraphic from './MosaicAddressRestrictionGraphic.js';
import AccountOperationRestrictionGraphic from './AccountOperationRestrictionGraphic.js';
import AccountAddressRestrictionGraphic from './AccountAddressRestrictionGraphic.js';
import AccountMosaicRestrictionGraphic from './AccountMosaicRestrictionGraphic.js';
import MultisigAccountModificationGraphic from './MultisigAccountModificationGraphic.js';

const styles = StyleSheet.create({
    transactionNumber: {
        position: 'absolute',
        top: 4,
        left: 8,
        opacity: 0.3,
    },
    expand: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        opacity: 0.2,
    },
    fullWidth: {
        width: '100%',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    tableContainer: {
        paddingHorizontal: 22,
    },
});

type Props = {
    index: number;
    expand: boolean;
};

export default function TransactionGraphic(props: Props) {
    const [expanded, setExpanded] = useState(false);
    useEffect(() => {
        setExpanded(props.expand);
    }, [props.expand]);

    const transactionNumber =
            typeof props.index === 'number' ? props.index + 1 + '' : null;
    const tableData = _.omit(props, [
        'index',
        'expand',
        'transactionType',
        'type',
        'signerAddress',
        'recipientAddress',
        'deadline',
        'messageEncrypted',
        'hash',
    ]);

    const toggle = () => {
        setExpanded(value => !value);
    }

    const renderGraphic = () => {
        switch (props.transactionType) {
            case TransactionType.TRANSFER:
                return <TransferGraphic {...props} />;

            case TransactionType.ADDRESS_ALIAS:
                return <AddressAliasGraphic {...props} />;

            case TransactionType.MOSAIC_ALIAS:
                return <MosaicAliasGraphic {...props} />;

            case TransactionType.NAMESPACE_REGISTRATION:
                return <NamespaceRegistrationGraphic {...props} />;

            case TransactionType.MOSAIC_DEFINITION:
                return <MosaicDefinitionGraphic {...props} />;

            case TransactionType.MOSAIC_SUPPLY_CHANGE:
                return <MosaicSupplyChangeGraphic {...props} />;

            case TransactionType.SECRET_LOCK:
                return <SecretLockGraphic {...props} />;

            case TransactionType.HASH_LOCK:
                return <HashLockGraphic {...props} />;

            case TransactionType.SECRET_PROOF:
                return <SecretProofGraphic {...props} />;

            case TransactionType.VRF_KEY_LINK:
                return <VrfKeyGraphic {...props} />;

            case TransactionType.ACCOUNT_KEY_LINK:
                return <AccountKeyLinkGraphic {...props} />;

            case TransactionType.NODE_KEY_LINK:
                return <NodeKeyLinkGraphic {...props} />;

            case TransactionType.VOTING_KEY_LINK:
                return <VotingKeyLinkGraphic {...props} />;

            case TransactionType.MOSAIC_GLOBAL_RESTRICTION:
                return <MosaicGlobalRestrictionGraphic {...props} />;

            case TransactionType.MOSAIC_ADDRESS_RESTRICTION:
                return <MosaicAddressRestrictionGraphic {...props} />;

            case TransactionType.ACCOUNT_OPERATION_RESTRICTION:
                return <AccountOperationRestrictionGraphic {...props} />;

            case TransactionType.ACCOUNT_ADDRESS_RESTRICTION:
                return <AccountAddressRestrictionGraphic {...props} />;

            case TransactionType.ACCOUNT_MOSAIC_RESTRICTION:
                return <AccountMosaicRestrictionGraphic {...props} />;

            case TransactionType.MULTISIG_ACCOUNT_MODIFICATION:
                return <MultisigAccountModificationGraphic {...props} />;

            case TransactionType.ACCOUNT_METADATA:
                return <AccountMetadataGraphic {...props} />;

            case TransactionType.NAMESPACE_METADATA:
                return <NamespaceMetadataGraphic {...props} />;

            case TransactionType.MOSAIC_METADATA:
                return <MosaicMetadataGraphic {...props} />;
        }

        return null;
    }

    return (
        <TouchableOpacity
            onPress={() => toggle()}
            style={[styles.fullWidth, styles.center]}
        >
            {transactionNumber && (
                <Text
                    type="regular"
                    theme="light"
                    style={styles.transactionNumber}
                >
                    {transactionNumber}
                </Text>
            )}
            {renderGraphic()}
            {!expanded && (
                <Row
                    style={styles.expand}
                    align="center"
                    justify="center"
                    fullWidth
                >
                    <Icon name="expand" size="small" />
                </Row>
            )}
            {expanded && (
                <Section style={[styles.fullWidth, styles.tableContainer]}>
                    <TableView
                        smaller
                        hideEmpty
                        style={styles.fullWidth}
                        data={tableData}
                    />
                </Section>
            )}
        </TouchableOpacity>
    );
}
