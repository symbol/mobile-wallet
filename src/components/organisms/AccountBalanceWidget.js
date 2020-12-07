import React, { Component } from 'react';
import { 
	StyleSheet, 
	ScrollView, 
	RefreshControl, 
	View,
	TouchableOpacity,
} from 'react-native';
import { 
	Row, 
	Col, 
	CopyView, 
	Text, 
	SymbolGradientContainer, 
	FadeView 
} from '@src/components';
import GlobalStyles from '../../styles/GlobalStyles';
import Video from "react-native-video";
import { Router } from '@src/Router';
import TextTicker from 'react-native-text-ticker'
import store from '@src/store';
import { connect } from 'react-redux';

// TODO: Remove font styles. Use <Text type={} /> instead
const styles = StyleSheet.create({
    root: {
		flex: null,
		margin: 0,
		padding: 0,
		borderRadius: 6,
        marginTop: 4,
        marginBottom: 17,
        padding: 17,
		paddingTop: 8,
		minHeight: 142
	},
	scrollView: {

	},
	scrollViewContent: {
		flex: 1,
		justifyContent: "space-between"
	},
	address: {
		marginRight: -5,
		opacity: 0.7,
		color: GlobalStyles.color.WHITE,
		fontSize: 1 * 12,
        lineHeight: 1.75 * 12,
        marginBottom: 17,
	},
	mosaic: {
		fontSize: 1 * 12,
		lineHeight: 1.75 * 12,
		marginBottom: 2,
	},
	balance: {
		fontFamily: 'NotoSans-Light',
		fontSize: 2.5 * 12,
		lineHeight: 3.25 * 12,
		marginTop: 20,
		color: GlobalStyles.color.WHITE,
	},
	balanceLight: {
		fontFamily: 'NotoSans-Light',
		fontSize: 2.5 * 12,
		lineHeight: 3.25 * 12,
		marginTop: 20,
		opacity: 0.6,
		color: GlobalStyles.color.WHITE,
	},
	noPadding: {
		padding: 0,
		paddingTop: 0
	},
	video: {
		bottom: 0,
		left: 0,
		position: 'absolute',
		height: '100%',
		width: '100%',
		flex: 1,
		resizeMode: 'cover',
		borderRadius: 6
	},
	fade: {
		opacity: 0.5
	}
});

type Props = {
    showChart: boolean,
	account: any
};

type State = {
    currency: string,
    balance: string,
    fiat: string,
    priceChange: string,
};

class BalanceWidget extends Component<Props, State> {
	reload = () => {
        store.dispatchAction({ type: 'account/loadAllData' });
	};

	onWidgetPress = () => {
		Router.goToAccountDetails({}, this.props.componentId);
	};

    render = () => {
		const { 
			address,
			nativeMosaicNamespaceName,
			balance,
			isLoading
		} = this.props;
		const isBalanceHuge = balance.toString().length > 12;
		const BalanceContainer = isBalanceHuge ? ScrollView : Row;
		const Container = isLoading === true
			? View
			: TouchableOpacity;

        return (
			<SymbolGradientContainer style={[styles.root, isLoading && styles.noPadding]} noPadding noScroll>
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollViewContent}
					refreshControl={
						<RefreshControl refreshing={isLoading} onRefresh={() => this.reload()} />
					}
				>
					<Container 
						activeOpacity={0.9}
						onPress={() => this.onWidgetPress()}
					>
						{!isLoading && <View>
							<CopyView style={styles.address} theme="dark">
								{address}
							</CopyView>
							<Row align="end" justify="space-between" fullWidth>
								<Text style={styles.mosaic} theme="dark">
								{nativeMosaicNamespaceName}
								</Text>
								{<BalanceContainer horizontal={true} style={{marginLeft: 16}}>
									<Row>
										<Text style={styles.balance} theme="dark">
											{(''+balance).split('.')[0]}
										</Text>
										{(''+balance).split('.')[1] && <Text style={styles.balanceLight} theme="dark">
											.{(''+balance).split('.')[1]}
										</Text>}
									</Row>
								</BalanceContainer>}
							</Row>
						</View>}
					</Container>
					{isLoading && <FadeView style={styles.video} duration={1000}><Video
						source={require('@src/assets/videos/mesh.mp4')}
						style={[styles.video, styles.fade]}
						muted={true}
						repeat={true}
						resizeMode={"cover"}
						rate={1.0}
						ignoreSilentSwitch={"obey"}
						blurRadius={10}
					/></FadeView>}	
				</ScrollView>
			</SymbolGradientContainer>
        );
    }
}

export default connect(state => ({
	address: state.account.selectedAccountAddress,
	nativeMosaicNamespaceName: 'XYM', //TODO: remove hardcode
	balance: state.account.balance,
	isLoading: state.account.loading,
}))(BalanceWidget);

