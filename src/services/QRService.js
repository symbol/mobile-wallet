import { 
	ContactQR, 
	AddressQR, 
	AccountQR, 
	TransactionQR, 
	QRCodeGenerator,
	QRCodeType
} from 'symbol-qr-library';
import { TransactionMapping, TransferTransaction } from 'symbol-sdk';
import MosaicService from './MosaicService';

const VALID_QR_TYPES = [
	QRCodeType.AddContact,
    QRCodeType.ExportAccount,
    QRCodeType.RequestTransaction,
    QRCodeType.ExportAddress
]


export default class {
	static QRCodeType = QRCodeType;

	static getQrType = (res: string): QRCodeType => {
		const data = JSON.parse(res.data);
		const type = data.type;

		return type;
	};

	static parseQrJson = async (res: string, network, password) => {
		try {
			const data = JSON.parse(res.data);
			const type = data.type;

			if(data === undefined || data === null)
				throw Error('Invalid QR');

			if(!this.checkValidType(type))
				throw Error('This Symbol QR is not supported yet');

			switch(type) {
				case QRCodeType.ExportAccount: 
					if(typeof password !== 'string') 
						return {type: 'error', error: 'No password'};
					try {
						const accountQR = AccountQR.fromJSON(res.data, password);
						return {
							privateKey: accountQR.accountPrivateKey
						};
					}
					catch(e) {
						return {type: 'error', error: 'Invalid password'};
					}
				case QRCodeType.RequestTransaction:
					const transaction = TransactionMapping.createFromPayload(data.data.payload);
					const formattedMosaic = await this.formatMosaic(transaction.mosaics[0], network);
					const formatedTransaction = {
						recipientAddress: transaction.recipientAddress.plain(),
						message: transaction.message.payload,
						mosaicName: formattedMosaic.mosaicName,
						amount: formattedMosaic.amount
					};

					return formatedTransaction;
				default: 
					return data.data
				
			};

		} 
		catch(e) { throw Error('Failed to parse QR. ' + e)};
	}

	static checkValidType = (type: string): boolean => {
		return VALID_QR_TYPES.includes(type);
	}

	static formatMosaic = async(mosaic, network) => {
		const mosaicModel = await MosaicService.getMosaicModelFromMosaicId(mosaic, network);
		const formattedMosaic = {
			amount: mosaic.amount.compact() / Math.pow(10, mosaicModel.divisibility),
			mosaicName: mosaicModel.mosaicName
		};

		return formattedMosaic;
	}
}