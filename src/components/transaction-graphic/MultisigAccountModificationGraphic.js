import React from 'react';
import GraphicComponent from './graphics/GraphicComponent.js';
import Arrow from './graphics/Arrow.js';
import AccountIcon from './graphics/AccountIcon.js';
import CircleEdit from './graphics/CircleEdit.js';
import CircleAccount from './graphics/CircleAccount.js';
import CircleAccountRemove from './graphics/CircleAccountRemove.js';
import Svg, {
    Text,
} from 'react-native-svg';

export default class NodeKeyLinkGraphic extends GraphicComponent {
	constructor(props) {
		super(props);
	}

    get circleIconsToDisplay() {
		return [true, this.isAddressAdditions, this.isAddressDeletions];
	}

	get isAddressAdditions() {
		return !!this.props.addressAdditions.length;
	}

	get isAddressDeletions() {
		return !!this.props.addressDeletions.length;
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
					address={this.props.signerAddress}
				/>
				<Arrow x={this.arrowPositionX} y={this.arrowPositionY} />
				<CircleEdit
					x={this.getCircleIconPositionX(0)}
					y={this.circleIconPositionY}
				/>
				{this.isAddressAdditions && <CircleAccount
					x={this.getCircleIconPositionX(1)}
					y={this.circleIconPositionY}
				/>}
				{this.isAddressDeletions && <CircleAccountRemove
					x={this.getCircleIconPositionX(2)}
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
