/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { View, Image, Text, ImageBackground } from 'react-native';
import Video from "react-native-video";
import GradientContainer from "@src/components/organisms/SymbolGradientContainer";
import translate from "@src/locales/i18n";
import styles from './WalletLoading.styl';
import {bindActionCreators} from "redux";
import {saveWallet} from "@src/redux/actions/CreateWalletAction";
import {connect} from "react-redux";
import {Router} from "@src/Router";

class WalletLoading extends Component<> {

  componentDidMount = () => {
	this.props.saveWallet().then(_ => {
		Router.goToDashboard({});
	})
  };

  render() {
	const image = { uri: '../assets/mesh1.png' };

    return (
      <GradientContainer
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        angle={135}
        useAngle
        style={styles.gradientContainer}>
			{/*<Image style={styles.mesh} source={require('../../../shared/assets/mesh1.png')}/>*/}
			<Video
				source={require('../assets/videos/mesh.mp4')}
				style={styles.mesh}
				muted={true}
				repeat={true}
				resizeMode={"cover"}
				rate={1.0}
				ignoreSilentSwitch={"obey"}
				blurRadius={10}
			/>

			<View style={styles.textWrapper}>
				<Text style={styles.title}>{translate('WalletLoading.title')}</Text>
				<Text style={styles.desc}>{translate('WalletLoading.description')}</Text>
			</View>


			<View style={{height: '25%'}}></View>
        	{/* <Image style={styles.loader} source={require('../../../shared/assets/loader.gif')} /> */}

			<Image style={styles.logo} source={require('../assets/nem_logo.png')} />


      </GradientContainer>
    );
  }
}


const mapStateToProps = (state) => {
  const { createWallet } = state;
  return { createWallet }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
      saveWallet
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(WalletLoading);
