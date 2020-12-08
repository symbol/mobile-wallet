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

	static parseQrJson = async (res: string, network) => {
		try {
			const data = JSON.parse(res.data);
			const type = data.type;

			if(!this.checkValidType(type))
				throw Error('This Symbol QR is not supported yet');

			switch(type) {
				case QRCodeType.RequestTransaction:
					const transaction = TransactionMapping.createFromPayload(data.data.payload);
					const formatedTransaction = {
						recipientAddress: transaction.recipientAddress.plain(),
						message: transaction.message.payload,
						mosaicName: transaction.mosaics[0].id.id.toHex(),
						amount: await this.resolveAmount(transaction.mosaics[0], network)
					};
					return formatedTransaction;
				default: 
					return data.data
				
			};

		} 
		catch(e) { throw Error('Failed to parse QR. ' + e.message)};
	}

	static checkValidType = (type: string): boolean => {
		return VALID_QR_TYPES.includes(type);
	}

	static resolveAmount = async(mosaic, network) => {
		const mosaicModel = await MosaicService.getMosaicModelFromMosaicId(mosaic, network);

		return mosaic.amount.compact() / Math.pow(10, mosaicModel.divisibility);
	}
}