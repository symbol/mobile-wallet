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
import { Address, TransactionType, RepositoryFactoryHttp } from 'symbol-sdk';
import NamespaceService from '@src/services/NamespaceService';
import MosaicService from '@src/services/MosaicService';
import type { MosaicModel } from '@src/storage/models/MosaicModel';
import { formatTransactionLocalDateTime } from '@src/utils/format';

export class FormatTransaction {
	static format = async (transaction, network, preLoadedMosaics) => {
		let formattedTansaction;
		switch(transaction.type) {
			case TransactionType.AGGREGATE_BONDED:
			case TransactionType.AGGREGATE_COMPLETE:
				return FormatTransaction.aggregate(transaction, network, preLoadedMosaics);
			
			case TransactionType.TRANSFER: 
				formattedTansaction = await FormatTransaction.transferTransaction(transaction, network, preLoadedMosaics);
			break;

			case TransactionType.ADDRESS_ALIAS: 
				formattedTansaction = await FormatTransaction.addressAlias(transaction, network, preLoadedMosaics);
			break;

			case TransactionType.MOSAIC_ALIAS: 
				formattedTansaction = await FormatTransaction.mosaicAlias(transaction, network, preLoadedMosaics);
			break;

			case TransactionType.NAMESPACE_REGISTRATION: 
				formattedTansaction = await FormatTransaction.namespaceRegistration(transaction, network, preLoadedMosaics);
			break;

			case TransactionType.MOSAIC_DEFINITION: 
				formattedTansaction = await FormatTransaction.mosaicDefinition(transaction, network, preLoadedMosaics);
			break;

			case TransactionType.MOSAIC_SUPPLY_CHANGE: 
				formattedTansaction = await FormatTransaction.mosaicSupplyChange(transaction, network, preLoadedMosaics);
			break;

			case TransactionType.SECRET_LOCK: 
				formattedTansaction = await FormatTransaction.secretLock(transaction, network, preLoadedMosaics);
			break;

			case TransactionType.HASH_LOCK: 
				formattedTansaction = await FormatTransaction.hashLock(transaction, network, preLoadedMosaics);
			break;

			case TransactionType.SECRET_PROOF: 
				formattedTansaction = await FormatTransaction.secretProof(transaction, network, preLoadedMosaics);
			break;

			case TransactionType.VRF_KEY_LINK: 
				formattedTansaction = await FormatTransaction.vrfKeyLink(transaction, network, preLoadedMosaics);
			break;

			case TransactionType.ACCOUNT_KEY_LINK: 
				formattedTansaction = await FormatTransaction.accountKeyLink(transaction, network, preLoadedMosaics);
			break;

			case TransactionType.NODE_KEY_LINK: 
				formattedTansaction = await FormatTransaction.nodeKeyLink(transaction, network, preLoadedMosaics);
			break;

			case TransactionType.VOTING_KEY_LINK: 
				formattedTansaction = await FormatTransaction.votingKeyLink(transaction, network, preLoadedMosaics);
			break;

			case TransactionType.MOSAIC_GLOBAL_RESTRICTION: 
				formattedTansaction = await FormatTransaction.mosaicGlobalRestriction(transaction, network, preLoadedMosaics);
			break;

			case TransactionType.MOSAIC_ADDRESS_RESTRICTION: 
				formattedTansaction = await FormatTransaction.mosaicAddressRestriction(transaction, network, preLoadedMosaics);
			break;

			case TransactionType.ACCOUNT_OPERATION_RESTRICTION: 
				formattedTansaction = await FormatTransaction.accountOperationRestriction(transaction, network, preLoadedMosaics);
			break;

			case TransactionType.ACCOUNT_ADDRESS_RESTRICTION: 
				formattedTansaction = await FormatTransaction.accountAddressRestriction(transaction, network, preLoadedMosaics);
			break;

			case TransactionType.ACCOUNT_MOSAIC_RESTRICTION: 
				formattedTansaction = await FormatTransaction.accountMosaicRestriction(transaction, network, preLoadedMosaics);
			break;

			case TransactionType.MULTISIG_ACCOUNT_MODIFICATION: 
				formattedTansaction = await FormatTransaction.multisigAccountModification(transaction, network, preLoadedMosaics);
			break;

			case TransactionType.ACCOUNT_METADATA: 
				formattedTansaction = await FormatTransaction.accountMetadata(transaction, network, preLoadedMosaics);
			break;

			case TransactionType.NAMESPACE_METADATA: 
				formattedTansaction = await FormatTransaction.namespaceMetadata(transaction, network, preLoadedMosaics);
			break;

			case TransactionType.MOSAIC_METADATA: 
				formattedTansaction = await FormatTransaction.mosaicMetadata(transaction, network, preLoadedMosaics);
			break; 
		}

		return FormatTransaction.base(transaction, formattedTansaction, network);
	}

