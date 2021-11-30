import React from 'react';
import { connect } from 'react-redux';
import GraphicComponent from './GraphicComponent.js';
import { G, Path, Rect, TSpan, Text } from 'react-native-svg';
import translate from '@src/locales/i18n';

class AccountIcon extends GraphicComponent {
    get iconColor() {
        return this.getIconColor(this.props.address);
    }

    get isUserAddress() {
        return this.props.userAddress === this.props.address;
    }

    get formattedAddress() {
        return this.isUserAddress ? translate('unsortedKeys.currentAccount') : this.truncString(this.props.address);
    }

    get stackedAddress() {
        return this.stackAddress(this.props.address);
    }

    get viewBox() {
        return this.props.hideCaption ? '115 0 16 105' : '0 0 261.333 131.313';
    }

    render() {
        return (
            <G version="1.1" x={this._x} y={this._y} width={this._width} height={this._height} viewBox={'0 0 261.333 131.313'}>
                <Rect x="25.266" y="107.646" fill-rule="evenodd" clip-rule="evenodd" fill="none" width="207.333" height="23.667" />
                {!this.props.hideCaption && this.isUserAddress && (
                    <Text x="130" y="122.8457" style={this.styles.text} textAnchor="middle">
                        {this.formattedAddress}
                    </Text>
                )}
                {!this.props.hideCaption && !this.isUserAddress && (
                    <Text x="120" y="122.8457" style={this.styles.textSmaller} textAnchor="middle">
                        <TSpan x="130" dy="-9">
                            {this.stackedAddress[0]}
                        </TSpan>
                        <TSpan x="130" dy="14">
                            {this.stackedAddress[1]}
                        </TSpan>
                        <TSpan x="130" dy="14">
                            {this.stackedAddress[2]}
                        </TSpan>
                    </Text>
                )}
                <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill={this.iconColor}
                    d="M107.775,29.897c0.11-2.393,1.469-4.188,2.864-5.965
                        c3.048-1.255,3.729,1.313,4.431,3.09c1.125,2.856,2.42,5.67,3.176,8.668c-1.665,4.138-1.7,8.836-4.374,12.65
                        c-0.821,1.172-0.687,2.651-0.132,3.862c2.345,5.117,3.962,10.643,7.713,15.007c5.933,6.903,13.437,7.12,19.964,0.701
                        c1.067-1.049,1.933-2.298,3.157-3.203c4.781-2.331,5.483-2.001,5.302,2.479c-3.134,6.533-3.136,6.54,3.791,8.697
                        c5.604,1.746,10.847,4.162,15.436,7.91c2.636,2.153,4.714,4.73,6.01,7.836c2.767,6.629,0.91,9.446-6.062,9.446
                        c-25.46,0.001-50.919,0.005-76.379-0.003c-5.917-0.002-6.961-1.378-5.369-7.242c1.377-5.071,4.73-8.7,8.907-11.649
                        c4.818-3.403,10.195-5.654,15.89-6.994c3.9-0.917,3.877-2.855,2.286-5.771c-1.985-3.637-3.917-7.306-5.762-11.016
                        c-1.813-3.646-2.879-7.571-1.92-11.578c0.956-3.998-1.518-7.904,0.072-11.818C108.06,33.488,106.662,31.447,107.775,29.897z"
                />
                <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill={this.iconColor}
                    d="M149.876,67.188c-0.404-5.872-3.108-1.998-5.086-1.199
                        c-1.204-3.42,0.808-5.817,2.62-8.278c1.204-0.877,2.237-1.888,2.553-3.435c0.103-0.405,0.229-0.802,0.349-1.199
                        c0.44-1.873,0.59-3.707-0.636-5.387c-0.26-0.368-0.465-0.76-0.636-1.175c-0.632-1.697-0.229-3.663-1.401-5.21
                        c-1.313-2.182-3.421-2.083-5.596-2.151c-3.911-0.125-7.841-0.393-10.932-3.333c-2.035-3.97-4.009-7.979-4.421-12.496
                        c-0.549-6.004,3.39-9.86,9.502-9.444c14.104,2.032,22.724,15.274,19.107,29.276c-0.127,0.493,0.353,1.144,0.55,1.721
                        c0.715,3.103,0.664,6.207,0.028,9.314C153.878,58.523,151.877,62.855,149.876,67.188z"
                />
                <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill={this.iconColor}
                    d="M136.192,13.88c-6.989,0.567-10.491,6.707-6.721,15.414
                        c0.913,2.108,2.521,3.977,2.34,6.483c-4.664,0.345-9.343-0.588-14.004,0.146c-1.74-2.197-2.747-4.654-3.429-7.409
                        c-0.459-1.855-1.019-4.28-3.739-4.581C117.485,15.119,127.354,11.236,136.192,13.88z"
                />
                <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill={this.iconColor}
                    d="M155.878,54.191c-0.01-3.105-0.019-6.21-0.028-9.314
                        C157.691,47.976,157.332,51.082,155.878,54.191z"
                />
                <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill={this.iconColor}
                    d="M107.775,29.897c-0.188,1.731,0.723,3.677-0.999,5.107
                        C106.587,33.201,106.569,31.429,107.775,29.897z"
                />
                <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill="#FEFEFE"
                    d="M117.808,35.923c4.634-3.386,9.317-1.942,14.004-0.146
                        c3.862,1.618,7.917,2.616,12.045,1.926c3.065-0.512,4.242,0.942,5.128,3.315c0.881,1.818-0.407,3.951,0.831,5.717
                        c0.229,0.247,0.512,0.348,0.846,0.304c0.954,2.305,0.975,4.607-0.012,6.909l0.049-0.094c-0.576,1.418-0.718,3.058-2.079,4.076
                        c-2.852,1.937-2.223,5.528-3.829,8.058c-10.658,12.183-22.736,10.036-28.462-5.123c-0.548-1.45-1.613-2.528-2.163-3.844
                        c-1.519-3.635-4.027-7.059-0.158-11.234C116.316,43.293,114.791,38.597,117.808,35.923z"
                />
                <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill="#FAF9FA"
                    d="M131.596,86.348c-4.086,0.139-7.628-1.205-10.59-3.779
                        c-0.985-0.855-3.435-1.527-1.698-3.795c1.208-1.576,2.265-2.247,4.525-1.178c5.184,2.451,10.693,2.553,15.829-0.171
                        c2.445-1.297,3.336,0.133,4.391,1.535c1.448,1.928-0.664,2.647-1.588,3.437C139.35,85.063,135.708,86.551,131.596,86.348z"
                />
                <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill={this.iconColor}
                    d="M150.649,53.948c-0.007-2.304,0.91-4.604,0.012-6.909
                        C152.53,49.346,152.483,51.647,150.649,53.948z"
                />
                <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill={this.iconColor}
                    d="M149.815,46.735c-1.953-1.662-0.281-3.851-0.831-5.717
                        C150.515,42.742,149.555,44.827,149.815,46.735z"
                />
                <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill={this.iconColor}
                    d="M148.619,57.931c0.693-1.358,1.386-2.718,2.079-4.076
                        C150.928,55.684,150.725,57.292,148.619,57.931z"
                />
            </G>
        );
    }
}

export default connect(state => ({
    userAddress: state.account.selectedAccountAddress,
    network: state.network.selectedNetwork,
}))(AccountIcon);
