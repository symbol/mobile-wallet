import React from 'react';
import { connect } from 'react-redux';
import GraphicComponent from './graphics/GraphicComponent.js';
import Arrow from './graphics/Arrow.js';
import AccountIcon from './graphics/AccountIcon.js';
import CircleMessage from './graphics/CircleMessage.js';
import CircleMosaics from './graphics/CircleMosaics.js';
import CircleNativeMosaic from './graphics/CircleNativeMosaic.js';
import Svg, { G, Text } from 'react-native-svg';

class TransferGraphic extends GraphicComponent {
    constructor(props) {
        super(props);
    }

    get circleIconsToDisplay() {
        return [this.hasMessage, this.hasMosaic, this.hasNativeMosaic];
    }

    get hasMessage() {
        return typeof this.props.messageText === 'string' && this.props.messageText.length > 0;
    }

    get hasNativeMosaic() {
        return typeof this.nativeMosaic !== 'undefined';
    }

    get hasMosaic() {
        return this.mosaicList.length > 0;
    }

    get nativeMosaic() {
        return this.props.mosaics.find(mosaic => mosaic.mosaicId === this.nativeMosaicId);
    }

    get mosaicList() {
        return this.props.mosaics.filter(mosaic => mosaic.mosaicId !== this.nativeMosaicId);
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
                <G>
                    <AccountIcon
                        x={this.subjectPositionX}
                        y={this.subjectPositionY}
                        width={this.subjectWidth}
                        height={this.subjectHeight}
                        address={this.props.signerAddress}
                    />
                </G>
                <G>
                    <AccountIcon
                        x={this.objectPositionX}
                        y={this.objectPositionY}
                        width={this.subjectWidth}
                        height={this.subjectHeight}
                        address={this.props.recipientAddress}
                    />
                </G>
                <G>
                    <Arrow x={this.arrowPositionX} y={this.arrowPositionY} />
                </G>
                {this.hasMessage && <CircleMessage x={this.getCircleIconPositionX(0)} y={this.circleIconPositionY} />}
                {this.hasMosaic && <CircleMosaics x={this.getCircleIconPositionX(1)} y={this.circleIconPositionY} />}
                {this.hasNativeMosaic && <CircleNativeMosaic x={this.getCircleIconPositionX(2)} y={this.circleIconPositionY} />}
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
}))(TransferGraphic);
