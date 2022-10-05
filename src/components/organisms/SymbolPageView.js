import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Node } from 'react';
import SymbolGradientContainer from '@src/components/organisms/SymbolGradientContainer';
import FadeView from '@src/components/organisms/FadeView';
import GradientButton from '@src/components/atoms/GradientButton';
import GradientButtonLight from '@src/components/atoms/GradientButtonLight';
import LoadingAnimation from '@src/components/organisms/LoadingAnimation';

const styles = StyleSheet.create({
    mesh: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '100%',
        height: undefined,
        resizeMode: 'contain',
        aspectRatio: 1,
    },

    background3: {
        top: 0,
        position: 'absolute',
        height: '100%',
        width: '100%',
        flex: 1,
        resizeMode: 'cover',
    },

    center: {
        alignSelf: 'center',
    },

    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        color: '#ffffff',
        fontFamily: 'NotoSans',
    },

    containerLight: {
        backgroundColor: '#f2f4f8',
    },

    loadingContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        color: '#ffffff',
        fontFamily: 'NotoSans',
        backgroundColor: '#00000055',
    },

    loadingText: {
        color: '#ffffff',
        textAlign: 'center',
        margin: 16,
        fontFamily: 'NotoSans-SemiBold',
        fontWeight: '600',
    },

    pageContainer: {
        flex: 1,
        width: '100%',
        //padding: 34,
        justifyContent: 'space-between',
        color: '#ffffff',
        fontFamily: 'NotoSans',
    },

    scrollView: {
        paddingLeft: 34,
        paddingRight: 34,
    },

    simpleView: {
        paddingLeft: 34,
        paddingRight: 34,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
    },

    topBar: {
        marginTop: 42,
        marginBottom: 0,
        paddingLeft: 34,
        paddingRight: 34,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        //alignItems: 'center',
        alignItems: 'flex-start',
    },

    topButtonContainer: {
        paddingTop: 20,
        paddingBottom: 20,
    },

    topButtons: {
        resizeMode: 'contain',
        width: 20,
        height: 20,
    },

    settingsButton: {
        width: 16,
        height: 16,
        backgroundColor: '#0f05',
    },

    titleContainerRow: {
        marginBottom: 34,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },

    titleContainerColumn: {
        marginBottom: 34,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },

    titleTextDark: {
        color: '#ffffff',
        width: '70%',
        fontSize: 24,
        fontWeight: '100',
        fontFamily: 'NotoSans-SemiBold',
        fontWeight: '600',
        flexWrap: 'wrap',
    },

    titleTextFullWidth: {
        width: '100%',
        color: '#ffffff',
    },

    titleTextLight: {
        color: '#44004e',
        width: '70%',
        fontWeight: '100',
        fontSize: 24,
        fontFamily: 'NotoSans-SemiBold',
        fontWeight: '600',
    },

    titleTextNoIcon: {
        width: '100%',
    },

    icon: {
        resizeMode: 'contain',
        width: 55,
        height: 55,
        alignSelf: 'center',
        //backgroundColor: '#f2000055'
    },

    iconAlignLeft: {
        marginTop: 65,
        marginBottom: 15,
        alignSelf: 'flex-start',
    },

    content: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    footerEmpty: {
        margin: 0,
        marginTop: 34,
    },

    footerBigger: {
        marginBottom: 68,
    },

    footer: {
        margin: 34,
        marginTop: 32,
        marginBottom: 34,
    },

    footerTitle: {
        textAlign: 'center',
        color: '#fff',
        marginTop: 10,
        marginBottom: 20,
        fontFamily: 'NotoSans-Regular',
        fontSize: 16,
    },

    button: {
        marginTop: 20,
    },

    loading: {
        height: 32,
        width: 32,
    },

    error: {
        color: '#fffa',
        fontFamily: 'NotoSans-Bold',
        textAlign: 'center',
    },
});

type Button = {
    text: string,
    disabled: boolean,
    testID: any,
    icon: any,
    onPress: () => any,
};

type Props = {
    isLoading: boolean,
    isError: boolean,
    errorMessage: string,
    theme: string,
    isFade: boolean,
    childrenAlign: string,
    title: string,
    icon: string,
    noScroll: boolean,
    children: Node,

    buttons: Button[],
    errorButtons: Button[],

    footer: Node,
    footerTitle: string,

    onClose: () => any,
    onBack: () => any,
    onSettings: () => any,
};

