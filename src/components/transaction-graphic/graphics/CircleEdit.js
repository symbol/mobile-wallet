import React from 'react';
import GraphicComponent from './GraphicComponent.js';
import Svg, {
    Circle,
    G,
    Path,
    Defs,
    LinearGradient,
    Stop,
} from 'react-native-svg';

export default class CircleEdit extends GraphicComponent {
    gradientId = 'edit-circle-gradient';
    stopColor1 = 'rgb(255, 197, 255)';
    stopColor2 = 'rgb(255, 0, 255)';

    render() {
        return (
            <Svg
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
                    <Path fill="#FFFFFF" d="M27.152,14.584c0.354-0.354,0.354-0.943,0-1.279l-2.124-2.124c-0.336-0.354-0.926-0.354-1.279,0
                        l-1.669,1.661l3.402,3.403 M11.082,23.849v3.403h3.403l10.036-10.045l-3.403-3.403L11.082,23.849z"
                    />
                </G>
            </Svg>
        );
    }
}