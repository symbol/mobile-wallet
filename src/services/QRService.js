import { 
	ContactQR, 
	AddressQR, 
	AccountQR, 
	TransactionQR, 
	QRCodeGenerator,
	QRCodeType
} from 'symbol-qr-library';
import { TransactionMapping, TransactionType, Address } from 'symbol-sdk';
import MosaicService from './MosaicService';
import NetworkService from './NetworkService';

const VALID_QR_TYPES = [
	QRCodeType.AddContact,
    QRCodeType.ExportAccount,
    QRCodeType.RequestTransaction,
    QRCodeType.ExportAddress
]


export default class {
	static QRCodeType = QRCodeType;

	static getQrType = (res) => {
		const data = JSON.parse(res.data);
		const type = data.type;

		return type;
	};

	static parseQrJson = async (res, network, password) => {
		try {
			const data = JSON.parse(res.data);
			const type = data.type;

			if(data === undefined || data === null)
				throw Error('Invalid QR');

			if(''+data.network_id !== ''+NetworkService.getNetworkTypeFromModel(network))
				throw Error(`You are connected to the "${network.type}" node, but QR refers a different network. Please change the node in the Settings and try again`);

			if(!this.checkValidType(type))
				throw Error('This Symbol QR is not supported yet');

			switch(type) {
				case QRCodeType.AddContact: 
					return this.parseAddContactQR(data);
				case QRCodeType.ExportAccount: 
					return this.parseExportAccountQR(res, password);
				case QRCodeType.RequestTransaction:
					return this.parseRequestTransaction(data, network);
				default: 
					return data.data
			};
		} 
		catch(e) { throw Error('Failed to parse QR. ' + e.message)};
	}

	static parseRequestTransaction = async (data, network) => {
		const transaction = TransactionMapping.createFromPayload(data.data.payload);
		if(transaction.type !== TransactionType.TRANSFER)
			throw Error('Transaction type is not a transfer');

		const formattedMosaic = await this.formatMosaic(transaction.mosaics[0], network);
		const formatedTransaction = {
			recipientAddress: transaction.recipientAddress.pretty(),
			message: transaction.message.payload,
			mosaicName: formattedMosaic.mosaicName,
			mosaicId: formattedMosaic.mosaicId,
			amount: formattedMosaic.amount
		};

		return formatedTransaction;
	}

	static parseExportAccountQR = (res, password) => {
		try {
			const accountQR = AccountQR.fromJSON(res.data, password);
			return {
				privateKey: accountQR.accountPrivateKey
			};
		}
		catch(e) {
			if(typeof password !== 'string')
				return {type: 'error', error: 'No password'};
			return {type: 'error', error: 'Invalid password'};
		}
	}

	static parseAddContactQR = (data) => {
		const contactQr = QRCodeGenerator.fromJSON(JSON.stringify(data));
		const parsed = {
			...contactQr,
			address: Address.createFromPublicKey(contactQr.accountPublicKey, contactQr.networkType).pretty()
		};
		
		return parsed;
	} 

	static checkValidType = (type) => {
		return VALID_QR_TYPES.includes(type);
	}

	static formatMosaic = async(mosaic, network) => {
		const mosaicModel = await MosaicService.getMosaicModelFromMosaicId(mosaic, network);
		const formattedMosaic = {
			...mosaicModel,
			amount: mosaic.amount.compact() / Math.pow(10, mosaicModel.divisibility)
		};

		return formattedMosaic;
	}
}