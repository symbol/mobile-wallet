import React from 'react';
import GraphicComponent from './graphics/GraphicComponent.js';
import Arrow from './graphics/Arrow.js';
import AccountIcon from './graphics/AccountIcon.js';
import MosaicIcon from './graphics/MosaicIcon.js';
import CircleNamespace from './graphics/CircleNamespace.js';
import CircleNamespaceUnlink from './graphics/CircleNamespaceUnlink.js';
import Svg, { Text } from 'react-native-svg';

export default class MosaicAliasGraphic extends GraphicComponent {
    constructor(props) {
        super(props);
    }

    get circleIconsToDisplay() {
        return [true];
    }

    get isLinkAction() {
        return this.props.aliasAction === 'v_link';
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
                {this.isLinkAction && (
                    <CircleNamespace
                        x={this.getCircleIconPositionX(0)}
                        y={this.circleIconPositionY}
                    />
                )}
                {!this.isLinkAction && (
                    <CircleNamespaceUnlink
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
