import React from 'react';
import GraphicComponent from './graphics/GraphicComponent.js';
import Arrow from './graphics/Arrow.js';
import AccountIcon from './graphics/AccountIcon.js';
import CircleLock from './graphics/CircleLock.js';
import CircleMosaics from './graphics/CircleMosaics.js';
import Svg, {
    Text,
} from 'react-native-svg';

export default class SecretLockGraphic extends GraphicComponent {
	constructor(props) {
		super(props);
	}

    get circleIconsToDisplay() {
		return [true, this.hasMosaic];
	}

	get mosaic() {
		return {
			mosaicId: this.mosaicId,
			amount: this.amount,
			mosaicAliasName: this.mosaicAliasName
		};
	}

	get hasMosaic() {
		return this.mosaicId !== 'undefined';
	}

	get secretLockInfo() {
		return {
			duration: this.duration,
			secret: this.secret,
			hashAlgorithm: this.hashAlgorithm
		};
	}

    render() {
		
        return (
            <Svg
				x={0}
				y={0}
				width={this.transactionGraphicWidth}
				height={this.transactionGraphicHeight}
				viewBox={this.transactionGraphicViewbox}
			>

				<AccountIcon
					x={this.subjectPositionX}
					y={this.subjectPositionY}
					width={this.subjectWidth}
					height={this.subjectHeight}
					address={this.props.signerAddress}
				/>
				<AccountIcon
					x={this.objectPositionX}
					y={this.objectPositionY}
					width={this.subjectWidth}
					height={this.subjectHeight}
					address={this.props.recipientAddress}
				/>
				<Arrow x={this.arrowPositionX} y={this.arrowPositionY} />
				<CircleLock
					x={this.getCircleIconPositionX(0)}
					y={this.circleIconPositionY}
				/>
				{this.hasMosaic && <CircleMosaics
					x={this.getCircleIconPositionX(1)}
					y={this.circleIconPositionY}
				/>}
				<Text 
					x={this.transactionTypeTextPositionX}
					y={this.transactionTypeTextPositionY}
					textAnchor="middle" 
					style={this.styles.message}
				>
					{this.transactionType}
				</Text>
			</Svg>
        );
    }
}
