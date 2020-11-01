import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import {
    Section,
    GradientBackground,
    BalanceWidget,
    Text,
    PluginList,
    Col,
    Row,
    TitleBar,
} from '@src/components';
import { Router } from '@src/Router';

const styles = StyleSheet.create({
    transactionPreview: {
        width: '100%',
        height: 60,
        borderRadius: 6,
        marginTop: 4,
        marginBottom: 4,
        padding: 17,
        paddingTop: 8,
        backgroundColor: '#fffc',
    },
    list: {
        marginTop: 17,
    },
});

type Props = {
    componentId: string,
};

type State = {};

export default class Home extends Component<Props, State> {
    state = {};

    handleSettingsClick = () => {
        console.log(this.props.componentId);
        Router.goToSettings({}, this.props.componentId);
    };

    render() {
        const { contentStyle = {}, componentId } = this.props;
        const {} = this.state;

        return (
            <GradientBackground name="connector" fade={true}>
                <TitleBar theme="dark" onSettings={this.handleSettingsClick} title="-" />
				<Section type="title">
				<Row justify="space-between">
					<Text type="bold" theme="dark">
						O
					</Text>
					<Text type="bold" theme="dark">
						Your Account Name
					</Text>
					<Text type="bold" theme="dark">
						O
					</Text>
				</Row>
				</Section>
                <Col justify="space-around" style={contentStyle}>
                    <BalanceWidget showChart={true} />
                    <Section type="list">
                        <PluginList componentId={componentId} />
                    </Section>
                    <Section type="list" style={styles.list}>
                        {/* Notifications Mockup */}
                        <View style={styles.transactionPreview}>
                            <Row justify="space-between">
                                <Text type="regular" theme="light">
                                    Opt-in
                                </Text>
                                <Text type="regular" theme="light">
                                    23.10.2020 11:00
                                </Text>
                            </Row>
                            <Row justify="space-between">
                                <Text type="bold" theme="light">
                                    Post launch Opt-in
                                </Text>
                            </Row>
                        </View>
                        <View style={styles.transactionPreview}>
                            <Row justify="space-between">
                                <Text type="regular" theme="light">
                                    Multisig Transaction
                                </Text>
                                <Text type="regular" theme="light">
                                    23.10.2020 10:59
                                </Text>
                            </Row>
                            <Row justify="space-between">
                                <Text type="bold" theme="light">
                                    Awaiting your signature
                                </Text>
                            </Row>
                        </View>
                    </Section>
                </Col>
            </GradientBackground>
        );
    }
}
