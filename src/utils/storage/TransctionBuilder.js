import { 
	Address, 
	Deadline,
	Mosaic,
	NetworkType, 
	PlainMessage,
	TransferTransaction
} from 'symbol-sdk';

export interface WalletTransaction {
	preview: Object,
	signedTransaction
}

export interface WalletMosaic {
	name: string;
	amount: number;
	mosaic?: Mosaic
}

export default class TransctionBuilder {
	static transfer = ({
		signerAccount,
		recipientAddress,
		mosaics,
		message,
		isEncrypted,
		fee
	}): WalletTransaction => {
		// const _recipientAddress = Address.createFromRawAddress(rawAddress);
		// const _networkType = NetworkType.TEST_NET; // replace with network type
		// const _mosaics = mosaics; // resolve amount and create sdk.Mosaic[]
		// const _message = resolveMessage(message)
		// const _fee = this.resolveFee(fee)

		// const transferTransaction = TransferTransaction.create(
		// 	Deadline.create(),
		// 	_recipientAddress,
		// 	_mosaics,
		// 	_message,
		// 	_networkType,
		// 	_fee
		// );

		//const signedTransaction = this.sign(signerAccount, transferTransaction)

		const transaction = {
			preview: {
				type: 'transfer',
				deadline: '15:51:00 28 oct 2020',
				signerAddress: 'TV6960-BACWBF-TXKGIG-56XWC7-AAHLT6-BGUK387-KLM',
				recipientAddress: 'TB6Q5E-YACWBP-CXKGIL-I6XWCH-DRFLTB-KUK34I-YJQ',
				message: 'Test message',
				mosaic: 'Symbol.XYM',
				amount: '228',
				fee: '0.5'
			},
			signedTransaction: {}
		}

		return transaction;
	}

	static sign = (account, transaction) => {
		const networkGenerationHash = '1DFB2FAA9E7F054168B0C5FCB84F4DEB62CC2B4D317D861F3168D161F54EA78B'; // replace
		return account.sign(transaction, networkGenerationHash);
	}

	static resolveFee = (unresolvedFee) => {
		const networkCurrencyDivisibility = 6; // replace
		const k = Math.pow(10, networkCurrencyDivisibility);
		return UInt64.fromUint(unresolvedFee * k);
	}

	static resolveMessage = (unresolvedMessage) => {
		return PlainMessage.create(unresolvedMessage)
	}
}