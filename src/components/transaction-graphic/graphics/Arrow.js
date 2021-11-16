import React from 'react';
import GraphicComponent from './GraphicComponent.js';
import Svg, { G, Line, Polygon } from 'react-native-svg';

export default class Arrow extends GraphicComponent {
    render() {
        return (
            <G
                version="1.1"
                x={this._x}
                y={this._y}
                width="302px"
                height="27px"
                viewBox="0 0 302 27"
            >
                <Line
                    style={this.styles.arrowBody}
                    fill="none"
                    strokeWidth="5"
                    strokeMiterlimit="10"
                    x1="39"
                    y1="13.5"
                    x2="246"
                    y2="13.5"
                />
                <Polygon
                    transform="translate(-40 0)"
                    style={this.styles.arrowEnd}
                    points="269.176,22.628 273.267,13 269.176,3.372 292,13"
                />
            </G>
        );
    }
}
