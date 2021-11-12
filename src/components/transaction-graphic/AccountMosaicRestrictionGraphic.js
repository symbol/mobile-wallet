import React from 'react';
import GraphicComponent from './graphics/GraphicComponent.js';
import AccountIcon from './graphics/AccountIcon.js';
import CircleRestriction from './graphics/CircleRestriction.js';
import Arrow from './graphics/Arrow.js';
import Svg, { Text } from 'react-native-svg';

export default class AccountMosaicRestrictionGraphic extends GraphicComponent {
	get circleIconsToDisplay() {
		return [true];
	}

	render() {
		return (
			<Svg
				x={0}
				y={0}
				width={this.transactionGraphicWidth}
				height={this.transactionGraphicHeight}
				viewBox={this.transactionGraphicViewbox}
				style={this.styles.transactionGraphicSvg}
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
					address={this.props.signerAddress}
				/>
				<Arrow x={this.arrowPositionX} y={this.arrowPositionY} />
				<CircleRestriction
					x={this.getCircleIconPositionX(0)}
					y={this.circleIconPositionY}
				/>
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
