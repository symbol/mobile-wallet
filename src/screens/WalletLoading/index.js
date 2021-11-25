/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Image, Text, View } from 'react-native';
import Video from 'react-native-video';
import GradientContainer from '@src/components/organisms/SymbolGradientContainer';
import translate from '@src/locales/i18n';
import styles from './WalletLoading.styl';
import { Router } from '@src/Router';
import store from '@src/store';

class WalletLoading extends Component {
    componentDidMount = () => {
        if (
            this.props &&
            this.props.promiseToRun &&
            this.props.callbackAction
        ) {
            this.props.promiseToRun().then(() => {
                this.props.callbackAction();
            });
        } else {
            store
                .dispatchAction({ type: 'wallet/saveWallet' })
                .then(() => {
                    Router.goToDashboard({});
                })
                .finally(() => {
                    Router.goToDashboard({});
                });
        }
    };

    render() {
        return (
            <GradientContainer
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                angle={135}
                useAngle
                style={styles.gradientContainer}
            >
                {/*<Image style={styles.mesh} source={require('../../../shared/assets/mesh1.png')}/>*/}
                <Video
                    source={require('@src/assets/videos/mesh.mp4')}
                    style={styles.mesh}
                    muted={true}
                    repeat={true}
                    resizeMode={'cover'}
                    rate={1.0}
                    ignoreSilentSwitch={'obey'}
                    blurRadius={10}
                />

                <View style={styles.textWrapper}>
                    <Text style={styles.title}>
                        {translate('WalletLoading.title')}
                    </Text>
                    <Text style={styles.desc}>
                        {translate('WalletLoading.description')}
                    </Text>
                </View>

                <View style={{ height: '25%' }}></View>
                {/* <Image style={styles.loader} source={require('../../../shared/assets/loader.gif')} /> */}

                <Image
                    style={styles.logo}
                    source={require('@src/assets/nem_logo.png')}
                />
            </GradientContainer>
        );
    }
}

export default WalletLoading;
