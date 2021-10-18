import React from 'react';
import GraphicComponent from './GraphicComponent.js';
import {
    Circle,
    G,
    Defs,
    LinearGradient,
    Rect,
    Stop,
} from 'react-native-svg';

export default class CircleAdd extends GraphicComponent {
    gradientId = 'add-circle-gradient';
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
                    <LinearGradient id={this.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
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
                    <Rect x="17" y="11" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="4" height="16"/>
			        <Rect x="11" y="17" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="16" height="4"/>
                </G>
            </G>
        );
    }
}
