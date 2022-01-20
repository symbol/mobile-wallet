import {
    AccountKeyTypeFlags,
    AccountType,
    AddressRestrictionFlag,
    AliasAction,
    BlockType,
    LinkAction,
    LockHashAlgorithm,
    LockStatus,
    MetadataType,
    MosaicRestrictionEntryType,
    MosaicRestrictionFlag,
    MosaicRestrictionType,
    MosaicSupplyChangeAction,
    NamespaceRegistrationType,
    NetworkType,
    OperationRestrictionFlag,
    ReceiptType,
    ResolutionType,
    TransactionType,
} from 'symbol-sdk';

export class Constants {
    static PageSize = 25;

    static Message = {
        UNLIMITED: '∞',
        UNAVAILABLE: 'v_na',
        INFINITY: '∞',
        MOSAIC: 'v_moasic',
        ADDRESS: 'v_address',
        NO_ALIAS: 'v_noAlias',
        ACTIVE: 'v_active',
        INACTIVE: 'v_inactive',
        UNKNOWN: 'v_unknown',
        EXPIRED: 'v_expired',
        UNCONFIRMED: 'unconfirmed',
        CONFIRMED: 'confirmed',
    };

    static TransactionType = {
        [TransactionType.TRANSFER]: 'Transfer',
        [TransactionType.NAMESPACE_REGISTRATION]: 'Namespace Registration',
        [TransactionType.ADDRESS_ALIAS]: 'Address Alias',
        [TransactionType.MOSAIC_ALIAS]: 'Mosaic Alias',
        [TransactionType.MOSAIC_DEFINITION]: 'Mosaic Definition',
        [TransactionType.MOSAIC_SUPPLY_CHANGE]: 'Mosaic Supply Change',
        [TransactionType.MULTISIG_ACCOUNT_MODIFICATION]: 'Multisig Account Modification',
        [TransactionType.AGGREGATE_COMPLETE]: 'Aggregate Complete',
        [TransactionType.AGGREGATE_BONDED]: 'Aggregate Bonded',
        [TransactionType.HASH_LOCK]: 'Hash Lock',
        [TransactionType.SECRET_LOCK]: 'Secret Lock',
        [TransactionType.SECRET_PROOF]: 'Secret Proof',
        [TransactionType.ACCOUNT_ADDRESS_RESTRICTION]: 'Account Address Restriction',
        [TransactionType.ACCOUNT_MOSAIC_RESTRICTION]: 'Account Mosaic Restriction',
        [TransactionType.ACCOUNT_OPERATION_RESTRICTION]: 'Account Operation Restriction',
        [TransactionType.ACCOUNT_KEY_LINK]: 'Account Key Link',
        [TransactionType.MOSAIC_ADDRESS_RESTRICTION]: 'Mosaic Address Restriction',
        [TransactionType.MOSAIC_GLOBAL_RESTRICTION]: 'Mosaic Global Restriction',
        [TransactionType.ACCOUNT_METADATA]: 'Account Metadata',
        [TransactionType.MOSAIC_METADATA]: 'Mosaic Metadata',
        [TransactionType.NAMESPACE_METADATA]: 'Namespace Metadata',
        [TransactionType.VRF_KEY_LINK]: 'VRF Key Link',
        [TransactionType.VOTING_KEY_LINK]: 'Voting Key Link',
        [TransactionType.NODE_KEY_LINK]: 'Node Key Link',
    };

    static MosaicSupplyChangeAction = {
        [MosaicSupplyChangeAction.Increase]: 'v_increase',
        [MosaicSupplyChangeAction.Decrease]: 'v_decrease',
    };

    static NamespaceRegistrationType = {
        [NamespaceRegistrationType.RootNamespace]: 'v_rootNamespace',
        [NamespaceRegistrationType.SubNamespace]: 'v_subNamespace',
    };

    static AliasAction = {
        [AliasAction.Link]: 'v_link',
        [AliasAction.Unlink]: 'v_unlink',
    };

    static LinkAction = {
        [LinkAction.Link]: 'v_link',
        [LinkAction.Unlink]: 'v_unlink',
    };

    static AccountType = {
        [AccountType.Unlinked]: 'Unlinked',
        [AccountType.Main]: 'Main',
        [AccountType.Remote]: 'Remote',
        [AccountType.Remote_Unlinked]: 'Remote Unlinked',
    };

    static AccountKeyTypeFlags = {
        [AccountKeyTypeFlags.Unset]: 'Unset',
        [AccountKeyTypeFlags.Linked]: 'Linked',
        [AccountKeyTypeFlags.VRF]: 'VRF',
        [AccountKeyTypeFlags.Node]: 'Node',
        [AccountKeyTypeFlags.All]: 'All',
    };

    static LockHashAlgorithm = {
        [LockHashAlgorithm.Op_Sha3_256]: 'Sha3 256',
        [LockHashAlgorithm.Op_Hash_160]: 'Hash 160',
        [LockHashAlgorithm.Op_Hash_256]: 'Hash 256',
    };

