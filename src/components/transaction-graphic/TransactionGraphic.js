import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { TransactionType } from 'symbol-sdk';
import { TableView } from '@src/components';
import TransferGraphic from './TransferGraphic.js';
import _ from 'lodash';
// import AddressAliasGraphic from './AddressAliasGraphic.js';
// import MosaicAliasGraphic from './MosaicAliasGraphic.js';
import NamespaceRegistrationGraphic from './NamespaceRegistrationGraphic.js';
import MosaicDefinitionGraphic from './MosaicDefinitionGraphic.js';
import MosaicSupplyChangeGraphic from './MosaicSupplyChangeGraphic.js';
// import SecretLockGraphic from './SecretLockGraphic.js';
// import HashLockGraphic from './HashLockGraphic.js';
// import VrfKeyGraphic from './VrfKeyGraphic.js';
// import AccountKeyLinkGraphic from './AccountKeyLinkGraphic.js';
// import NodeKeyLinkGraphic from './NodeKeyLinkGraphic.js';
// import VotingKeyLinkGraphic from './VotingKeyLinkGraphic.js';
// import SecretProofGraphic from './SecretProofGraphic.js';
// import AccountMetadataGraphic from './AccountMetadataGraphic.js';
// import NamespaceMetadataGraphic from './NamespaceMetadataGraphic.js';
// import MosaicMetadataGraphic from './MosaicMetadataGraphic.js';
// import MosaicGlobalRestrictionGraphic from './MosaicGlobalRestrictionGraphic.js';
// import MosaicAddressRestrictionGraphic from './MosaicAddressRestrictionGraphic.js';
// import AccountOperationRestrictionGraphic from './AccountOperationRestrictionGraphic.js';
// import AccountAddressRestrictionGraphic from './AccountAddressRestrictionGraphic.js';
// import AccountMosaicRestrictionGraphic from './AccountMosaicRestrictionGraphic.js';
// import MultisigAccountModificationGraphic from './MultisigAccountModificationGraphic.js';

type Props = {
	data: object;
};

type State = {
	expanded: Boolean;
}

export default class TransactionGraphic extends Component<Props, State> {
	state = {
		expanded: false
	};

	componentDidMount() {
		this.setState({ expanded: false });
	}

	toggle() {
		this.setState({ expanded: !this.state.expanded });
	}

	tableData() {
		return _.omit(this.props, [
			'transactionType', 
			'type', 
			'signerAddress', 
			'recipientAddress', 
			'deadline', 
			'messageEncrypted'
		])
	}

	renderGraphic() {
		switch (this.props.transactionType) {
			case TransactionType.TRANSFER: 
				return <TransferGraphic {...this.props} />

			// case TransactionType.ADDRESS_ALIAS: 
			// 	return <AddressAliasGraphic {...data} />
				
			// case TransactionType.MOSAIC_ALIAS: 
			// 	return <MosaicAliasGraphic {...data} />

			case TransactionType.NAMESPACE_REGISTRATION: 
				return <NamespaceRegistrationGraphic {...this.props} />

			case TransactionType.MOSAIC_DEFINITION: 
				return <MosaicDefinitionGraphic {...this.props} />

			case TransactionType.MOSAIC_SUPPLY_CHANGE: 
				return <MosaicSupplyChangeGraphic {...this.props} />

			// case TransactionType.SECRET_LOCK: 
			// 	return <SecretLockGraphic {...data} />

			// case TransactionType.HASH_LOCK: 
			// 	return <HashLockGraphic {...data} />

			// case TransactionType.SECRET_PROOF: 
			// 	return <SecretProofGraphic {...data} />

			// case TransactionType.VRF_KEY_LINK: 
			// 	return <VrfKeyGraphic {...data} />

			// case TransactionType.ACCOUNT_KEY_LINK: 
			// 	return <AccountKeyLinkGraphic {...data} />

			// case TransactionType.NODE_KEY_LINK: 
			// 	return <NodeKeyLinkGraphic {...data} />

			// case TransactionType.VOTING_KEY_LINK: 
			// 	return <VotingKeyLinkGraphic {...data} />

			// case TransactionType.MOSAIC_GLOBAL_RESTRICTION: 
			// 	return <MosaicGlobalRestrictionGraphic {...data} />

			// case TransactionType.MOSAIC_ADDRESS_RESTRICTION: 
			// 	return <MosaicAddressRestrictionGraphic {...data} />

			// case TransactionType.ACCOUNT_OPERATION_RESTRICTION: 
			// 	return <AccountOperationRestrictionGraphic {...data} />

			// case TransactionType.ACCOUNT_ADDRESS_RESTRICTION: 
			// 	return <AccountAddressRestrictionGraphic {...data} />

			// case TransactionType.ACCOUNT_MOSAIC_RESTRICTION: 
			// 	return <AccountMosaicRestrictionGraphic {...data} />

			// case TransactionType.MULTISIG_ACCOUNT_MODIFICATION: 
			// 	return <MultisigAccountModificationGraphic {...data} />

			// case TransactionType.ACCOUNT_METADATA: 
			// 	return <AccountMetadataGraphic {...data} />

			// case TransactionType.NAMESPACE_METADATA: 
			// 	return <NamespaceMetadataGraphic {...data} />

			// case TransactionType.MOSAIC_METADATA: 
			// 	return <MosaicMetadataGraphic {...data} />
		}

		return null;
	}
	
	render() {
		const { expanded } = this.state;

		return <TouchableOpacity onPress={() => this.toggle()}>
			{this.renderGraphic()}
			{expanded && <TableView smaller hideEmpty data={this.tableData()} />}
		</TouchableOpacity>
	}
}