	static base = async (transaction, formattedTansaction, network) => {
		return {
			transactionType: transaction.type,
			deadline: formatTransactionLocalDateTime(transaction.deadline.toLocalDateTime(network.epochAdjustment)),
			signerAddress: transaction.signer.address.pretty(),
			...formattedTansaction
		}
	}

	static aggregate = async (transaction, network, preLoadedMosaics) => {
        let formattedInnerTransactions = [];

        for (const innerTransaction of transaction.innerTransactions) {
            formattedInnerTransactions.push(await FormatTransaction.format(innerTransaction, network, preLoadedMosaics));
        }

        return {
            info: {
				transactionType: transaction.type,
				deadline: formatTransactionLocalDateTime(transaction.deadline.toLocalDateTime(network.epochAdjustment)),
                signerAddress: transaction.signer.address.pretty(),
                receivedCosignatures: transaction.cosignatures,
				hash: transaction.hash,
            },
            innerTransactions: formattedInnerTransactions
        };
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
			//...transaction,
            transactionType: transaction.type,
			signerAddress: transaction.signer.address.pretty(),
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
			parentId: typeof transaction.parentId !== 'undefined' ? transaction.parentId?.toHex() : '',
			duration: typeof transaction.duration !== 'undefined' ? transaction.duration?.compact() : Constants.Message.UNLIMITED
    	};
    }

    static addressAlias = async (transaction, network, preLoadedMosaics) => {
		const repositoryFactory = new RepositoryFactoryHttp(network.node);
        const namespaceHttp = repositoryFactory.createNamespaceRepository();
        const namespaceNames = await namespaceHttp.getNamespacesNames([transaction.namespaceId]).toPromise();
    	const namespaceName = namespaceNames.find(namespace => namespace.namespaceId.toHex() === transaction.namespaceId.toHex());
		console.log('namespaceNames', namespaceNames)

    	return {
			transactionType: transaction.type,
			aliasAction: Constants.AliasAction[transaction.aliasAction],
			namespaceId: transaction.namespaceId.toHex(),
			namespaceName: namespaceName.name,
			address: transaction.address.pretty()
    	};
    }

    static mosaicAlias = async (transaction, network, preLoadedMosaics) => {
    	const repositoryFactory = new RepositoryFactoryHttp(network.node);
        const namespaceHttp = repositoryFactory.createNamespaceRepository();
        const namespaceNames = await namespaceHttp.getNamespacesNames([transaction.namespaceId]).toPromise();
    	const namespaceName = namespaceNames.find(namespace => namespace.namespaceId.toHex() === transaction.namespaceId.toHex());

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
			mosaics: [mosaicModel],
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
			secret: transaction.secret,
			recipientAddress: resolvedAddress,
			hashAlgorithm: Constants.LockHashAlgorithm[transaction.hashAlgorithm],
			mosaics: [mosaicModel],
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
			linkedAccountAddress: Address.createFromPublicKey(transaction.linkedPublicKey, network.networkType).pretty(),
			startEpoch: transaction.startEpoch,
			endEpoch: transaction.endEpoch
    	};
    };

    static vrfKeyLink = async (transaction, network, preLoadedMosaics) => {
    	return {
			transactionType: transaction.type,
			linkAction: Constants.LinkAction[transaction.linkAction],
			linkedPublicKey: transaction.linkedPublicKey,
			linkedAccountAddress: Address.createFromPublicKey(transaction.linkedPublicKey, network.networkType).pretty()
    	};
    };

    static nodeKeyLink = async (transaction, network, preLoadedMosaics) => {
    	return {
			transactionType: transaction.type,
			linkAction: Constants.LinkAction[transaction.linkAction],
			linkedPublicKey: transaction.linkedPublicKey,
			linkedAccountAddress: Address.createFromPublicKey(transaction.linkedPublicKey, network.networkType).pretty()
    	};
    };

    static accountKeyLink = async (transaction, network, preLoadedMosaics) => {
    	return {
			transactionType: transaction.type,
			linkAction: Constants.LinkAction[transaction.linkAction],
			linkedPublicKey: transaction.linkedPublicKey,
			linkedAccountAddress: Address.createFromPublicKey(transaction.linkedPublicKey, network.networkType).pretty()
    	};
    };
};