import React from 'react';
import GraphicComponent from './GraphicComponent.js';
import { Defs, G, LinearGradient, Path, Stop, Text } from 'react-native-svg';

export default class MosaicIcon extends GraphicComponent {
    get iconColor() {
        return this.getIconColorFromHex(this.props.mosaicId || this.props.mosaic.mosaicId);
    }

    get truncatedMosaicId() {
        return this.truncString(this.props.mosaicId || this.props.mosaic.mosaicId);
    }

    get truncatedMosaicName() {
        const aliasName = this.props.aliasName || this.props.mosaic.aliasName;
        const mosaicId = this.props.mosaicId || this.props.mosaic.mosaicId;

        if (aliasName) return this.truncString(aliasName, 5);
        return this.truncString(mosaicId);
    }

    get viewBox() {
        return this.props.hideCaption ? '115 0 16 105' : '0 0 261.333 131.313';
    }

    render() {
        return (
            <G version="1.1" x={this._x} y={this._y} width={this._width} height={this._height} viewBox={this.viewBox}>
                <Defs>
                    <LinearGradient id="connector-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="rgb(255, 255, 255)" />
                        <Stop offset="100%" stopColor="rgb(196, 182, 208)" />
                    </LinearGradient>
                </Defs>
                <G>
                    <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        class="connector-body"
                        fill="url(#connector-gradient)"
                        d="M85.069,37.684c-4.227-0.093-4.648-3.084-3.658-5.896
                            c1.967-5.593,4.479-10.894,8.545-15.516c3.352-3.808,6.236-3.907,10.271-1.502c9.666,5.76,19.471,11.289,29.236,16.88
                            c0.838,0.479,1.803,0.731,2.709,1.089c4.115,4.153,11.125,4.823,17.736,1.344c8.076-4.25,12.982-11.063,15.193-19.869
                            c2.246-2.927,4.93-2.037,6.688,0.043c3.75,4.43,7.098,9.225,9.141,14.753c2.051,5.549,1.402,7.036-3.842,10.04
                            c-10.658,6.104-21.281,12.268-31.918,18.407c-2.475-0.013-3.744,1.917-5.115,3.435c-7.863,8.708-5.209,25.899,5.135,33.797
                            c1.434,4.357-1.178,6.186-4.74,6.635c-5.604,0.709-11.279,0.535-16.912,0.039c-4.732-0.416-6.383-3.324-6.32-7.834
                            c0.141-10.301,0.111-20.605,0.117-30.908c0-1.989-0.164-3.979-0.25-5.968c2.176-5.214-0.826-9.114-3.744-12.631
                            C107.52,37.008,94.752,34.359,85.069,37.684z"
                    />
                    <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        fill={this.iconColor}
                        d="M165.102,14.214c-2.211,8.805-7.117,15.619-15.193,19.869
                            c-6.611,3.479-13.621,2.809-17.736-1.344C143.149,26.563,154.125,20.388,165.102,14.214z"
                    />
                    <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        fill={this.iconColor}
                        d="M85.069,37.684c9.684-3.325,22.451-0.676,28.271,6.339
                            c2.918,3.517,5.92,7.417,3.744,12.631C106.413,50.331,95.741,44.008,85.069,37.684z"
                    />
                    <Path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        fill={this.iconColor}
                        d="M145.19,94.69c-10.344-7.898-12.998-25.09-5.135-33.797
                            c1.371-1.518,2.641-3.447,5.115-3.435C145.178,69.867,145.184,82.28,145.19,94.69z"
                    />
                </G>
                {!this.props.hideCaption && (
                    <Text x="130" y="122.8457" style={this.styles.text} textAnchor="middle">
                        {this.truncatedMosaicName}
                    </Text>
                )}
            </G>
        );
    }
}
