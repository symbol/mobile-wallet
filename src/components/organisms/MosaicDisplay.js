import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Col, Icon, Row, Text } from '@src/components';
import type { MosaicModel } from '@src/storage/models/MosaicModel';

const styles = StyleSheet.create({
    transactionPreview: {
        width: '100%',
        borderRadius: 6,
        marginTop: 0,
        backgroundColor: '#fffd',
    },
});

type Props = {
    mosaic: MosaicModel,
};

export default class MosaicDisplay extends Component<Props> {
    render() {
        const { mosaic, isNative = true } = this.props;
        const iconName = isNative ? 'mosaic_native' : 'mosaic_custom';

        return (
            <View style={styles.transactionPreview}>
                <Row justify="start" fullWidth>
                    <Col
                        justify="center"
                        align="center"
                        style={{ marginRight: 16 }}
                    >
                        <Icon name={iconName} />
                    </Col>
                    <Col grow>
                        <Row justify="space-between">
                            <Text type="regular" theme="light">
                                {mosaic.mosaicId}{' '}
                                {mosaic.expired ? ' (expired)' : ''}
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
                                {mosaic.amount /
                                    Math.pow(10, mosaic.divisibility)}
                            </Text>
                        </Row>
                    </Col>
                </Row>
            </View>
        );
    }
}
