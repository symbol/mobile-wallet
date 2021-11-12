import React from 'react';
import GraphicComponent from './graphics/GraphicComponent.js';
import AccountIcon from './graphics/AccountIcon.js';
import MosaicIcon from './graphics/MosaicIcon.js';
import CircleRestriction from './graphics/CircleRestriction.js';
import Arrow from './graphics/Arrow.js';
import Svg, { 
	Text 
} from 'react-native-svg';

export default class MosaicGlobalRestrictionGraphic extends GraphicComponent {
	get circleIconsToDisplay() {
		return [true];
	}

	get mosaic() {
		return { mosaicId: this.props.referenceMosaicId };
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
				<MosaicIcon
					x={this.objectPositionX}
					y={this.objectPositionY}
					width={this.subjectWidth}
					height={this.subjectHeight}
					mosaic={this.mosaic}
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
