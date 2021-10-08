/*
 *
 * Copyright (c) 2019-present for symbol
 *
 * Licensed under the Apache License, Version 2.0 (the "License ");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { Constants } from '@src/config/constants';
import { Mosaic, MosaicId, TransactionType } from 'symbol-sdk';
import NamespaceService from '@src/services/NamespaceService';
import MosaicService from '@src/services/MosaicService';
import type { MosaicModel } from '@src/storage/models/MosaicModel';
import type { NetworkModel } from '@src/storage/models/NetworkModel';

export class FormatTransaction {
	static format = (transaction, network, preLoadedMosaics) => {
		switch(transaction.type) {
			case TransactionType.TRANSFER: 
				return FormatTransaction.transferTransaction(transaction, network, preLoadedMosaics);

			case TransactionType.ADDRESS_ALIAS: 
				return FormatTransaction.addressAlias(transaction, network, preLoadedMosaics);

			case TransactionType.MOSAIC_ALIAS: 
				return FormatTransaction.mosaicAlias(transaction, network, preLoadedMosaics);

			case TransactionType.NAMESPACE_REGISTRATION: 
				return FormatTransaction.namespaceRegistration(transaction, network, preLoadedMosaics);

			case TransactionType.MOSAIC_DEFINITION: 
				return FormatTransaction.mosaicDefinition(transaction, network, preLoadedMosaics);

			case TransactionType.MOSAIC_SUPPLY_CHANGE: 
				return FormatTransaction.mosaicSupplyChange(transaction, network, preLoadedMosaics);

			case TransactionType.SECRET_LOCK: 
				return FormatTransaction.secretLock(transaction, network, preLoadedMosaics);

			case TransactionType.HASH_LOCK: 
				return FormatTransaction.hashLock(transaction, network, preLoadedMosaics);

			case TransactionType.SECRET_PROOF: 
				return FormatTransaction.secretProof(transaction, network, preLoadedMosaics);

			case TransactionType.VRF_KEY_LINK: 
				return FormatTransaction.vrfKeyLink(transaction, network, preLoadedMosaics);

			case TransactionType.ACCOUNT_KEY_LINK: 
				return FormatTransaction.accountKeyLink(transaction, network, preLoadedMosaics);

			case TransactionType.NODE_KEY_LINK: 
				return FormatTransaction.nodeKeyLink(transaction, network, preLoadedMosaics);

			case TransactionType.VOTING_KEY_LINK: 
				return FormatTransaction.votingKeyLink(transaction, network, preLoadedMosaics);

			case TransactionType.MOSAIC_GLOBAL_RESTRICTION: 
				return FormatTransaction.mosaicGlobalRestriction(transaction, network, preLoadedMosaics);

			case TransactionType.MOSAIC_ADDRESS_RESTRICTION: 
				return FormatTransaction.mosaicAddressRestriction(transaction, network, preLoadedMosaics);

			case TransactionType.ACCOUNT_OPERATION_RESTRICTION: 
				return FormatTransaction.accountOperationRestriction(transaction, network, preLoadedMosaics);

			case TransactionType.ACCOUNT_ADDRESS_RESTRICTION: 
				return FormatTransaction.accountAddressRestriction(transaction, network, preLoadedMosaics);

			case TransactionType.ACCOUNT_MOSAIC_RESTRICTION: 
				return FormatTransaction.accountMosaicRestriction(transaction, network, preLoadedMosaics);

			case TransactionType.MULTISIG_ACCOUNT_MODIFICATION: 
				return FormatTransaction.multisigAccountModification(transaction, network, preLoadedMosaics);

			case TransactionType.ACCOUNT_METADATA: 
				return FormatTransaction.accountMetadata(transaction, network, preLoadedMosaics);

			case TransactionType.NAMESPACE_METADATA: 
				return FormatTransaction.namespaceMetadata(transaction, network, preLoadedMosaics);

			case TransactionType.MOSAIC_METADATA: 
				return FormatTransaction.mosaicMetadata(transaction, network, preLoadedMosaics); 
		}
	}

    static transferTransaction = async (transaction, network, preLoadedMosaics) => {
    	const mosaicModels: MosaicModel[] = [];
        for (let mosaic of transaction.mosaics) {
            let mosaicModel;
            if (preLoadedMosaics && preLoadedMosaics[mosaic.id.toHex()]) {
                mosaicModel = {
                    ...preLoadedMosaics[mosaic.id.toHex()],
                    amount: mosaic.amount.toString(),
                };
            } else {
                mosaicModel = await MosaicService.getMosaicModelFromMosaicId(mosaic, network);
            }
            mosaicModels.push(mosaicModel);
        }
        return {
            transactionType: transaction.type,
            recipientAddress: transaction.recipientAddress instanceof Address ? transaction.recipientAddress.pretty() : transaction.recipientAddress.id.toHex(),
            messageText: transaction.message.payload,
            messageEncrypted: transaction.message.type === 0x01,
            mosaics: mosaicModels,
        };
    }

    static namespaceRegistration = async (transaction, network, preLoadedMosaics) => {
    	return {
			transactionType: transaction.type,
			registrationType: Constants.NamespaceRegistrationType[transaction.registrationType],
			namespaceName: transaction.namespaceName,
			namespaceId: transaction.namespaceId.toHex(),
			parentId: typeof transaction.parentId !== 'undefined' ? transaction.parentId?.toHex() : Constants.Message.UNAVAILABLE,
			duration: typeof transaction.duration !== 'undefined' ? transaction.duration?.compact() : Constants.Message.UNLIMITED
    	};
    }

    static addressAlias = async (transaction, network, preLoadedMosaics) => {
		const repositoryFactory = new RepositoryFactoryHttp(network.node);
        const namespaceHttp = repositoryFactory.createNamespaceRepository();
        const namespaceNames = await namespaceHttp.getNamespacesNames([transaction.namespaceId]).toPromise();
    	const namespaceName = namespaceNames.find(namespace => namespace.namespaceId === transaction.namespaceId.toHex());

    	return {
			transactionType: transaction.type,
			aliasAction: Constants.AliasAction[transaction.aliasAction],
			namespaceId: transaction.namespaceId.toHex(),
			namespaceName: namespaceName.name,
			address: transaction.address.address
    	};
    }

    static mosaicAlias = async (transaction, network, preLoadedMosaics) => {
    	const repositoryFactory = new RepositoryFactoryHttp(network.node);
        const namespaceHttp = repositoryFactory.createNamespaceRepository();
        const namespaceNames = await namespaceHttp.getNamespacesNames([transaction.namespaceId]).toPromise();
    	const namespaceName = namespaceNames.find(namespace => namespace.namespaceId === transaction.namespaceId.toHex());

    	return {
			transactionType: transaction.type,
			aliasAction: Constants.AliasAction[transaction.aliasAction],
			namespaceId: transaction.namespaceId.id.toHex(),
			namespaceName: namespaceName.name,
			mosaicId: transaction.mosaicId.id.toHex()
    	};
    };

    static mosaicDefinition = async (transaction, network, preLoadedMosaics) => {
    	const resolvedMosaic = await NamespaceService.resolveMosaicId(transaction.mosaicId, network);

    	return {
			transactionType: transaction.type,
			mosaicId: resolvedMosaic.toHex(),
			divisibility: transaction.divisibility,
			duration: transaction.duration.compact(),
			nonce: transaction.nonce.toHex(),
			supplyMutable: transaction.flags.supplyMutable,
			transferable: transaction.flags.transferable,
			restrictable: transaction.flags.restrictable
    	};
    };

    static mosaicSupplyChange = async (transaction, network, preLoadedMosaics) => {
    	const resolvedMosaic = await NamespaceService.resolveMosaicId(transaction.mosaicId, network);

    	return {
			transactionType: transaction.type,
			mosaicId: resolvedMosaic.toHex(),
			action: Constants.MosaicSupplyChangeAction[transaction.action],
			delta: transaction.delta.compact()
    	};
    };

    static multisigAccountModification = async (transaction, network, preLoadedMosaics) => {
    	const [addressAdditions, addressDeletions] = await Promise.all([
    		Promise.all(transaction.addressAdditions.map(address => {
    			return NamespaceService.resolveAddress(address, network);
    		})),
    		Promise.all(transaction.addressDeletions.map(address => {
    			return NamespaceService.resolveAddress(address, network);
    		}))
    	]);

    	return {
			transactionType: transaction.type,
			minApprovalDelta: transaction.minApprovalDelta,
			minRemovalDelta: transaction.minRemovalDelta,
			addressAdditions: addressAdditions,
			addressDeletions: addressDeletions
    	};
    }

    static hashLock = async (transaction, network, preLoadedMosaics?) => {
    	let mosaicModel;
        if (preLoadedMosaics && preLoadedMosaics[transaction.mosaic.id.toHex()]) {
            mosaicModel = preLoadedMosaics[transaction.mosaic.id.toHex()];
            mosaicModel = {
                ...preLoadedMosaics[transaction.mosaic.id.toHex()],
                amount: transaction.mosaic.amount.toString(),
            };
        } else {
            mosaicModel = await MosaicService.getMosaicModelFromMosaicId(transaction.mosaic, network);
        }

    	return {
			transactionType: transaction.type,
			duration: transaction.duration.compact(),
			mosaic: mosaicModel,
			hash: transaction.hash
    	};
    }

    static secretLock = async (transaction, network, preLoadedMosaics?) => {
		let mosaicModel;
        if (preLoadedMosaics && preLoadedMosaics[transaction.mosaic.id.toHex()]) {
            mosaicModel = preLoadedMosaics[transaction.mosaic.id.toHex()];
            mosaicModel = {
                ...preLoadedMosaics[transaction.mosaic.id.toHex()],
                amount: transaction.mosaic.amount.toString(),
            };
        } else {
            mosaicModel = await MosaicService.getMosaicModelFromMosaicId(transaction.mosaic, network);
        }

    	const [resolvedAddress] = await Promise.all([
    		NamespaceService.resolveAddress(transaction.recipientAddress)
    	]);

    	return {
			transactionType: transaction.type,
			duration: transaction.duration.compact(),
			mosaic: mosaicModel,
			secret: transaction.secret,
			recipient: resolvedAddress,
			hashAlgorithm: Constants.LockHashAlgorithm[transaction.hashAlgorithm]
    	};
    };

    static secretProof = async (transaction, network, preLoadedMosaics) => {
    	const resolvedAddress = await NamespaceService.resolveAddress(transaction.recipientAddress, network);

    	return {
			transactionType: transaction.type,
			hashAlgorithm: Constants.LockHashAlgorithm[transaction.hashAlgorithm],
			recipient: resolvedAddress,
			secret: transaction.secret,
			proof: transaction.proof
    	};
    };

    static accountAddressRestriction = async (transaction, network, preLoadedMosaics) => {
    	const [addressAdditions, addressDeletions] = await Promise.all([
    		Promise.all(transaction.restrictionAdditions.map(address => {
    			return NamespaceService.resolveAddress(address, network);
    		})),
    		Promise.all(transaction.restrictionDeletions.map(address => {
    			return NamespaceService.resolveAddress(address, network);
    		}))
    	]);

    	return {
			transactionType: transaction.type,
			restrictionType: Constants.AddressRestrictionFlag[transaction.restrictionFlags],
			restrictionAddressAdditions: addressAdditions,
			restrictionAddressDeletions: addressDeletions
    	};
    };

    static accountMosaicRestriction = async (transaction, network, preLoadedMosaics) => {
    	return {
			transactionType: transaction.type,
			restrictionType: Constants.MosaicRestrictionFlag[transaction.restrictionFlags],
			restrictionMosaicAdditions: transaction.restrictionAdditions.map(restriction => restriction.id.toHex()),
			restrictionMosaicDeletions: transaction.restrictionDeletions.map(restriction => restriction.id.toHex())
    	};
    }

    static accountOperationRestriction = async (transaction, network, preLoadedMosaics) => {
    	return {
			transactionType: transaction.type,
			restrictionType: Constants.OperationRestrictionFlag[transaction.restrictionFlags],
			restrictionOperationAdditions: transaction.restrictionAdditions.map(operation => operation),
			restrictionOperationDeletions: transaction.restrictionDeletions.map(operation => operation)
    	};
    };

    static mosaicAddressRestriction = async (transaction, network, preLoadedMosaics) => {
    	const [resolvedMosaic, targetAddress] = await Promise.all([
    		NamespaceService.resolveMosaicId(transaction.mosaicId, network),
    		NamespaceService.resolveAddress(transaction.targetAddress, network)
    	]);

    	const mosaicAliasNames = await NamespaceService.getMosaicAliasNames(resolvedMosaic, network);

    	return {
			transactionType: transaction.type,
			mosaicId: resolvedMosaic.toHex(),
			mosaicAliasNames,
			targetAddress: targetAddress,
			restrictionKey: transaction.restrictionKey.toHex(),
			previousRestrictionValue: transaction.previousRestrictionValue.toString(),
			newRestrictionValue: transaction.newRestrictionValue.toString()
    	};
    };

    static mosaicGlobalRestriction = async (transaction, network, preLoadedMosaics) => {
    	const referenceMosaicId = transaction.referenceMosaicId.toHex() === '0000000000000000' ? transaction.mosaicId : transaction.referenceMosaicId;
    	const mosaicAliasNames = await NamespaceService.getMosaicAliasNames(referenceMosaicId, network);

    	return {
			transactionType: transaction.type,
			referenceMosaicId: referenceMosaicId.toHex(),
			mosaicAliasNames,
			restrictionKey: transaction.restrictionKey.toHex(),
			previousRestrictionType: Constants.MosaicRestrictionType[transaction.previousRestrictionType],
			previousRestrictionValue: transaction.previousRestrictionValue.compact(),
			newRestrictionType: Constants.MosaicRestrictionType[transaction.newRestrictionType],
			newRestrictionValue: transaction.newRestrictionValue.compact()
    	};
    };

    static accountMetadata = async (transaction, network, preLoadedMosaics) => {
    	const resolvedAddress = await NamespaceService.resolveAddress(transaction.targetAddress, network);

    	return {
			transactionType: transaction.type,
			scopedMetadataKey: transaction.scopedMetadataKey.toHex(),
			targetAddress: resolvedAddress,
			metadataValue: transaction.value,
			valueSizeDelta: transaction.valueSizeDelta
    	};
    };

    static mosaicMetadata = async (transaction, network, preLoadedMosaics) => {
    	const [resolvedMosaic, resolvedAddress] = await Promise.all([
    		NamespaceService.resolveMosaicId(transaction.targetMosaicId, network),
    		NamespaceService.resolveAddress(transaction.targetAddress, network)
    	]);

    	const mosaicAliasNames = await NamespaceService.getMosaicAliasNames(resolvedMosaic, network);

    	return {
			transactionType: transaction.type,
			scopedMetadataKey: transaction.scopedMetadataKey.toHex(),
			targetMosaicId: resolvedMosaic.toHex(),
			targetMosaicAliasNames: mosaicAliasNames,
			targetAddress: resolvedAddress,
			metadataValue: transaction.value,
			valueSizeDelta: transaction.valueSizeDelta
    	};
    };

    static namespaceMetadata = async (transaction, network, preLoadedMosaics) => {
		const repositoryFactory = new RepositoryFactoryHttp(network.node);
        const namespaceHttp = repositoryFactory.createNamespaceRepository();
    	const [namespaceName, resolvedAddress] = await Promise.all([
    		namespaceHttp.getNamespacesNames([transaction.targetNamespaceId]).toPromise(),
    		NamespaceService.resolveAddress(transaction.targetAddress)
    	]);

    	return {
			transactionType: transaction.type,
			scopedMetadataKey: transaction.scopedMetadataKey.toHex(),
			targetNamespaceId: transaction.targetNamespaceId.toHex(),
			namespaceName: namespaceName,
			targetAddress: resolvedAddress,
			metadataValue: transaction.value,
			valueSizeDelta: transaction.valueSizeDelta
    	};
    };

    static votingKeyLink = async (transaction, network, preLoadedMosaics) => {
    	return {
			transactionType: transaction.type,
			linkAction: Constants.LinkAction[transaction.linkAction],
			linkedPublicKey: transaction.linkedPublicKey,
			startEpoch: transaction.startEpoch,
			endEpoch: transaction.endEpoch
    	};
    };

    static vrfKeyLink = async (transaction, network, preLoadedMosaics) => {
    	return {
			transactionType: transaction.type,
			linkAction: Constants.LinkAction[transaction.linkAction],
			linkedPublicKey: transaction.linkedPublicKey,
    	};
    };

    static nodeKeyLink = async (transaction, network, preLoadedMosaics) => {
    	return {
			transactionType: transaction.type,
			linkAction: Constants.LinkAction[transaction.linkAction],
			linkedPublicKey: transaction.linkedPublicKey,
    	};
    };

    static accountKeyLink = async (transaction, network, preLoadedMosaics) => {
    	return {
			transactionType: transaction.type,
			linkAction: Constants.LinkAction[transaction.linkAction],
			linkedPublicKey: transaction.linkedPublicKey,
    	};
    };
};