/*
 * enum TransactionInfoPreviewValueType
 **/
export const TransactionInfoPreviewValueType = {
    AmountIncoming: 'amountIncoming',
    AmountOutgoing: 'amountOutgoing',
    HasMessage: 'hasMessage',
    HasCustomMosaic: 'hasCustomMosaic',
    AggregateInner: 'aggregateInner',
    AggregatePendingSignature: 'aggregatePendingSignature',
    Other: 'other',
};

export interface TransactionInfoPreviewValue {
    type: PreviewValueType;
    value?: string | number;
}

export type TransactionInfoPreview = TransactionInfoPreviewValue[];
