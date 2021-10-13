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

export default class CircleNamespace extends GraphicComponent {
    gradientId = 'namespace-circle-gradient';
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
                    <Path fill="#FFFFFF" d="M15.895,11.409c0.903,0,1.806,0.007,2.709-0.003c0.439-0.005,0.802,0.152,1.104,0.455
                        c2.42,2.415,4.841,4.827,7.252,7.25c0.598,0.6,0.605,1.556,0.007,2.162c-1.88,1.903-3.77,3.799-5.675,5.678
                        c-0.663,0.653-1.578,0.604-2.239-0.052c-2.277-2.256-4.544-4.523-6.836-6.764c-0.603-0.589-0.899-1.248-0.88-2.094
                        c0.039-1.646,0.018-3.294,0.059-4.94c0.028-1.11,0.623-1.663,1.743-1.682c0.918-0.015,1.837-0.003,2.755-0.003
                        C15.895,11.414,15.895,11.412,15.895,11.409z M14.211,15.402c0.631-0.005,1.185-0.576,1.184-1.222c0-0.644-0.553-1.198-1.199-1.202
                        c-0.7-0.004-1.269,0.534-1.259,1.19C12.948,14.853,13.521,15.407,14.211,15.402z"
                    />
                </G>
            </Svg>
        );
    }
}
