import React from 'react';
import GraphicComponent from './GraphicComponent.js';
import { G, Path, Rect, Text } from 'react-native-svg';

export default class NamespaceIcon extends GraphicComponent {
    get iconColor() {
        return this.getIconColorFromHex(this.props.namespace.namespaceId);
    }

    get truncatedNamespaceName() {
        return this.truncString(this.props.namespace.namespaceName, 5);
    }

    get viewBox() {
        return this.props.hideCaption ? '115 0 16 105' : '0 0 261.333 131.313';
    }

    render() {
        return (
            <G
                version="1.1"
                x={this._x}
                y={this._y}
                width={this._width}
                height={this._height}
                viewBox={this.viewBox}
            >
                <Rect
                    x="25.266"
                    y="107.646"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill="none"
                    width="207.333"
                    height="23.667"
                />
                {!this.props.hideCaption && (
                    <Text
                        x="130"
                        y="122.8457"
                        style={this.styles.text}
                        textAnchor="middle"
                    >
                        {this.truncatedNamespaceName}
                    </Text>
                )}
                <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill={this.iconColor}
                    d="M112.358,13.08c4.963,0,9.925,0.041,14.889-0.018
                    c2.416-0.028,4.408,0.836,6.074,2.501c13.303,13.271,26.615,26.535,39.869,39.853c3.283,3.299,3.326,8.558,0.037,11.887
                    c-10.336,10.465-20.721,20.887-31.195,31.215c-3.641,3.59-8.674,3.32-12.311-0.285c-12.516-12.404-24.98-24.863-37.578-37.181
                    c-3.314-3.243-4.947-6.862-4.836-11.51c0.214-9.05,0.094-18.107,0.322-27.157c0.154-6.098,3.422-9.142,9.578-9.244
                    c5.049-0.084,10.1-0.018,15.15-0.018C112.358,13.108,112.358,13.095,112.358,13.08z M103.104,35.029
                    c3.468-0.028,6.512-3.168,6.51-6.717c-0.002-3.541-3.041-6.587-6.594-6.605c-3.849-0.023-6.973,2.932-6.917,6.539
                    C96.161,32.009,99.307,35.057,103.104,35.029z"
                />
            </G>
        );
    }
}
