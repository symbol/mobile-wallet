import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { LineChart } from 'react-native-chart-kit';
import { FadeView } from '@src/components';
import store from '@src/store';
import GlobalStyles from '@src/styles/GlobalStyles';

const styles = StyleSheet.create({
    root: {
        marginLeft: 0,
        opacity: 0.8,
    },
});

type Props = {};

type State = {};

class PriceChart extends Component<Props, State> {
    state = {};

    render() {
        const { style = {}, data = [] } = this.props;

        const labels = [];

        return (
            <View style={[styles.root, style]}>
                {!!data.length && (
                    <FadeView>
                        <LineChart
                            data={{
                                labels,
                                datasets: [{ data }],
                            }}
                            width={Dimensions.get('window').width + 30}
                            height={220}
                            chartConfig={{
                                paddingRight: 300,
                                fillShadowGradientOpacity: 0.3,
                                //useShadowColorFromDataset: true,
                                backgroundGradientTo: `rgba(255, 255, 255, 0)`,
                                backgroundGradientFromOpacity: 0,
                                backgroundGradientToOpacity: 0,
                                decimalPlaces: 2,
                                color: (opacity = 1) =>
                                    `rgba(255, 255, 255, ${opacity})`,
                                labelColor: () => `rgba(255, 255, 255, 0)`,
                                strokeWidth: 1.5,
                                style: {
                                    borderRadius: 0,
                                },
                                propsForDots: {
                                    r: 0,
                                    strokeWidth: 0,
                                },
                                propsForBackgroundLines: {
                                    strokeWidth: 0,
                                },
                            }}
                            bezier
                            style={{
                                marginVertical: 0,
                                borderRadius: 0,
                                paddingRight: 0,
                            }}
                        />
                    </FadeView>
                )}
            </View>
        );
    }
}

export default connect(state => ({
    data: state.market.priceChartData,
}))(PriceChart);
