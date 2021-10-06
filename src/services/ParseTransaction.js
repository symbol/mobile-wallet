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

// import helper from '../helper';
import { Constants } from '@src/config/constants';
import { Mosaic, MosaicId } from 'symbol-sdk';
import { NamespaceService } from '@src/services/NamespaceService';

export class ParseTransaction {
    // static transferTransaction = async (transaction) => {
    // 	const [resolvedAddress, mosaicsFieldObject] = await Promise.all([
    // 		helper.resolvedAddress(transaction.recipientAddress),
    // 		helper.mosaicsFieldObjectBuilder(transaction.mosaics)
    // 	]);

    // 	return {
    // 		...transaction,
    // 		transactionBody: {
    // 			transactionType: transaction.type,
    // 			message: transaction.message,
    // 			recipient: resolvedAddress,
    // 			mosaics: mosaicsFieldObject
    // 		}
    // 	};
    // }

    static namespaceRegistration = async (transaction) => {
    	return {
			transactionType: 'NamespaceRegistration',
			registrationType: Constants.NamespaceRegistrationType[transaction.registrationType],
			namespaceName: transaction.namespaceName,
			namespaceId: transaction.namespaceId.toHex(),
			parentId: typeof transaction.parentId !== 'undefined' ? transaction.parentId?.toHex() : Constants.Message.UNAVAILABLE,
			duration: typeof transaction.duration !== 'undefined' ? transaction.duration?.compact() : Constants.Message.UNLIMITED
    	};
    }

    static addressAlias = async (transaction, network) => {
		const repositoryFactory = new RepositoryFactoryHttp(network.node);
        const namespaceHttp = repositoryFactory.createNamespaceRepository();
        const namespaceNames = await namespaceHttp.getNamespacesNames([transaction.namespaceId]).toPromise();
    	const namespaceName = namespaceNames.find(namespace => namespace.namespaceId === transaction.namespaceId.toHex());

    	return {
			transactionType: 'AddressAlias',
			aliasAction: Constants.AliasAction[transaction.aliasAction],
			namespaceId: transaction.namespaceId.toHex(),
			namespaceName: namespaceName.name,
			address: transaction.address.address
    	};
    }

    static mosaicAlias = async (transaction, network) => {
    	const repositoryFactory = new RepositoryFactoryHttp(network.node);
        const namespaceHttp = repositoryFactory.createNamespaceRepository();
        const namespaceNames = await namespaceHttp.getNamespacesNames([transaction.namespaceId]).toPromise();
    	const namespaceName = namespaceNames.find(namespace => namespace.namespaceId === transaction.namespaceId.toHex());

    	return {
			transactionType: 'MosaicAlias',
			aliasAction: Constants.AliasAction[transaction.aliasAction],
			namespaceId: transaction.namespaceId.id.toHex(),
			namespaceName: namespaceName.name,
			mosaicId: transaction.mosaicId.id.toHex()
    	};
    };

    static mosaicDefinition = async (transaction, network) => {
    	const resolvedMosaic = await NamespaceService.resolveMosaicId(transaction.mosaicId, network);

    	return {
			transactionType: 'MosaicDefinition',
			mosaicId: resolvedMosaic.toHex(),
			divisibility: transaction.divisibility,
			duration: transaction.duration.compact(),
			nonce: transaction.nonce.toHex(),
			supplyMutable: transaction.flags.supplyMutable,
			transferable: transaction.flags.transferable,
			restrictable: transaction.flags.restrictable
    	};
    };

    static mosaicSupplyChange = async (transaction, network) => {
    	const resolvedMosaic = await NamespaceService.resolveMosaicId(transaction.mosaicId, network);

    	return {
			transactionType: 'MosaicSupplyChange',
			mosaicId: resolvedMosaic.toHex(),
			action: Constants.MosaicSupplyChangeAction[transaction.action],
			delta: transaction.delta.compact()
    	};
    };

