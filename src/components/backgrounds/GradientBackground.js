import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
    Button,
    Col,
    Container,
    FadeView,
    LoadingAnimationFlexible,
    Section,
    Text,
} from '@src/components';
import GlobalStyles from '@src/styles/GlobalStyles';
import translate from '@src/locales/i18n';

const styles = StyleSheet.create({
    root: {
        height: '100%',
    },
    loading: {
        flexDirection: 'column',
        flex: 1,
        paddingBottom: 34,
    },
    image: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '100%',
        height: undefined,
        resizeMode: 'contain',
        aspectRatio: 1,
    },
});

type Name = 'connector' | 'mesh' | 'mesh_big' | 'mesh_small';

type Theme = 'light' | 'dark';

interface Props {
    name: Name;
    theme: Theme;
}

type State = {};

export default class GradientBackground extends Component<Props, State> {
    state = {};

    render() {
        const {
            children,
            style = {},
            name,
            theme = 'dark',
            noPadding,
            dataManager = {},
            onBack,
            componentId,
            titleBar,
        } = this.props;
        const {} = this.state;
        const goBack = onBack
            ? onBack
            : componentId
            ? () => Router.goBack(componentId)
            : null;

        let source;
        const imageName = name + '_' + theme;
        switch (imageName) {
            case 'connector_light':
                source = require('@src/assets/backgrounds/connector_light.png');
                break;
            case 'connector_dark':
                source = require('@src/assets/backgrounds/connector.png');
                break;
            case 'connector_small_light':
                source = require('@src/assets/backgrounds/connector_small_light.png');
                break;
            case 'connector_small_dark':
                source = require('@src/assets/backgrounds/connector.png');
                break;
            case 'mesh_dark':
            case 'mesh_light':
                source = require('@src/assets/backgrounds/mesh.png');
                break;
            case 'mesh_small_light':
            case 'mesh_small_dark':
                source = require('@src/assets/backgrounds/mesh_small.png');
                break;
            case 'mesh_small_2_light':
            case 'mesh_small_2_dark':
                source = require('@src/assets/backgrounds/mesh_small_2.png');
                break;
        }

        const gradientColors =
            theme === 'light'
                ? [GlobalStyles.color.DARKWHITE, GlobalStyles.color.DARKWHITE]
                : [GlobalStyles.color.PRIMARY, GlobalStyles.color.SECONDARY];

        const Content = () => {
            return (
                <>
                    {titleBar}
                    {!dataManager.isLoading && !dataManager.isError && children}
                    {dataManager.isLoading && !dataManager.isError && (
                        <View style={styles.loading}>
                            <LoadingAnimationFlexible
                                isFade
                                text={translate('LoadingText')}
                            />
                        </View>
                    )}
                    {dataManager.isError && (
                        <Col justify="center" align="center" fullHeight>
                            <Section type="form-item">
                                <Text type="alert" theme="light" align="center">
                                    Error
                                </Text>
                                <Text type="bold" theme="light" align="center">
                                    {dataManager.errorMessage}
                                </Text>
                                <Text
                                    type="regular"
                                    theme="light"
                                    align="center"
                                >
                                    {dataManager.errorDescription}
                                </Text>
                            </Section>
                            {dataManager.fetch && (
                                <Section type="form-item">
                                    <Button
                                        theme={theme}
                                        text="Try again"
                                        onPress={() => dataManager.fetch()}
                                    />
                                </Section>
                            )}
                            {goBack && (
                                <Section type="form-item">
                                    <Button
                                        theme={theme}
                                        text="Go back"
                                        onPress={goBack}
                                    />
                                </Section>
                            )}
                        </Col>
                    )}
                </>
            );
        };

        return (
            <FadeView style={styles.root} duration={200}>
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    angle={135}
                    useAngle={true}
                    style={[styles.root, style]}
                >
                    {!noPadding && (
                        <Container>
                            {!!source && (
                                <Image style={styles.image} source={source} />
                            )}
                            {Content()}
                        </Container>
                    )}
                    {!!noPadding && (
                        <>
                            {!!source && (
                                <Image style={styles.image} source={source} />
                            )}
                            {Content()}
                        </>
                    )}
                </LinearGradient>
            </FadeView>
        );
    }
}
