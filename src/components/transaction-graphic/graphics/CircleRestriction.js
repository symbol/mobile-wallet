import React from 'react';
import GraphicComponent from './GraphicComponent.js';
import { Circle, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

export default class CircleRestriction extends GraphicComponent {
    gradientId = 'restriction-circle-gradient';
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
                        d="M19.371,10.805c-4.755,0-8.612,3.855-8.612,8.612c0,4.757,3.857,8.612,8.612,8.612
                        c4.757,0,8.612-3.855,8.612-8.612C27.982,14.66,24.127,10.805,19.371,10.805z M20.232,23.155c0,0.313-0.256,0.567-0.568,0.567
                        h-0.586c-0.312,0-0.568-0.255-0.568-0.567v-0.586c0-0.312,0.256-0.568,0.568-0.568h0.586c0.312,0,0.568,0.256,0.568,0.568V23.155z
                        M20.232,19.71c0,0.312-0.256,0.568-0.568,0.568h-0.586c-0.312,0-0.568-0.256-0.568-0.568v-4.031c0-0.313,0.256-0.567,0.568-0.567
                        h0.586c0.312,0,0.568,0.255,0.568,0.567V19.71z"
                    />
                </G>
            </G>
        );
    }
}
