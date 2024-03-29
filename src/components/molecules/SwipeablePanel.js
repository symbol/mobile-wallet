import React, { Component } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native';

let FULL_HEIGHT = Dimensions.get('window').height;
let FULL_WIDTH = Dimensions.get('window').width;
let PANEL_HEIGHT = FULL_HEIGHT - 100;

const STATUS = {
    CLOSED: 0,
    SMALL: 1,
    LARGE: 2,
};

type SwipeablePanelProps = {
    isActive: boolean,
    onClose: () => void,
    showCloseButton?: boolean,
    fullWidth?: boolean,
    noBackgroundOpacity?: boolean,
    style?: Object,
    onlyLarge?: boolean,
    onlySmall?: boolean,
    openLarge?: boolean,
    smallPanelHeight?: number,
    allowTouchOutside?: boolean,
};

type SwipeablePanelState = {
    status: number,
    showComponent: boolean,
    canScroll: boolean,
    pan: any,
    orientation: 'portrait' | 'landscape',
    deviceWidth: number,
    deviceHeight: number,
    panelHeight: number,
};

class SwipeablePanel extends Component<SwipeablePanelProps, SwipeablePanelState> {
    pan: Animated.ValueXY;
    isClosing: boolean;
    _panResponder: any;
    animatedValueY: number;
    constructor(props: SwipeablePanelProps) {
        super(props);
        this.state = {
            status: STATUS.CLOSED,
            showComponent: false,
            canScroll: false,
            pan: new Animated.ValueXY({ x: 0, y: PANEL_HEIGHT }),
            orientation: FULL_HEIGHT >= FULL_WIDTH ? 'portrait' : 'landscape',
            deviceWidth: FULL_WIDTH,
            deviceHeight: FULL_HEIGHT,
            panelHeight: PANEL_HEIGHT,
        };

        this.pan = new Animated.ValueXY({ x: 0, y: PANEL_HEIGHT });
        this.isClosing = false;
        this.animatedValueY = 0;

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                this.state.pan.setOffset({
                    x: 0,
                    y: this.animatedValueY,
                });
                this.state.pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: (evt, gestureState) => {
                if (
                    (this.state.status === 1 && Math.abs(this.state.pan.y._value) <= this.state.pan.y._offset) ||
                    (this.state.status === 2 && this.state.pan.y._value > -1)
                )
                    this.state.pan.setValue({
                        x: 0,
                        y: this.state.status === STATUS.LARGE ? Math.max(0, gestureState.dy) : gestureState.dy,
                    });
            },
            onPanResponderRelease: (evt, gestureState) => {
                const { onlyLarge, onlySmall } = this.props;
                this.state.pan.flattenOffset();

                if (gestureState.dy === 0) this._animateTo(this.state.status);
                else if (gestureState.dy < -100 || gestureState.vy < -0.5) {
                    if (this.state.status === STATUS.SMALL) this._animateTo(onlySmall ? STATUS.SMALL : STATUS.LARGE);
                    else this._animateTo(STATUS.LARGE);
                } else if (gestureState.dy > 100 || gestureState.vy > 0.5) {
                    if (this.state.status === STATUS.LARGE) this._animateTo(onlyLarge ? STATUS.CLOSED : STATUS.SMALL);
                    else this._animateTo(0);
                } else this._animateTo(this.state.status);
            },
            onMoveShouldSetPanResponder: () => {
                return true;
            },
        });
    }

    componentDidMount = () => {
        const { isActive, openLarge, onlyLarge, onlySmall } = this.props;

        this.animatedValueY = 0;
        this.state.pan.y.addListener((value: any) => (this.animatedValueY = value.value));

        if (isActive) this._animateTo(onlySmall ? STATUS.SMALL : openLarge ? STATUS.LARGE : onlyLarge ? STATUS.LARGE : STATUS.SMALL);

        Dimensions.addEventListener('change', this._onOrientationChange);
    };

    _onOrientationChange = () => {
        const dimesions = Dimensions.get('screen');
        FULL_HEIGHT = dimesions.height;
        FULL_WIDTH = dimesions.width;

        this.setState({
            orientation: dimesions.height >= dimesions.width ? 'portrait' : 'landscape',
            deviceWidth: FULL_WIDTH,
            deviceHeight: FULL_HEIGHT,
            panelHeight: PANEL_HEIGHT,
        });

        this.props.onClose();
    };

    componentDidUpdate(prevProps: SwipeablePanelProps, prevState: SwipeablePanelState) {
        const { isActive, openLarge, onlyLarge, onlySmall } = this.props;
        if (onlyLarge && onlySmall)
            console.warn(
                'Ops. You are using both onlyLarge and onlySmall options. onlySmall will override the onlyLarge in this situation. Please select one of them or none.'
            );

        if (prevProps.isActive !== isActive) {
            if (isActive) {
                this._animateTo(onlySmall ? STATUS.SMALL : openLarge ? STATUS.LARGE : onlyLarge ? STATUS.LARGE : STATUS.SMALL);
            } else {
                this._animateTo();
            }
        }

        if (prevState.orientation !== this.state.orientation) this._animateTo(this.state.status);
    }

    _animateTo = (newStatus = 0) => {
        const { smallPanelHeight } = this.props;
        let newY = 0;

        if (newStatus === STATUS.CLOSED) newY = PANEL_HEIGHT;
        else if (newStatus === STATUS.SMALL)
            newY = this.state.orientation === 'portrait' ? FULL_HEIGHT - (smallPanelHeight ?? 400) : FULL_HEIGHT / 3;
        else if (newStatus === STATUS.LARGE) newY = 0;

        this.setState({
            showComponent: true,
            status: newStatus,
        });

        Animated.spring(this.state.pan, {
            toValue: { x: 0, y: newY },
            tension: 80,
            friction: 25,
            useNativeDriver: true,
            restDisplacementThreshold: 10,
            restSpeedThreshold: 10,
        }).start(() => {
            if (newStatus === 0) {
                this.props.onClose();
                this.setState({
                    showComponent: false,
                });
            } else
                this.setState({
                    canScroll: newStatus === STATUS.LARGE ? true : false,
                });
        });
    };

    render() {
        const { showComponent, deviceWidth, deviceHeight, panelHeight } = this.state;
        const { noBackgroundOpacity, style, onClose, allowTouchOutside, closeOnTouchOutside } = this.props;

        return showComponent ? (
            <Animated.View
                style={[
                    SwipeablePanelStyles.background,
                    {
                        backgroundColor: noBackgroundOpacity ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.5)',
                        height: allowTouchOutside ? 'auto' : deviceHeight - 20,
                        width: deviceWidth,
                    },
                ]}
            >
                {closeOnTouchOutside && (
                    <TouchableWithoutFeedback onPress={() => onClose()}>
                        <View
                            style={[
                                SwipeablePanelStyles.background,
                                {
                                    width: deviceWidth,
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    height: allowTouchOutside ? 'auto' : deviceHeight,
                                },
                            ]}
                        />
                    </TouchableWithoutFeedback>
                )}
                <Animated.View
                    style={[
                        SwipeablePanelStyles.panel,
                        {
                            width: this.props.fullWidth ? deviceWidth : deviceWidth - 50,
                            height: panelHeight,
                        },
                        { transform: this.state.pan.getTranslateTransform() },
                        style,
                    ]}
                >
                    {!this.state.canScroll ? (
                        <TouchableHighlight>
                            <React.Fragment>{this.props.children}</React.Fragment>
                        </TouchableHighlight>
                    ) : (
                        this.props.children
                    )}
                </Animated.View>
            </Animated.View>
        ) : null;
    }
}

const SwipeablePanelStyles = StyleSheet.create({
    background: {
        position: 'absolute',
        zIndex: 1,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    panel: {
        position: 'absolute',
        height: PANEL_HEIGHT,
        width: FULL_WIDTH - 50,
        transform: [{ translateY: FULL_HEIGHT - 100 }],
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        bottom: 0,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
        zIndex: 2,
    },
    scrollViewContentContainerStyle: {
        width: '100%',
    },
});

export default SwipeablePanel;
