import React from 'react';
import GraphicComponent from './GraphicComponent.js';
import { Circle, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

export default class CircleKey extends GraphicComponent {
    gradientId = 'key-circle-gradient';
    stopColor1 = 'rgb(255, 197, 255)';
    stopColor2 = 'rgb(255, 0, 255)';

    render() {
        return (
            <G version="1.1" x={this._x} y={this._y} width="38.5px" height="38.167px" viewBox="0 0 38.5 38.167">
                <Defs>
                    <LinearGradient id={this.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor={this.stopColor1} />
                        <Stop offset="100%" stopColor={this.stopColor2} />
                    </LinearGradient>
                </Defs>
                <Circle fill-rule="evenodd" clip-rule="evenodd" fill={`url(#${this.gradientId})`} cx="19.115" cy="19.094" r="17.26" />
                <G>
                    <Path
                        fill="#FFFFFF"
                        stroke="#FFFFFF"
                        stroke-miterlimit="10"
                        d="M19.82,18.9c2.3-0.36,4.13-2.03,4.13-3.97
                        c0.01-0.94-0.38-1.86-1.1-2.59c-0.92-0.93-2.27-1.46-3.71-1.46c-2.68,0-4.84,1.82-4.84,4.05c0,1.95,1.7,3.62,3.99,3.97
                        c0.09,0.01,0.21,0.09,0.21,0.16v7.8c0,0.25,0.09,0.64,0.35,0.64h0.55c0.26,0,0.1-0.39,0.1-0.64v-1.13c0-0.1,0.44-0.23,0.53-0.23
                        h1.14c0.26,0,0.33-0.15,0.33-0.41v-1.01c0-0.23-0.05-0.58-0.45-0.58h-1.03c-0.09,0-0.52,0.04-0.52-0.05v-4.39
                        C19.5,18.98,19.74,18.91,19.82,18.9z M22.36,14.92c0,1.35-1.46,2.45-3.24,2.45c-1.79,0-3.24-1.1-3.24-2.45
                        c0-1.34,1.45-2.44,3.24-2.44C20.9,12.48,22.36,13.58,22.36,14.92z"
                    />
                </G>
            </G>
        );
    }
}
