import React from 'react';
import GraphicComponent from './GraphicComponent.js';
import { Circle, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

export default class CircleMosaicRestriction extends GraphicComponent {
    gradientId = 'mosaic-restriction-circle-gradient';
    stopColor1 = '#5200c6';
    stopColor2 = '#44004e';

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
                        d="M27.12,16.693c-0.09-0.09-0.19-0.17-0.3-0.24c-0.38-0.23-0.91-0.38-1.48-0.38c-1.149,0-2.08,0.58-2.08,1.3
                            v0.88c-1.42,0.29-2.89,0.35-4.36,0.32c-2.28-0.04-4.54-0.37-6.6-1.46c-0.09-0.05-0.18-0.1-0.27-0.16c-1.98-1.22-2-2.79-0.01-4
                            c2.1-1.29,4.47-1.54,6.86-1.65c0.31-0.01,0.62,0,1.14,0c2.03,0.09,4.23,0.35,6.261,1.37c0.189,0.09,0.37,0.18,0.55,0.29
                            C28.61,14.113,28.71,15.574,27.12,16.693z"
                    />
                    <Path
                        fill="#FFFFFF"
                        d="M23.26,19.833v2.93c-0.06,0.021-0.13,0.021-0.189,0.03c-2.69,0.3-5.37,0.35-8.05-0.13
                            c-0.89-0.16-1.76-0.39-2.59-0.74c-1.8-0.76-2.06-1.32-1.87-3.82C14.82,20.183,19.04,20.744,23.26,19.833z"
                    />
                    <Path
                        fill="#FFFFFF"
                        d="M27.43,21.333v-2.87c0.221-0.09,0.45-0.19,0.67-0.3C28.31,19.984,28.38,20.683,27.43,21.333z"
                    />
                    <Path
                        fill="#FFFFFF"
                        d="M26.69,26.223c-0.07,0.03-0.131,0.061-0.2,0.091c-0.33-0.23-0.721-0.36-1.15-0.36
                            c-0.84,0-1.57,0.52-1.88,1.26c-0.67,0.11-1.35,0.18-2.03,0.23c-2.85,0.199-5.7,0.09-8.45-0.88c-2.6-0.931-2.58-1.53-2.41-3.61
                            c4.23,1.689,8.45,2.149,12.69,1.41v0.149c0,0.351,0.23,0.681,0.61,0.91c0.38,0.24,0.899,0.38,1.47,0.38c1.15,0,2.09-0.58,2.09-1.29
                            v-1.25c0.221-0.069,0.45-0.149,0.67-0.239C28.41,24.904,28.31,25.454,26.69,26.223z"
                    />
                    <Circle
                        id="mark-bottom_1_"
                        fill="#FF00FF"
                        cx="25.343"
                        cy="27.994"
                        r="1.343"
                    />
                    <Path
                        id="mark-top"
                        fill="#FF00FF"
                        d="M26.686,23.931c0,0.6-0.602,1.086-1.343,1.086l0,0c-0.741,0-1.343-0.486-1.343-1.086v-5.98
                            c0-0.6,0.602-1.086,1.343-1.086l0,0c0.741,0,1.343,0.486,1.343,1.086V23.931z"
                    />
                </G>
            </G>
        );
    }
}
