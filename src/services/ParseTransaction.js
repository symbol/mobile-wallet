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

import http from './http';
import helper from '../helper';
import { Constants } from '../config';
import { Address, Mosaic, MosaicId } from 'symbol-sdk';

export class ParseTransaction {
    static transferTransaction = async (transactionObj) => {
    	const [resolvedAddress, mosaicsFieldObject] = await Promise.all([
    		helper.resolvedAddress(transactionObj.recipientAddress),
    		helper.mosaicsFieldObjectBuilder(transactionObj.mosaics)
    	]);

    	return {
    		...transactionObj,
    		transactionBody: {
    			transactionType: transactionObj.type,
    			message: transactionObj.message,
    			recipient: resolvedAddress,
    			mosaics: mosaicsFieldObject
    		}
    	};
    }

    static namespaceRegistration = async (transactionObj) => {
    	return {
    		...transactionObj,
  			transactionBody: {
    			transactionType: transactionObj.type,
  				recipient: http.networkConfig.NamespaceRentalFeeSinkAddress.address,
  				registrationType: Constants.NamespaceRegistrationType[transactionObj.registrationType],
  				namespaceName: transactionObj.namespaceName,
  				namespaceId: transactionObj.namespaceId.toHex(),
  				parentId: typeof transactionObj.parentId !== 'undefined' ? transactionObj.parentId?.toHex() : Constants.Message.UNAVAILABLE,
  				duration: typeof transactionObj.duration !== 'undefined' ? transactionObj.duration?.compact() : Constants.Message.UNLIMITED
  			}
    	};
    }

    static addressAlias = async (transactionObj, network) => {
		const repositoryFactory = new RepositoryFactoryHttp(network.node);
        const namespaceHttp = repositoryFactory.createNamespaceRepository();
        const namespaceNames = await namespaceHttp.getNamespacesNames([transactionObj.namespaceId]).toPromise();
    	const namespaceName = namespaceNames.find(namespace => namespace.namespaceId === transactionObj.namespaceId.toHex());

    	return {
    		...transactionObj,
    		transactionBody: {
    			transactionType: transactionObj.type,
    			aliasAction: Constants.AliasAction[transactionObj.aliasAction],
    			namespaceId: transactionObj.namespaceId.toHex(),
    			namespaceName: namespaceName.name,
    			address: transactionObj.address.address
    		}
    	};
    }

    static mosaicAlias = async (transactionObj, network) => {
    	const repositoryFactory = new RepositoryFactoryHttp(network.node);
        const namespaceHttp = repositoryFactory.createNamespaceRepository();
        const namespaceNames = await namespaceHttp.getNamespacesNames([transactionObj.namespaceId]).toPromise();
    	const namespaceName = namespaceNames.find(namespace => namespace.namespaceId === transactionObj.namespaceId.toHex());

    	return {
    		...transactionObj,
    		transactionBody: {
    			transactionType: transactionObj.type,
    			aliasAction: Constants.AliasAction[transactionObj.aliasAction],
    			namespaceId: transactionObj.namespaceId.id.toHex(),
    			namespaceName: namespaceName.name,
    			mosaicId: transactionObj.mosaicId.id.toHex()
    		}
    	};
    };

    static mosaicDefinition = async (transactionObj) => {
    	const resolvedMosaic = await helper.resolveMosaicId(transactionObj.mosaicId);

    	return {
    		...transactionObj,
    		transactionBody: {
    			transactionType: transactionObj.type,
    			recipient: http.networkConfig.MosaicRentalSinkAddress.address,
    			mosaicId: resolvedMosaic.toHex(),
    			divisibility: transactionObj.divisibility,
    			duration: transactionObj.duration.compact(),
    			nonce: transactionObj.nonce.toHex(),
    			supplyMutable: transactionObj.flags.supplyMutable,
    			transferable: transactionObj.flags.transferable,
    			restrictable: transactionObj.flags.restrictable
    		}
    	};
    };

    static mosaicSupplyChange = async (transactionObj) => {
    	const resolvedMosaic = await helper.resolveMosaicId(transactionObj.mosaicId);

    	return {
    		...transactionObj,
    		transactionBody: {
    			transactionType: transactionObj.type,
    			mosaicId: resolvedMosaic.toHex(),
    			action: Constants.MosaicSupplyChangeAction[transactionObj.action],
    			delta: transactionObj.delta.compact()
    		}
    	};
    };

    static multisigAccountModification = async (transactionObj) => {
    	const [addressAdditions, addressDeletions] = await Promise.all([
    		Promise.all(transactionObj.addressAdditions.map(address => {
    			return helper.resolvedAddress(address);
    		})),
    		Promise.all(transactionObj.addressDeletions.map(address => {
    			return helper.resolvedAddress(address);
    		}))
    	]);

    	return {
    		...transactionObj,
    		transactionBody: {
    			transactionType: transactionObj.type,
    			minApprovalDelta: transactionObj.minApprovalDelta,
    			minRemovalDelta: transactionObj.minRemovalDelta,
    			addressAdditions: addressAdditions,
    			addressDeletions: addressDeletions
    		}
    	};
    }