    static multisigAccountModification = async (transaction, network) => {
    	const [addressAdditions, addressDeletions] = await Promise.all([
    		Promise.all(transaction.addressAdditions.map(address => {
    			return NamespaceService.resolveAddress(address, network);
    		})),
    		Promise.all(transaction.addressDeletions.map(address => {
    			return NamespaceService.resolveAddress(address, network);
    		}))
    	]);

    	return {
			transactionType: 'MultisigAccountModification',
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

    static secretProof = async (transaction) => {
    	const resolvedAddress = await helper.resolvedAddress(transaction.recipientAddress);

    	return {
    		...transaction,
    		transactionBody: {
    			transactionType: transaction.type,
    			hashAlgorithm: Constants.LockHashAlgorithm[transaction.hashAlgorithm],
    			recipient: resolvedAddress,
    			secret: transaction.secret,
    			proof: transaction.proof
    		}
    	};
    };

    static accountAddressRestriction = async (transaction) => {
    	const [addressAdditions, addressDeletions] = await Promise.all([
    		Promise.all(transaction.restrictionAdditions.map(address => {
    			return helper.resolvedAddress(address);
    		})),
    		Promise.all(transaction.restrictionDeletions.map(address => {
    			return helper.resolvedAddress(address);
    		}))
    	]);

    	return {
    		...transaction,
    		transactionBody: {
    			transactionType: transaction.type,
    			restrictionType: Constants.AddressRestrictionFlag[transaction.restrictionFlags],
    			restrictionAddressAdditions: addressAdditions,
    			restrictionAddressDeletions: addressDeletions
    		}
    	};
    };

    static accountMosaicRestriction = async (transaction) => {
    	// Todo: mosaic restriction field
    	return {
    		...transaction,
    		transactionBody: {
    			transactionType: transaction.type,
    			restrictionType: Constants.MosaicRestrictionFlag[transaction.restrictionFlags],
    			restrictionMosaicAdditions: transaction.restrictionAdditions.map(restriction => restriction.id.toHex()),
    			restrictionMosaicDeletions: transaction.restrictionDeletions.map(restriction => restriction.id.toHex())
    		}
    	};
    }

    static accountOperationRestriction = async (transaction) => {
    	return {
    		...transaction,
    		transactionBody: {
    			transactionType: transaction.type,
    			restrictionType: Constants.OperationRestrictionFlag[transaction.restrictionFlags],
    			restrictionOperationAdditions: transaction.restrictionAdditions.map(operation => operation),
    			restrictionOperationDeletions: transaction.restrictionDeletions.map(operation => operation)
    		}
    	};
    };

    static mosaicAddressRestriction = async (transaction) => {
    	const [resolvedMosaic, targetAddress] = await Promise.all([
    		helper.resolveMosaicId(transaction.mosaicId),
    		helper.resolvedAddress(transaction.targetAddress)
    	]);

    	const mosaicAliasNames = await helper.getMosaicAliasNames(resolvedMosaic);

    	return {
    		...transaction,
    		transactionBody: {
    			transactionType: transaction.type,
    			mosaicId: resolvedMosaic.toHex(),
    			mosaicAliasNames,
    			targetAddress: targetAddress,
    			restrictionKey: transaction.restrictionKey.toHex(),
    			previousRestrictionValue: transaction.previousRestrictionValue.toString(),
    			newRestrictionValue: transaction.newRestrictionValue.toString()
    		}
    	};
    };

    static mosaicGlobalRestriction = async (transaction) => {
    	const referenceMosaicId = transaction.referenceMosaicId.toHex() === '0000000000000000' ? transaction.mosaicId : transaction.referenceMosaicId;
    	const mosaicAliasNames = await helper.getMosaicAliasNames(referenceMosaicId);

    	return {
    		...transaction,
    		transactionBody: {
    			transactionType: transaction.type,
    			referenceMosaicId: referenceMosaicId.toHex(),
    			mosaicAliasNames,
    			restrictionKey: transaction.restrictionKey.toHex(),
    			previousRestrictionType: Constants.MosaicRestrictionType[transaction.previousRestrictionType],
    			previousRestrictionValue: transaction.previousRestrictionValue.compact(),
    			newRestrictionType: Constants.MosaicRestrictionType[transaction.newRestrictionType],
    			newRestrictionValue: transaction.newRestrictionValue.compact()
    		}
    	};
    };

    static accountMetadata = async (transaction) => {
    	const resolvedAddress = await helper.resolvedAddress(transaction.targetAddress);

    	return {
    		...transaction,
    		transactionBody: {
    			transactionType: transaction.type,
    			scopedMetadataKey: transaction.scopedMetadataKey.toHex(),
    			targetAddress: resolvedAddress,
    			metadataValue: transaction.value,
    			valueSizeDelta: transaction.valueSizeDelta
    		}
    	};
    };

    static mosaicMetadata = async (transaction) => {
    	const [resolvedMosaic, resolvedAddress] = await Promise.all([
    		helper.resolveMosaicId(transaction.targetMosaicId),
    		helper.resolvedAddress(transaction.targetAddress)
    	]);

    	const mosaicAliasNames = await helper.getMosaicAliasNames(resolvedMosaic);

    	return {
    		...transaction,
    		transactionBody: {
    			transactionType: transaction.type,
    			scopedMetadataKey: transaction.scopedMetadataKey.toHex(),
    			targetMosaicId: resolvedMosaic.toHex(),
    			targetMosaicAliasNames: mosaicAliasNames,
    			targetAddress: resolvedAddress,
    			metadataValue: transaction.value,
    			valueSizeDelta: transaction.valueSizeDelta
    		}
    	};
    };

    static namespaceMetadata = async (transaction, network) => {
		const repositoryFactory = new RepositoryFactoryHttp(network.node);
        const namespaceHttp = repositoryFactory.createNamespaceRepository();
    	const [namespaceName, resolvedAddress] = await Promise.all([
    		namespaceHttp.getNamespacesNames([transaction.targetNamespaceId]).toPromise(),
    		helper.resolvedAddress(transaction.targetAddress)
    	]);

    	return {
    		...transaction,
    		transactionBody: {
    			transactionType: transaction.type,
    			scopedMetadataKey: transaction.scopedMetadataKey.toHex(),
    			targetNamespaceId: transaction.targetNamespaceId.toHex(),
    			namespaceName: namespaceName,
    			targetAddress: resolvedAddress,
    			metadataValue: transaction.value,
    			valueSizeDelta: transaction.valueSizeDelta
    		}
    	};
    };

    static votingKeyLink = async (transaction) => {
    	return {
    		...transaction,
    		transactionBody: {
    			linkAction: Constants.LinkAction[transaction.linkAction],
    			linkedPublicKey: transaction.linkedPublicKey,
    			startEpoch: transaction.startEpoch,
    			endEpoch: transaction.endEpoch
    		}
    	};
    };

    static vrfKeyLink = async (transaction) => {
    	return {
    		...transaction,
    		transactionBody: {
    			transactionType: transaction.type,
    			linkAction: Constants.LinkAction[transaction.linkAction],
    			linkedPublicKey: transaction.linkedPublicKey,
    		}
    	};
    };

    static nodeKeyLink = async (transaction) => {
    	return {
    		...transaction,
    		transactionBody: {
    			transactionType: transaction.type,
    			linkAction: Constants.LinkAction[transaction.linkAction],
    			linkedPublicKey: transaction.linkedPublicKey,
    		}
    	};
    };

    static accountKeyLink = async (transaction) => {
    	return {
    		...transaction,
    		transactionBody: {
    			transactionType: transaction.type,
    			linkAction: Constants.LinkAction[transaction.linkAction],
    			linkedPublicKey: transaction.linkedPublicKey,
    		}
    	};
    };
};