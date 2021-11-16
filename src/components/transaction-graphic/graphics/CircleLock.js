import React from 'react';
import GraphicComponent from './GraphicComponent.js';
import { Circle, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

export default class CircleLock extends GraphicComponent {
    gradientId = 'lock-circle-gradient';
    stopColor1 = 'rgb(255, 197, 255)';
    stopColor2 = 'rgb(255, 0, 255)';

    render() {
        return (
            <G
                version="1.1"
                x={this._x}
                y={this._y}
                width="38.5px"
                height="38.167px"
                viewBox="0 0 38.5 38.167"
            >
                <Defs>
                    <LinearGradient
                        id={this.gradientId}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <Stop offset="0%" stopColor={this.stopColor1} />
                        <Stop offset="100%" stopColor={this.stopColor2} />
                    </LinearGradient>
                </Defs>
                <Circle
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill={`url(#${this.gradientId})`}
                    cx="19.115"
                    cy="19.094"
                    r="17.26"
                />
                <G>
                    <Path
                        fill="#FFFFFF"
                        stroke="#FFFFFF"
                        stroke-miterlimit="10"
                        d="M 22 17h-7a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V18a1 1 0 0 0-1-1zm-7-1 a2 2 0 0 0-2 2
                        v5 a2 2 0 0 0 2 2 h7 a2 2 0 0 0 2-2 V18 a2 2 0 0 0-2-2 h-2 zm 0 -3 a 3.5 1.5 0 1 1 7-1 v3 h-1 V14 a2.5 2.5 0 0 0-5 0 v1 h-1 V15z"
                    />
                </G>
            </G>
        );
    }
}