    static MetadataType = {
        [MetadataType.Account]: 'Account',
        [MetadataType.Mosaic]: 'Mosaic',
        [MetadataType.Namespace]: 'Namespace',
    };

    static ReceiptType = {
        [ReceiptType.Harvest_Fee]: 'Harvest Fee',
        [ReceiptType.LockHash_Created]: 'LockHash Created',
        [ReceiptType.LockHash_Completed]: 'LockHash Completed',
        [ReceiptType.LockHash_Expired]: 'LockHash Expired',
        [ReceiptType.LockSecret_Created]: 'LockSecret Created',
        [ReceiptType.LockSecret_Completed]: 'LockSecret Completed',
        [ReceiptType.LockSecret_Expired]: 'LockSecret Expired',
        [ReceiptType.Mosaic_Levy]: 'Mosaic Levy',
        [ReceiptType.Mosaic_Rental_Fee]: 'Mosaic Rental Fee',
        [ReceiptType.Namespace_Rental_Fee]: 'Namespace Rental Fee',
        [ReceiptType.Mosaic_Expired]: 'Mosaic Expired',
        [ReceiptType.Namespace_Expired]: 'Namespace Expired',
        [ReceiptType.Namespace_Deleted]: 'Namespace Deleted',
        [ReceiptType.Inflation]: 'Inflation',
    };

    static ResolutionType = {
        [ResolutionType.Address]: 'Address',
        [ResolutionType.Mosaic]: 'Mosaic',
    };

    static NetworkType = {
        [NetworkType.MAIN_NET]: 'MAINNET',
        [NetworkType.TEST_NET]: 'TESTNET',
    };

    static RoleType = {
        1: 'Peer node',
        2: 'Api node',
        3: 'Peer Api node',
        4: 'Voting node',
        5: 'Peer Voting node',
        6: 'Api Voting node',
        7: 'Peer Api Voting node',
    };

    static AddressRestrictionFlag = {
        [AddressRestrictionFlag.AllowIncomingAddress]: 'v_AllowIncomingAddresses',
        [AddressRestrictionFlag.AllowOutgoingAddress]: 'v_AllowOutgoingAddresses',
        [AddressRestrictionFlag.BlockIncomingAddress]: 'v_BlockIncomingAddresses',
        [AddressRestrictionFlag.BlockOutgoingAddress]: 'v_BlockOutgoingAddresses',
    };

    static MosaicRestrictionFlag = {
        [MosaicRestrictionFlag.AllowMosaic]: 'v_AllowMosaics',
        [MosaicRestrictionFlag.BlockMosaic]: 'v_BlockMosaics',
    };

    static OperationRestrictionFlag = {
        [OperationRestrictionFlag.AllowOutgoingTransactionType]: 'v_AllowOutgoingTransactions',
        [OperationRestrictionFlag.BlockOutgoingTransactionType]: 'v_BlockOutgoingTransactions',
    };

    static MosaicRestrictionEntryType = {
        [MosaicRestrictionEntryType.ADDRESS]: 'v_MosaicAddressRestriction',
        [MosaicRestrictionEntryType.GLOBAL]: 'v_MosaicGlobalRestriction',
    };

    static MosaicRestrictionType = {
        [MosaicRestrictionType.EQ]: 'v_mosaicRestrictionTypeEQ',
        [MosaicRestrictionType.GE]: 'v_mosaicRestrictionTypeGE',
        [MosaicRestrictionType.GT]: 'v_mosaicRestrictionTypeGT',
        [MosaicRestrictionType.LE]: 'v_mosaicRestrictionTypeLE',
        [MosaicRestrictionType.LT]: 'v_mosaicRestrictionTypeLT',
        [MosaicRestrictionType.NE]: 'v_mosaicRestrictionTypeNE',
        [MosaicRestrictionType.NONE]: 'v_mosaicRestrictionTypeNONE',
    };

    static MerkleRootsOrder = [
        'AccountState',
        'Namespace',
        'Mosaic',
        'Multisig',
        'HashLockInfo',
        'SecretLockInfo',
        'AccountRestriction',
        'MosaicRestriction',
        'Metadata',
    ];

    static ReceiptTransactionStatamentType = {
        BalanceChangeReceipt: 'Balance Change Receipt',
        BalanceTransferReceipt: 'Balance Transfer Receipt',
        InflationReceipt: 'Inflation Receipt',
        ArtifactExpiryReceipt: 'Artifact Expiry Receipt',
    };

    static LockStatusType = {
        [LockStatus.UNUSED]: 'Unused',
        [LockStatus.USED]: 'Used',
    };

    static BlockType = {
        [BlockType.ImportanceBlock]: 'Importance Block',
        [BlockType.NemesisBlock]: 'Nemesis Block',
        [BlockType.NormalBlock]: 'Normal Block',
    };
}
