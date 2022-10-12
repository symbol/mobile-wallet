import React, { useEffect, useRef } from 'react';
import { Animated, BackHandler, Dimensions, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { TitleBar } from '@src/components';
import GlobalStyles from '@src/styles/GlobalStyles';
import { useState } from 'react';

const FULL_HEIGHT = Dimensions.get('window').height;
const FULL_WIDTH = Dimensions.get('window').width;
const PANEL_HEIGHT = FULL_HEIGHT - 100;

const styles = StyleSheet.create({
    mask: {
        position: 'absolute',
        height: FULL_HEIGHT,
        width: FULL_WIDTH,
        zIndex: 1,
        bottom: 0,
        backgroundColor: '#000',
    },
    panel: {
        position: 'absolute',
        zIndex: 2,
        height: PANEL_HEIGHT,
        width: '100%',
        bottom: 0,
        backgroundColor: GlobalStyles.color.DARKWHITE,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
});

export default function SwipeablePanel(props) {
    const { children, isActive, title, onClose } = props;
    const [isCloseButtonPressed, setIsCloseButtonPressed] = useState(false);
    const animatedOpacity = useRef(new Animated.Value(0)).current;
    const animatedTranslateY = useRef(new Animated.Value(FULL_HEIGHT)).current;
    const animatedMaskStyle = {
        opacity: animatedOpacity,
    };
    const animatedPanelStyle = {
        transform: [{ translateY: animatedTranslateY }],
    };
    const maskStyle = [styles.mask, animatedMaskStyle];
    const panelStyle = [styles.panel, animatedPanelStyle];
    const isPanelExpanded = isActive && !isCloseButtonPressed;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        handlePressClose();
        return true;
    });
    const handlePressClose = () => setIsCloseButtonPressed(true);
    const close = () => {
        if (!isPanelExpanded) {
            backHandler.remove();
            onClose();
        }
    };

    useEffect(() => {
        Animated.timing(animatedOpacity, {
            toValue: isPanelExpanded ? 0.5 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
        Animated.spring(animatedTranslateY, {
            toValue: isPanelExpanded ? 0 : FULL_HEIGHT,
            tension: 80,
            friction: 25,
            restDisplacementThreshold: 10,
            restSpeedThreshold: 10,
            useNativeDriver: true,
        }).start(close);
    }, [isActive, isCloseButtonPressed]);

    return (
        <>
            <Animated.View style={maskStyle} />
            <Animated.View style={panelStyle}>
                <TitleBar theme="light" title={title} onClose={handlePressClose} />
                {children}
            </Animated.View>
        </>
    );
}

SwipeablePanel.propsTypes = {
    children: PropTypes.node,
    isActive: PropTypes.bool.isRequired,
    title: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};
