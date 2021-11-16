import type { MosaicModel } from '@src/storage/models/MosaicModel';
export type TransactionType =
    | 'unknown'
    | 'transfer'
    | 'fundsLock'
    | 'aggregate'
    | 'namespace'
    | 'mosaicAlias';
export type TransactionStatus = 'confirmed' | 'unconfirmed';

/**
 * Wallet transaction
 */
export interface TransactionModel {
    type: TransactionType;
    status: TransactionStatus;
    signerAddress: string;
    deadline: string;
    hash: string;
    fee: number;
}

/**
 * Transfer transaction model
 */
export interface TransferTransactionModel extends TransactionModel {
    type: 'transfer';
    isConfirmed: boolean;
    recipientAddress: string;
    messageText: string;
    messageEncrypted: boolean;
    mosaics: MosaicModel[];
}

/**
 * Funds lock transaction model
 */
export interface FundsLockTransactionModel extends TransactionModel {
    type: 'fundsLock';
    mosaic: MosaicModel;
    duration: number;
    aggregateHash: string;
}

/**
 * Aggregate transaction model
 */
export interface AggregateTransactionModel extends TransactionModel {
    type: 'aggregate';
    innerTransactions: TransactionModel[];
    cosignaturePublicKeys: string[];
    signTransactionObject: any;
}
/**
 * Namespace transaction model
 */
export interface NamespaceRegistrationTransactionModel
    extends TransactionModel {
    type: 'namespace';
    namespaceName: string;
}

export interface MosaicAliasTransactionModel extends TransactionModel {
    type: 'mosaicAlias';
    aliasAction: string;
    namespaceId: string;
    namespaceName: string;
    mosaicId: string;
}

export interface AccountAddressRestrictionModel extends TransactionModel {
    type: 'AccountAddressRestriction';
    restrictionType: string;
    restrictionAddressAdditions: Array<string>;
    restrictionAddressDeletions: Array<string>;
}

export interface AccountKeyLinkModel extends TransactionModel {
    type: 'AccountKeyLink';
    linkAction: string;
    linkedPublicKey: string;
}

export interface AccountMetadataModel extends TransactionModel {
    type: 'AccountMetadata';
    targetAddress: string;
    scopedMetadataKey: string;
    metadataValue: string;
    valueSizeDelta: number;
}

export interface AccountMosaicRestrictionModel extends TransactionModel {
    type: 'AccountMosaicRestriction';
    restrictionType: string;
    restrictionMosaicAdditions: Array;
    restrictionMosaicDeletions: Array;
}

export interface AccountOperationRestrictionModel extends TransactionModel {
    type: 'AccountOperationRestriction';
    restrictionType: string;
    restrictionOperationAdditions: Array;
    restrictionOperationDeletions: Array;
}

export interface AddressAliasModel extends TransactionModel {
    type: 'AddressAlias';
    address: string;
    namespaceId: string;
    namespaceName: string;
    aliasAction: string;
}

export interface HashLockModel extends TransactionModel {
    type: 'HashLock';
    duration: number;
    mosaics: Array;
}

export interface MosaicAddressRestrictionModel extends TransactionModel {
    type: 'MosaicAddressRestriction';
    referenceMosaicId: string;
    restrictionKey: string;
    previousRestrictionValue: string | number;
    newRestrictionValue: string | number;
}

export interface MosaicAliasModel extends TransactionModel {
    type: 'MosaicAlias';
    namespaceId: string;
    namespaceName: string;
    aliasAction: string;
    mosaicId: string;
}

export interface MosaicDefinitionModel extends TransactionModel {
    type: 'MosaicDefinition';
    mosaicId: string;
    divisibility: number;
    duration: number;
    supplyMutable: boolean;
    transferable: boolean;
    restrictable: boolean;
}

export interface MosaicGlobalRestrictionModel extends TransactionModel {
    type: 'MosaicGlobalRestriction';
    referenceMosaicId: string;
    restrictionKey: string;
    previousRestrictionType: string;
    previousRestrictionValue: string | number;
    newRestrictionType: string;
    newRestrictionValue: string | number;
}

export interface MosaicMetadataModel extends TransactionModel {
    type: 'MosaicMetadata';
    targetAddress: string;
    targetMosaicId: string;
    scopedMetadataKey: string;
    metadataValue: string;
    valueSizeDelta: number;
}

export interface MosaicSupplyChangeModel extends TransactionModel {
    type: 'MosaicSupplyChange';
    mosaicId: string;
    delta: number;
    action: string;
}

export interface MultisigAccountModificationModel extends TransactionModel {
    type: 'MultisigAccountModification';
    minRemovalDelta: number;
    minApprovalDelta: number;
    addressAdditionsCount: number;
    addressDeletionsCount: number;
    addressAdditions: Array;
    addressDeletions: Array;
}

export interface NamespaceMetadataModel extends TransactionModel {
    type: 'NamespaceMetadata';
    targetAddress: string;
    targetNamespaceId: string;
    scopedMetadataKey: string;
    metadataValue: string;
    valueSizeDelta: number;
}

export interface NamespaceRegistrationModel extends TransactionModel {
    type: 'NamespaceRegistration';
    namespaceId: string;
    namespaceName: string;
    duration: number;
}

export interface NodeKeyLinkModel extends TransactionModel {
    type: 'NodeKeyLink';
    linkAction: string;
    linkedPublicKey: string;
}

export interface SecretLockModel extends TransactionModel {
    type: 'SecretLock';
    duration: number;
    recipient: string;
    mosaics: Array;
    secret: string;
    hashAlgorithm: string;
}

export interface SecretProofModel extends TransactionModel {
    type: 'SecretProof';
    recipient: string;
    secret: string;
    hashAlgorithm: string;
    proof: string;
}

export interface VotingKeyLinkModel extends TransactionModel {
    type: 'VotingKeyLink';
    linkAction: string;
    linkedPublicKey: string;
    startEpoch: number;
    endEpoch: number;
}

export interface VrfKeyLinkModel extends TransactionModel {
    type: 'VrfKeyLink';
    linkAction: String;
    linkedPublicKey: String;
}