const WizardStepView = (props: Props) => {
    const {
        isLoading,
        isError,
        errorMessage,
        theme,
        isFade,
        style = {},

        title,
        icon,
        iconAlign,
        children,
        noScroll,
        buttons,
        errorButtons,

        footer,
        footerTitle,

        onClose,
        onBack,
        onSettings,
    } = props;

    const Footer = footer;

    const Container = props => {
        if (theme === 'light')
            return (
                <View style={[styles.container, styles.containerLight]} source={require('@src/assets/terms.png')}>
                    {!isLoading && !isFade && <View style={styles.container}>{props.children}</View>}
                    {!isLoading && isFade && (
                        <FadeView style={styles.container} duration={300}>
                            {props.children}
                        </FadeView>
                    )}
                    {isLoading && <LoadingAnimation />}
                </View>
            );
        if (theme === 'dark2')
            return (
                <SymbolGradientContainer noPadding style={styles.container} source={require('@src/assets/settings.png')}>
                    {!isLoading && !isFade && <View style={styles.container}>{props.children}</View>}
                    {!isLoading && isFade && (
                        <FadeView style={styles.container} duration={300}>
                            {props.children}
                        </FadeView>
                    )}
                    {isLoading && <LoadingAnimation />}
                </SymbolGradientContainer>
            );
        else
            return (
                <SymbolGradientContainer noPadding style={styles.container}>
                    {!isLoading && !isFade && <View style={styles.container}>{props.children}</View>}
                    {!isLoading && isFade && (
                        <FadeView style={styles.container} duration={300}>
                            {props.children}
                        </FadeView>
                    )}
                    {isLoading && <LoadingAnimation />}
                </SymbolGradientContainer>
            );
    };

    const Background = () => {
        if (theme === 'light') return <Image style={styles.mesh} source={require('@src/assets/backgroun4.png')} />;
        if (theme === 'dark') return <Image style={styles.mesh} source={require('@src/assets/background1.png')} />;
        if (theme === 'dark2') return <Image style={styles.mesh} source={require('@src/assets/background2.png')} />;
        if (theme === 'dark3') return <Image style={styles.background3} source={require('@src/assets/background3.png')} />;
        return null;
    };

    const TopBar = () => {
        const iconBackSrc =
            theme === 'light' ? require('@src/assets/icons/back_light.png') : require('@src/assets/icons/ic-back-white.png');
        const iconCloseSrc = theme === 'light' ? require('@src/assets/icons/close_light.png') : require('@src/assets/icons/close_dark.png');
        const iconSettingsSrc =
            theme === 'light' ? require('@src/assets/icons/settings_light.png') : require('@src/assets/icons/settings_dark.png');
        return (
            <View style={styles.topBar}>
                {onBack && (
                    <TouchableOpacity style={styles.topButtonContainer} onPress={onBack}>
                        <Image style={{ height: 18, width: 18 }} source={iconBackSrc} />
                    </TouchableOpacity>
                )}

                {onClose && (
                    <TouchableOpacity style={styles.topButtonContainer} onPress={onClose}>
                        <Image style={styles.topButtons} source={iconCloseSrc} resizeMode="center" />
                    </TouchableOpacity>
                )}

                {!(onBack || onClose) && <View style={styles.topButtonContainer}></View>}

                {onSettings && (
                    <TouchableOpacity style={styles.topButtonContainer} onPress={onSettings}>
                        <Image style={[styles.topButtons]} source={iconSettingsSrc} resizeMode="center" />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const Title = () => {
        const titleContainertStyle = iconAlign === 'left' ? styles.titleContainerColumn : styles.titleContainerRow;
        const titleTextStyle = theme === 'light' ? styles.titleTextLight : styles.titleTextDark;

        let iconSrc;
        let iconSize = { width: 55, height: 55 };
        switch (icon) {
            case 'document':
                iconSrc = require('@src/assets/icons/document.png');
                iconSize.width = 40;
                iconSize.height = 55;
                break;
            case 'security':
                iconSrc = require('@src/assets/icons/security.png');
                iconSize.width = 40;
                iconSize.height = 55;
                break;
            case 'settings':
                iconSrc = require('@src/assets/icons/settings.png');
                break;
            case 'qr_scanner':
                iconSrc = require('@src/assets/icons/qr_scanner_light.png');
                break;
            case 'wallet':
                iconSrc = require('@src/assets/icons/wallet.png');
                iconSize.width = 55;
                iconSize.height = 40;
                break;
            case 'import':
                iconSrc = require('@src/assets/icons/import.png');
                iconSize.width = 40;
                iconSize.height = 40;
                break;
        }

        return (
            <View style={titleContainertStyle}>
                {iconSrc && iconAlign === 'left' && <Image style={[styles.icon, styles.iconAlignLeft, iconSize]} source={iconSrc} />}
                <Text style={[titleTextStyle, !iconSrc && styles.titleTextNoIcon, iconAlign === 'left' && styles.titleTextFullWidth]}>
                    {title}
                </Text>
                {iconSrc && iconAlign !== 'left' && <Image style={[styles.icon, iconSize]} source={iconSrc} />}
            </View>
        );
    };

    const Button = props => {
        if (theme === 'light') return <GradientButtonLight {...props} />;
        return <GradientButton {...props} />;
    };

    const footerStyle = buttons && buttons.length === 1 && !footer ? [styles.footer, styles.footerBigger] : styles.footer;

    return (
        <Container>
            <Background />
            <View style={styles.pageContainer}>
                <TopBar />
                {!noScroll && (
                    <ScrollView style={[styles.scrollView, style]} persistentScrollbar={true}>
                        <Title />
                        <View style={styles.titleContainer}>{/* Title */}</View>
                        <View style={styles.content} duration={100}>
                            {/* Loading animation */}
                            {isLoading && !isError && (
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Image style={[styles.loading, styles.center]} source={require('@src/assets/loading.gif')} />
                                </View>
                            )}

                            {/* Content */}
                            {!isLoading && !isError && children}

                            {/* Error message */}
                            {isError && (
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={[styles.error, styles.center]}>{errorMessage}</Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                )}

                {noScroll && (
                    <View style={[styles.simpleView, style]}>
                        <Title />
                        <View style={styles.titleContainer}>{/* Title */}</View>
                        <View style={styles.content} duration={100}>
                            {/* Loading animation */}
                            {isLoading && !isError && (
                                <Image style={[styles.loading, styles.center]} source={require('@src/assets/loading.gif')} />
                            )}

                            {/* Content */}
                            {!isLoading && !isError && children}

                            {/* Error message */}
                            {isError && <Text style={[styles.error, styles.center]}>{errorMessage}</Text>}
                        </View>
                    </View>
                )}

                {!(footerTitle || buttons || footer || (isError && errorButtons)) && <View style={styles.footerEmpty}></View>}
                {(footerTitle || buttons || footer || (isError && errorButtons)) && (
                    <View style={footerStyle}>
                        {/* Footer title */}
                        {!isLoading && !isError && footerTitle && <Text style={styles.footerTitle}>{footerTitle}</Text>}

                        {/* Buttons */}
                        {!isLoading && !isError && buttons && buttons.length === 1 && (
                            <Button
                                style={styles.buttons}
                                title={buttons[0].title}
                                disabled={buttons[0].disabled}
                                isLoading={buttons[0].isLoading}
                                testID={buttons[0].testID}
                                icon={buttons[0].icon}
                                onPress={buttons[0].onPress}
                            />
                        )}
                        {!isLoading && !isError && buttons && buttons.length === 2 && (
                            <View style={styles.buttons}>
                                <Button
                                    style={styles.button}
                                    title={buttons[0].title}
                                    disabled={buttons[0].disabled}
                                    isLoading={buttons[0].isLoading}
                                    testID={buttons[0].testID}
                                    icon={buttons[0].icon}
                                    onPress={buttons[0].onPress}
                                />
                                <Button
                                    style={styles.button}
                                    title={buttons[1].title}
                                    disabled={buttons[1].disabled}
                                    isLoading={buttons[1].isLoading}
                                    testID={buttons[1].testID}
                                    icon={buttons[1].icon}
                                    onPress={buttons[1].onPress}
                                />
                            </View>
                        )}

                        {/* Buttons shown while error */}
                        {!isLoading && isError && errorButtons && errorButtons.length === 1 && (
                            <Button
                                style={styles.buttons}
                                title={errorButtons[0].title}
                                disabled={errorButtons[0].disabled}
                                testID={errorButtons[0].testID}
                                icon={errorButtons[0].icon}
                                onPress={errorButtons[0].onPress}
                            />
                        )}
                        {!isLoading && isError && errorButtons && errorButtons.length === 2 && (
                            <View style={styles.buttons}>
                                <Button
                                    style={styles.button}
                                    title={errorButtons[0].title}
                                    disabled={errorButtons[0].disabled}
                                    testID={errorButtons[0].testID}
                                    icon={errorButtons[0].icon}
                                    onPress={errorButtons[0].onPress}
                                />
                                <Button
                                    style={styles.button}
                                    title={errorButtons[1].title}
                                    disabled={errorButtons[1].disabled}
                                    testID={errorButtons[1].testID}
                                    icon={errorButtons[1].icon}
                                    onPress={errorButtons[1].onPress}
                                />
                            </View>
                        )}

                        {/* Footer */}
                        {!isLoading && !isError && footer && <Footer />}
                    </View>
                )}
            </View>
        </Container>
    );
};

WizardStepView.defaultProps = {
    children: null,
};

export default WizardStepView;
