/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Image, Text, TouchableHighlight, View } from 'react-native';

import translate from '@src/locales/i18n';
import Slider from '@src/components/molecules/Slider';

import styles from './CreateOrImport.styl';
import GradientButton from '@src/components/atoms/GradientButton';
import GradientContainer from '@src/components/organisms/SymbolGradientContainer';
import { Router } from '@src/Router';

/**
 * Create or Import Screen
 */
export class CreateOrImport extends Component {
    slides = [
        {
            key: 'slide_1',
            title: translate(['INTRO_slideOne', 'title']),
            text: translate(['INTRO_slideOne', 'text']),
            image: require('@src/assets/intro/slide_0.png'),
            mesh: require('@src/assets/intro/mesh_1.png'),
            bg: {
                colors: ['#095265', '#203455', '#262439'],
                angle: 135,
            },
        },
        {
            key: 'slide_2',
            title: translate(['INTRO_slideTwo', 'title']),
            text: translate(['INTRO_slideTwo', 'text']),
            image: require('@src/assets/intro/slide_2.png'),
            mesh: require('@src/assets/intro/mesh_2.png'),
            bg: {
                colors: ['#262439', '#203455', '#095265'],
                angle: 45,
            },
        },
    ];

    /**
     * On create wallet handler
     */
    createWallet = () => {
        Router.goToWalletName({}, this.props.componentId);
    };

    /**
     * Import Wallet handler
     */
    importWallet = () => {
        Router.goToImportOptions({}, this.props.componentId);
    };

    renderItem = props => {
        const { image, title, text, mesh } = props;

        return (
            <View style={styles.slide} source={mesh}>
                <View style={styles.slideContent}>
                    <Image style={styles.image} source={image} />
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.text}>{text}</Text>
                </View>
            </View>
        );
    };

    render() {
        return (
            <GradientContainer
                colors={['#5200c6', '#44004E']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                angle={135}
                useAngle
                style={styles.container}
            >
                <Slider
                    style={styles.slider}
                    slides={this.slides}
                    renderItem={this.renderItem}
                    showNextButton={false}
                    showDoneButton={false}
                />
                <View style={styles.bottomCard}>
                    <GradientButton title={translate('INTRO_createWalletButton')} onPress={this.createWallet} />
                    <View style={styles.row}>
                        <Text style={styles.buttonTextNormal}>{translate('INTRO_alreadyHaveWallet')}</Text>
                        <TouchableHighlight style={styles.buttonLink} onPress={this.importWallet} underlayColor="#EEEEEE">
                            <Text style={styles.buttonTextLink}>{translate('INTRO_importWalletButton')}</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </GradientContainer>
        );
    }
}
