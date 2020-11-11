import React, { Component } from 'react';
import { View, Image, StyleSheet, Linking } from 'react-native';
import { Text, Row } from '@src/components';
import type { MosaicModel } from '@src/storage/models/MosaicModel';

const styles = StyleSheet.create({
    transactionPreview: {
        width: '100%',
        height: 60,
        borderRadius: 6,
        marginTop: 0,
        marginBottom: 8,
        padding: 17,
        paddingTop: 8,
        backgroundColor: '#fffd',
    },
});

type Props = {
    mosaic: MosaicModel,
};

export default class MosaicDisplay extends Component<Props> {
    render() {
        const { mosaic } = this.props;
        return (
            <View style={styles.transactionPreview}>
                <Row justify="space-between">
                    <Text type="regular" theme="light">
                        {mosaic.mosaicId}
                    </Text>
                    {/* <Text type="regular" theme="light">
                        {mosaic.divisibility}
                    </Text> */}
                </Row>
                <Row justify="space-between">
                    <Text type="bold" theme="light">
                        {mosaic.mosaicName}
                    </Text>
                    <Text type="bold" theme="light">
                        {mosaic.amount / Math.pow(10, mosaic.divisibility)}
                    </Text>
                </Row>
            </View>
        );
    }
}
