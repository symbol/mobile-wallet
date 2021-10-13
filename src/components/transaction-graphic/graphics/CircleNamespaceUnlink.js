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

export default class CircleNamespaceUnlink extends GraphicComponent {
    gradientId = 'namespace-unlink-circle-gradient';
    stopColor1 = 'rgb(177, 241, 255)';
    stopColor2 = 'rgb(5, 201, 255)';

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
                    <Path fill="#FFFFFF" d="M19.71,11.86c-0.3-0.3-0.62-0.46-1.05-0.45c-0.91,0.01-1.66,0-2.66,0c0,0,0,0,0,0.01c-1,0-1.88-0.02-2.8,0
                        c-1.12,0.02-1.75,0.57-1.77,1.68c-0.05,1.65-0.04,3.3-0.08,4.94c-0.02,0.85,0.27,1.51,0.88,2.1c0.58,0.57,1.15,1.13,1.72,1.71
                        l7.87-7.88C21.12,13.27,20.41,12.56,19.71,11.86z M14.21,15.4c-0.69,0.01-1.26-0.55-1.27-1.23c-0.01-0.66,0.56-1.2,1.26-1.19
                        c0.64,0,1.2,0.56,1.2,1.2C15.4,14.83,14.84,15.4,14.21,15.4z"
                    />
                    <Path fill="#FFFFFF" d="M26.97,21.27c-1.88,1.91-3.77,3.8-5.68,5.68c-0.66,0.65-1.58,0.61-2.24-0.05c-1.11-1.11-2.23-2.22-3.35-3.32
                        l-2.89,2.89l-0.88-0.88l13.66-13.66l0.88,0.88l-2.9,2.91l3.39,3.39C27.56,19.71,27.57,20.67,26.97,21.27z"
                    />
                </G>
            </Svg>
        );
    }
}
