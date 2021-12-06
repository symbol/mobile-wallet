import React from 'react';
import { connect } from 'react-redux';
import GraphicComponent from './graphics/GraphicComponent.js';
import Arrow from './graphics/Arrow.js';
import AccountIcon from './graphics/AccountIcon.js';
import MosaicIcon from './graphics/MosaicIcon.js';
import CircleEdit from './graphics/CircleEdit.js';
import Svg, { G, Text } from 'react-native-svg';

class MosaicSupplyChangeGraphic extends GraphicComponent {
    constructor(props) {
        super(props);
    }

    get circleIconsToDisplay() {
        return [true];
    }

    get mosaic() {
        return { mosaicId: this.props.mosaicId };
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
                <CircleEdit x={this.getCircleIconPositionX(0)} y={this.circleIconPositionY} />
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
}))(MosaicSupplyChangeGraphic);
