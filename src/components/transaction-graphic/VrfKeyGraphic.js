import React from 'react';
import GraphicComponent from './graphics/GraphicComponent.js';
import Arrow from './graphics/Arrow.js';
import AccountIcon from './graphics/AccountIcon.js';
import CircleKey from './graphics/CircleKey.js';
import CircleKeyUnlink from './graphics/CircleKeyUnlink.js';
import Svg, { Text } from 'react-native-svg';

export default class VrfKeyGraphic extends GraphicComponent {
    constructor(props) {
        super(props);
    }

    get circleIconsToDisplay() {
        return [true];
    }

    get isLinkAction() {
        return this.props.linkAction === 'v_link';
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
                    address={this.props.linkedAccountAddress}
                />
                <Arrow x={this.arrowPositionX} y={this.arrowPositionY} />
                {this.isLinkAction && (
                    <CircleKey
                        x={this.getCircleIconPositionX(0)}
                        y={this.circleIconPositionY}
                    />
                )}
                {!this.isLinkAction && (
                    <CircleKeyUnlink
                        x={this.getCircleIconPositionX(0)}
                        y={this.circleIconPositionY}
                    />
                )}
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
