import React from 'react';
import { connect } from 'react-redux';
import GraphicComponent from './graphics/GraphicComponent.js';
import Arrow from './graphics/Arrow.js';
import AccountIcon from './graphics/AccountIcon.js';
import NamespaceIcon from './graphics/NamespaceIcon.js';
import CircleAdd from './graphics/CircleAdd.js';
import Svg, {
    Text,
	G
} from 'react-native-svg';

class NamespaceRegistrationGraphic extends GraphicComponent {
	constructor(props) {
		super(props);
	}

    get circleIconsToDisplay() {
		return [true];
	}

	get namespace() {
		return {
			namespaceName: this.props.namespaceName,
			namespaceId: this.props.namespaceId,
			duration: this.props.duration
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
				<NamespaceIcon
					x={this.objectPositionX}
					y={this.objectPositionY}
					width={this.subjectWidth}
					height={this.subjectHeight}
					namespace={this.namespace}
				/>
				<Arrow x={this.arrowPositionX} y={this.arrowPositionY} />
				<CircleAdd
					x={this.getCircleIconPositionX(0)}
					y={this.circleIconPositionY}
				/>
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

export default connect(state => ({
    address: state.account.selectedAccountAddress,
    network: state.network.selectedNetwork,
}))(NamespaceRegistrationGraphic);


