import React from 'react';
import GraphicComponent from './GraphicComponent.js';
import { G, Path, Rect, Text } from 'react-native-svg';

export default class LockIcon extends GraphicComponent {
    get truncatedLockName() {
        return this.truncString(this.props.lockName, 8);
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
                        {this.truncatedLockName}
                    </Text>
                )}
                <Path
                    id="lock"
                    fill="#44004E"
                    d="M95.826,101.078c-0.749,0-1.354-0.605-1.354-1.355v-54.52c0-0.749,0.606-1.354,1.354-1.354h10.476
                    v-5.737c0-13.826,11.243-25.051,25.069-25.051c13.825,0,25.068,11.225,25.068,25.069v5.737h10.477c0.393,0,0.749,0.143,0.998,0.392
                    s0.392,0.606,0.356,0.944v54.52c0,0.75-0.605,1.355-1.354,1.355H95.826L95.826,101.078z M97.216,98.388h68.346V46.611H97.216V98.388
                    z M131.372,15.805c-12.276,0-22.325,10.031-22.325,22.325v5.737h44.633V38.13C153.679,25.836,143.647,15.805,131.372,15.805z"
                />
                <Rect
                    id="plane"
                    x="96.325"
                    y="45.491"
                    fill="#44004E"
                    width="70.699"
                    height="53.865"
                />
                <Path
                    id="key"
                    fill="#FFFFFF"
                    d="M131.318,84.508c-0.748,0-1.354-0.605-1.354-1.354v-5.738l-0.749-0.195
                    c-3.742-0.998-6.343-4.4-6.343-8.232c0-4.685,3.795-8.48,8.481-8.48c2.298,0,4.436,0.891,6.04,2.548
                    c1.55,1.603,2.387,3.688,2.352,5.897c0,3.901-2.602,7.288-6.344,8.232l-0.748,0.196v5.79
                    C132.672,83.903,132.066,84.508,131.318,84.508z M131.372,63.18c-3.154,0-5.737,2.602-5.737,5.738c0,3.152,2.601,5.737,5.737,5.737
                    c3.189,0,5.736-2.549,5.736-5.737C137.108,65.782,134.507,63.18,131.372,63.18z"
                />
            </G>
        );
    }
}