    static hashLock = async (transactionObj) => {
    	const resolvedMosaic = await helper.resolveMosaicId(transactionObj.mosaic);

    	const mosaic = new Mosaic(new MosaicId(resolvedMosaic.toHex()), transactionObj.mosaic.amount);

    	const mosaicsFieldObject = await helper.mosaicsFieldObjectBuilder([mosaic]);

    	return {
    		...transactionObj,
    		transactionBody: {
    			transactionType: transactionObj.type,
    			duration: transactionObj.duration.compact(),
    			mosaics: mosaicsFieldObject,
    			hash: transactionObj.hash
    		}
    	};
    }

    static secretLock = async (transactionObj) => {
    	const [mosaicsFieldObject, resolvedAddress] = await Promise.all([
    		helper.mosaicsFieldObjectBuilder([transactionObj.mosaic]),
    		helper.resolvedAddress(transactionObj.recipientAddress)
    	]);

    	return {
    		...transactionObj,
    		transactionBody: {
    			transactionType: transactionObj.type,
    			duration: transactionObj.duration.compact(),
    			mosaics: mosaicsFieldObject,
    			secret: transactionObj.secret,
    			recipient: resolvedAddress,
    			hashAlgorithm: Constants.LockHashAlgorithm[transactionObj.hashAlgorithm]
    		}
    	};
    };

    static secretProof = async (transactionObj) => {
    	const resolvedAddress = await helper.resolvedAddress(transactionObj.recipientAddress);

    	return {
    		...transactionObj,
    		transactionBody: {
    			transactionType: transactionObj.type,
    			hashAlgorithm: Constants.LockHashAlgorithm[transactionObj.hashAlgorithm],
    			recipient: resolvedAddress,
    			secret: transactionObj.secret,
    			proof: transactionObj.proof
    		}
    	};
    };

    static accountAddressRestriction = async (transactionObj) => {
    	const [addressAdditions, addressDeletions] = await Promise.all([
    		Promise.all(transactionObj.restrictionAdditions.map(address => {
    			return helper.resolvedAddress(address);
    		})),
    		Promise.all(transactionObj.restrictionDeletions.map(address => {
    			return helper.resolvedAddress(address);
    		}))
    	]);

    	return {
    		...transactionObj,
    		transactionBody: {
    			transactionType: transactionObj.type,
    			restrictionType: Constants.AddressRestrictionFlag[transactionObj.restrictionFlags],
    			restrictionAddressAdditions: addressAdditions,
    			restrictionAddressDeletions: addressDeletions
    		}
    	};
    };

    static accountMosaicRestriction = async (transactionObj) => {
    	// Todo: mosaic restriction field
    	return {
    		...transactionObj,
    		transactionBody: {
    			transactionType: transactionObj.type,
    			restrictionType: Constants.MosaicRestrictionFlag[transactionObj.restrictionFlags],
    			restrictionMosaicAdditions: transactionObj.restrictionAdditions.map(restriction => restriction.id.toHex()),
    			restrictionMosaicDeletions: transactionObj.restrictionDeletions.map(restriction => restriction.id.toHex())
    		}
    	};
    }

    static accountOperationRestriction = async (transactionObj) => {
    	return {
    		...transactionObj,
    		transactionBody: {
    			transactionType: transactionObj.type,
    			restrictionType: Constants.OperationRestrictionFlag[transactionObj.restrictionFlags],
    			restrictionOperationAdditions: transactionObj.restrictionAdditions.map(operation => operation),
    			restrictionOperationDeletions: transactionObj.restrictionDeletions.map(operation => operation)
    		}
    	};
    };

    static mosaicAddressRestriction = async (transactionObj) => {
    	const [resolvedMosaic, targetAddress] = await Promise.all([
    		helper.resolveMosaicId(transactionObj.mosaicId),
    		helper.resolvedAddress(transactionObj.targetAddress)
    	]);

    	const mosaicAliasNames = await helper.getMosaicAliasNames(resolvedMosaic);

    	return {
    		...transactionObj,
    		transactionBody: {
    			transactionType: transactionObj.type,
    			mosaicId: resolvedMosaic.toHex(),
    			mosaicAliasNames,
    			targetAddress: targetAddress,
    			restrictionKey: transactionObj.restrictionKey.toHex(),
    			previousRestrictionValue: transactionObj.previousRestrictionValue.toString(),
    			newRestrictionValue: transactionObj.newRestrictionValue.toString()
    		}
    	};
    };

