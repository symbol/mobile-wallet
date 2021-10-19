import React from 'react';
import GraphicComponent from './graphics/GraphicComponent.js';
import Arrow from './graphics/Arrow.js';
import AccountIcon from './graphics/AccountIcon.js';
import CircleNamespace from './graphics/CircleNamespace.js';
import CircleNamespaceUnlink from './graphics/CircleNamespaceUnlink.js';
import Svg, {
    Text,
	G
} from 'react-native-svg';

export default class AddressAliasGraphic extends GraphicComponent {
	constructor(props) {
		super(props);
	}

    get circleIconsToDisplay() {
		return [true];
	}

	get isLinkAction() {
		return this.props.aliasAction === 'Link';
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
					address={this.props.address}
				/>
				<Arrow x={this.arrowPositionX} y={this.arrowPositionY} />
				{this.isLinkAction && <CircleNamespace
					x={this.getCircleIconPositionX(0)}
					y={this.circleIconPositionY}
				/>}
				{!this.isLinkAction && <CircleNamespaceUnlink
					x={this.getCircleIconPositionX(0)}
					y={this.circleIconPositionY}
				/>}
				<G>
					<Text 
						x={this.transactionTypeTextPositionX}
						y={this.transactionTypeTextPositionY}
						textAnchor="middle" 
						style={this.styles.message}
					>
						{this.transactionType}
					</Text>
				</G>
			</Svg>
        );
    }
}
