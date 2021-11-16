import React, { Component } from 'react';
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
    index: number,
    forceExpand?: Boolean,
};

type State = {
    expanded: Boolean,
};

export default class TransactionGraphic extends Component<Props, State> {
    state = {
        expanded: false,
    };

    componentDidMount() {
        this.setState({ expanded: false });
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.forceExpand !== this.props.forceExpand &&
            this.state.expanded !== this.props.forceExpand
        ) {
            this.setState({ expanded: this.props.forceExpand });
        }
    }

    toggle() {
        this.setState({ expanded: !this.state.expanded });
    }

    tableData() {
        return _.omit(this.props, [
            'index',
            'forceExpand',
            'transactionType',
            'type',
            'signerAddress',
            'recipientAddress',
            'deadline',
            'messageEncrypted',
            'hash',
        ]);
    }

    renderGraphic() {
        switch (this.props.transactionType) {
            case TransactionType.TRANSFER:
                return <TransferGraphic {...this.props} />;

            case TransactionType.ADDRESS_ALIAS:
                return <AddressAliasGraphic {...this.props} />;

            case TransactionType.MOSAIC_ALIAS:
                return <MosaicAliasGraphic {...this.props} />;

            case TransactionType.NAMESPACE_REGISTRATION:
                return <NamespaceRegistrationGraphic {...this.props} />;

            case TransactionType.MOSAIC_DEFINITION:
                return <MosaicDefinitionGraphic {...this.props} />;

            case TransactionType.MOSAIC_SUPPLY_CHANGE:
                return <MosaicSupplyChangeGraphic {...this.props} />;

            case TransactionType.SECRET_LOCK:
                return <SecretLockGraphic {...this.props} />;

            case TransactionType.HASH_LOCK:
                return <HashLockGraphic {...this.props} />;

            case TransactionType.SECRET_PROOF:
                return <SecretProofGraphic {...this.props} />;

            case TransactionType.VRF_KEY_LINK:
                return <VrfKeyGraphic {...this.props} />;

            case TransactionType.ACCOUNT_KEY_LINK:
                return <AccountKeyLinkGraphic {...this.props} />;

            case TransactionType.NODE_KEY_LINK:
                return <NodeKeyLinkGraphic {...this.props} />;

            case TransactionType.VOTING_KEY_LINK:
                return <VotingKeyLinkGraphic {...this.props} />;

            case TransactionType.MOSAIC_GLOBAL_RESTRICTION:
                return <MosaicGlobalRestrictionGraphic {...this.props} />;

            case TransactionType.MOSAIC_ADDRESS_RESTRICTION:
                return <MosaicAddressRestrictionGraphic {...this.props} />;

            case TransactionType.ACCOUNT_OPERATION_RESTRICTION:
                return <AccountOperationRestrictionGraphic {...this.props} />;

            case TransactionType.ACCOUNT_ADDRESS_RESTRICTION:
                return <AccountAddressRestrictionGraphic {...this.props} />;

            case TransactionType.ACCOUNT_MOSAIC_RESTRICTION:
                return <AccountMosaicRestrictionGraphic {...this.props} />;

            case TransactionType.MULTISIG_ACCOUNT_MODIFICATION:
                return <MultisigAccountModificationGraphic {...this.props} />;

            case TransactionType.ACCOUNT_METADATA:
                return <AccountMetadataGraphic {...this.props} />;

            case TransactionType.NAMESPACE_METADATA:
                return <NamespaceMetadataGraphic {...this.props} />;

            case TransactionType.MOSAIC_METADATA:
                return <MosaicMetadataGraphic {...this.props} />;
        }

        return null;
    }

    render() {
        const { index } = this.props;
        const { expanded } = this.state;
        const transactionNumber =
            typeof index === 'number' ? index + 1 + '' : null;

        return (
            <TouchableOpacity
                onPress={() => this.toggle()}
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
                {this.renderGraphic()}
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
                            data={this.tableData()}
                        />
                    </Section>
                )}
            </TouchableOpacity>
        );
    }
}