    static mosaicGlobalRestriction = async (transactionObj) => {
    	const referenceMosaicId = transactionObj.referenceMosaicId.toHex() === '0000000000000000' ? transactionObj.mosaicId : transactionObj.referenceMosaicId;
    	const mosaicAliasNames = await helper.getMosaicAliasNames(referenceMosaicId);

    	return {
    		...transactionObj,
    		transactionBody: {
    			transactionType: transactionObj.type,
    			referenceMosaicId: referenceMosaicId.toHex(),
    			mosaicAliasNames,
    			restrictionKey: transactionObj.restrictionKey.toHex(),
    			previousRestrictionType: Constants.MosaicRestrictionType[transactionObj.previousRestrictionType],
    			previousRestrictionValue: transactionObj.previousRestrictionValue.compact(),
    			newRestrictionType: Constants.MosaicRestrictionType[transactionObj.newRestrictionType],
    			newRestrictionValue: transactionObj.newRestrictionValue.compact()
    		}
    	};
    };

    static accountMetadata = async (transactionObj) => {
    	const resolvedAddress = await helper.resolvedAddress(transactionObj.targetAddress);

    	return {
    		...transactionObj,
    		transactionBody: {
    			transactionType: transactionObj.type,
    			scopedMetadataKey: transactionObj.scopedMetadataKey.toHex(),
    			targetAddress: resolvedAddress,
    			metadataValue: transactionObj.value,
    			valueSizeDelta: transactionObj.valueSizeDelta
    		}
    	};
    };

    static mosaicMetadata = async (transactionObj) => {
    	const [resolvedMosaic, resolvedAddress] = await Promise.all([
    		helper.resolveMosaicId(transactionObj.targetMosaicId),
    		helper.resolvedAddress(transactionObj.targetAddress)
    	]);

    	const mosaicAliasNames = await helper.getMosaicAliasNames(resolvedMosaic);

    	return {
    		...transactionObj,
    		transactionBody: {
    			transactionType: transactionObj.type,
    			scopedMetadataKey: transactionObj.scopedMetadataKey.toHex(),
    			targetMosaicId: resolvedMosaic.toHex(),
    			targetMosaicAliasNames: mosaicAliasNames,
    			targetAddress: resolvedAddress,
    			metadataValue: transactionObj.value,
    			valueSizeDelta: transactionObj.valueSizeDelta
    		}
    	};
    };

    static namespaceMetadata = async (transactionObj, network) => {
		const repositoryFactory = new RepositoryFactoryHttp(network.node);
        const namespaceHttp = repositoryFactory.createNamespaceRepository();
    	const [namespaceName, resolvedAddress] = await Promise.all([
    		namespaceHttp.getNamespacesNames([transactionObj.targetNamespaceId]).toPromise(),
    		helper.resolvedAddress(transactionObj.targetAddress)
    	]);

    	return {
    		...transactionObj,
    		transactionBody: {
    			transactionType: transactionObj.type,
    			scopedMetadataKey: transactionObj.scopedMetadataKey.toHex(),
    			targetNamespaceId: transactionObj.targetNamespaceId.toHex(),
    			namespaceName: namespaceName,
    			targetAddress: resolvedAddress,
    			metadataValue: transactionObj.value,
    			valueSizeDelta: transactionObj.valueSizeDelta
    		}
    	};
    };

    static votingKeyLink = async (transactionObj) => {
    	return {
    		...transactionObj,
    		transactionBody: {
    			linkAction: Constants.LinkAction[transactionObj.linkAction],
    			linkedPublicKey: transactionObj.linkedPublicKey,
    			linkedAccountAddress: Address.createFromPublicKey(transactionObj.linkedPublicKey, http.networkType).plain(),
    			startEpoch: transactionObj.startEpoch,
    			endEpoch: transactionObj.endEpoch
    		}
    	};
    };

    static vrfKeyLink = async (transactionObj) => {
    	return {
    		...transactionObj,
    		transactionBody: {
    			transactionType: transactionObj.type,
    			linkAction: Constants.LinkAction[transactionObj.linkAction],
    			linkedPublicKey: transactionObj.linkedPublicKey,
    			linkedAccountAddress: Address.createFromPublicKey(transactionObj.linkedPublicKey, http.networkType).plain()
    		}
    	};
    };

    static nodeKeyLink = async (transactionObj) => {
    	return {
    		...transactionObj,
    		transactionBody: {
    			transactionType: transactionObj.type,
    			linkAction: Constants.LinkAction[transactionObj.linkAction],
    			linkedPublicKey: transactionObj.linkedPublicKey,
    			linkedAccountAddress: Address.createFromPublicKey(transactionObj.linkedPublicKey, http.networkType).plain()
    		}
    	};
    };

    static accountKeyLink = async (transactionObj) => {
    	return {
    		...transactionObj,
    		transactionBody: {
    			transactionType: transactionObj.type,
    			linkAction: Constants.LinkAction[transactionObj.linkAction],
    			linkedPublicKey: transactionObj.linkedPublicKey,
    			linkedAccountAddress: Address.createFromPublicKey(transactionObj.linkedPublicKey, http.networkType).plain()
    		}
    	};
    };
};