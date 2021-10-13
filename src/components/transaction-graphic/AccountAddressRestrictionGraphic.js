import React from 'react';
import GraphicComponent from './graphics/GraphicComponent.js';
import AccountIcon from './graphics/AccountIcon.vue';
import RestrictionAddressCircle from './graphics/RestrictionAddressCircle.js';
import Arrow from './graphics/Arrow.js';
import Svg, { Text } from 'react-native-svg';

export default class AccountAddressRestrictionGraphic extends GraphicComponent {
	get transactionType() {
		return this.getTransactionTypeCaption(this.type);
	}

	get circleIconsToDisplay() {
		return [true];
	}

	get restrictionAddress() {
		return {
			added: this.restrictionAddressAdditions,
			removed: this.restrictionAddressDeletions
		};
	}

	render() {
		return (
			<Svg
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				x="0px"
				y="0px"
				width={this.getPixels(transactionGraphicWidth)}
				height={this.getPixels(transactionGraphicHeight)}
				viewBox={this.transactionGraphicViewbox}
				xml:space="preserve"
			>
				<AccountIcon
					x={this.subjectPositionX}
					y={this.subjectPositionY}
					width={this.subjectWidth}
					height={this.subjectHeight}
					address={this.props.signer}
				/>
				<AccountIcon
					x={this.objectPositionX}
					y={this.objectPositionY}
					width={this.subjectWidth}
					height={subjectHeight}
					address={this.props.signer}
				/>
				<Arrow x={arrowPositionX} y={arrowPositionY} />
				<RestrictionAddressCircle
					x={this.getCircleIconPositionX(0)}
					y={this.circleIconPositionY}
					title={this.restrictionType}
					data={this.restrictionAddress}
				/>
				<Text x={transactionTypeTextPositionX} y={transactionTypeTextPositionY} text-anchor="middle" class="message">
					{this.transactionType }
				</Text>
			</Svg>
		);
	}
}
