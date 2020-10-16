/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {View, Image, Text, TouchableHighlight} from 'react-native';

import translate from "../locales/i18n";
import Slider from '../components/molecules/Slider';

import styles from './CreateOrImport.styl';
import GradientButton from "../components/atoms/GradientButton";
import GradientContainer from "../components/organisms/SymbolGradientContainer";


/**
 * Create or Import Screen
 */
export class CreateOrImport extends Component {
    slides = [
        {
            key: 'slide_1',
            title: translate(['INTRO_slideOne', 'title']),
            text: translate(['INTRO_slideOne', 'text']),
            image: require('../assets/intro/slide_0.png'),
            mesh: require('../assets/intro/mesh_1.png'),
            bg: {
                colors: ['#095265', '#203455', '#262439'],
                angle: 135,
            },
        },
        {
            key: 'slide_2',
            title: translate(['INTRO_slideTwo', 'title']),
            text: translate(['INTRO_slideTwo', 'text']),
            image: require('../assets/intro/slide_2.png'),
            mesh: require('../assets/intro/mesh_2.png'),
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
        const { goToCreateWallet, componentId } = this.props;
        goToCreateWallet(componentId, this.props);
    };

    /**
     * Import Wallet handler
     */
    importWallet = () => {
        const { goToImportWallet, componentId } = this.props;
        goToImportWallet(componentId, this.props);
    };

    renderItem = (props) => {
        const { image, title, text, mesh } = props;

        return (
            <View
                style={styles.slide}
                source={mesh}
            >
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
                angle={ 135 }
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
                <View style={styles}>
                    <GradientButton title={translate('INTRO_createWalletButton')} onPress={this.createWallet} />
                    <View style={styles.row}>
                        <Text style={styles.buttonTextNormal}>{translate('INTRO_alreadyHaveWallet')}</Text>
                        <TouchableHighlight
                            style={styles.buttonLink}
                            onPress={this.importWallet}
                            underlayColor="#EEEEEE">
                            <Text style={styles.buttonTextLink}>{translate('INTRO_importWalletButton')}</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </GradientContainer>

        );
    }
}
