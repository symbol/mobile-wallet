/**
 * @format
 * @flow
 *
 * A little bit tweaked version of https://github.com/Jacse/react-native-app-intro-slider/
 */
import React, { Component } from 'react';
import type { Element } from 'react';
import type { ScrollEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import {
    FlatList,
    I18nManager,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import styles from './slider.styl';
import * as DeviceUtil from '@src/utils/Device';

const {
    width: windowWidth,
    height: windowHeight,
} = DeviceUtil.getWindowDimensions();
const isAndroidRTL = I18nManager.isRTL && Platform.OS === 'android';

const listDirection = {
    flexDirection: isAndroidRTL ? 'row-reverse' : 'row',
};

const paginationContainerBottom = {
    bottom: 6 + DeviceUtil.getBottomSpace(),
};

type Props = {|
    dotStyle?: ViewStyleProp,
    activeDotStyle?: ViewStyleProp,
    buttonStyle?: ViewStyleProp,
    buttonTextStyle?: ViewStyleProp,
    paginationStyle?: ViewStyleProp,
    hidePagination?: boolean,
    bottomButton?: boolean,
    renderNextButton: () => void,
    renderPrevButton: () => void,
    renderDoneButton: () => void,
    renderSkipButton: () => void,
    renderItem: (item: any) => Element<*>,
    onSlideChange: (index: number, lastIndex: number) => void,
    onDone: () => void,
    onSkip: () => void,
    slides: [],
    style: [],
    autoScrollInterval?: number,
|};

type State = {
    width: number,
    height: number,
    activeIndex: number,
};

class Slider extends Component<Props, State> {
    static defaultProps = {
        activeDotStyle: {
            backgroundColor: '#ffffff',
        },
        dotStyle: {
            backgroundColor: '#ffffff44',
        },
        bottomButton: false,
        buttonStyle: null,
        buttonTextStyle: null,
        hidePagination: false,
        paginationStyle: null,
        autoScrollInterval: 6000,
    };

    state: State = {
        width: windowWidth,
        height: windowHeight,
        activeIndex: 0,
    };

    slidingFlatList: ?FlatList<any>;
    timerId: any;

    componentDidMount() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    componentWillUnmount() {
        this.stopAutoPlay();
    }

    goToSlide = (pageNum: number) => {
        this.setState({ activeIndex: pageNum });
        const { width } = this.state;

        if (!this.slidingFlatList) {
            return;
        }

        this.slidingFlatList.scrollToOffset({
            offset: this.rtlSafeIndex(pageNum) * width,
            animated: true,
        });
    };

    autoScrollToNextPage = () => {
        const { activeIndex } = this.state;
        let newIndex = activeIndex + 1;
        if (newIndex >= this.props.slides.length) {
            newIndex = 0;
        }

        this.goToSlide(newIndex);
    };

    // Get the list ref
    getListRef = () => this.slidingFlatList;

    onNextPress = () => {
        const { activeIndex } = this.state;
        const { onSlideChange } = this.props;
        this.goToSlide(activeIndex + 1);
        if (onSlideChange) {
            onSlideChange(activeIndex + 1, activeIndex);
        }
    };

    onPrevPress = () => {
        const { activeIndex } = this.state;
        const { onSlideChange } = this.props;
        this.goToSlide(activeIndex - 1);
        if (onSlideChange) {
            onSlideChange(activeIndex - 1, activeIndex);
        }
    };

    onDonePress = () => {
        // noop
    };

    onPaginationPress = (index: number) => {
        const { activeIndex: activeIndexBeforeChange } = this.state;
        const { onSlideChange } = this.props;
        this.goToSlide(index);
        if (onSlideChange) {
            onSlideChange(index, activeIndexBeforeChange);
        }
    };

    startAutoPlay = () => {
        const { autoScrollInterval } = this.props;
        this.timerId = setInterval(
            this.autoScrollToNextPage,
            autoScrollInterval
        );
    };

    stopAutoPlay = () => {
        if (!this.timerId) {
            return;
        }

        clearInterval(this.timerId);
        this.timerId = null;
    };

    renderItem = (item: any) => {
        const { width, height } = this.state;
        const props = { ...item.item, width, height };
        const { renderItem } = this.props;
        return (
            <View style={{ width, height }}>
                {renderItem ? (
                    renderItem(props)
                ) : (
                    <Text style={styles.errorText}>
                        renderItem() not implemented
                    </Text>
                )}
            </View>
        );
    };

    renderButton = (name: string, onPress: () => void) => {
        // eslint-disable-next-line react/destructuring-assignment
        const show = this.props[`show${name}Button`];
        // eslint-disable-next-line react/destructuring-assignment
        let content = this.props[`render${name}Button`];
        content = content ? content() : this.renderDefaultButton(name);
        return show && this.renderOuterButton(content, name, onPress);
    };

    renderDefaultButton = (name: string) => {
        const { buttonTextStyle, bottomButton, buttonStyle } = this.props;
        let content = (
            <Text style={[styles.buttonText, buttonTextStyle]}>
                {
                    // eslint-disable-next-line react/destructuring-assignment
                    this.props[`${name.toLowerCase()}Label`]
                }
            </Text>
        );

        if (bottomButton) {
            const defaultButtonStyle =
                name === 'Skip' || name === 'Prev'
                    ? { backgroundColor: 'transparent' }
                    : null;
            content = (
                <View
                    style={[
                        styles.bottomButton,
                        defaultButtonStyle,
                        buttonStyle,
                    ]}
                >
                    {content}
                </View>
            );
        }

        return content;
    };

    renderOuterButton = (
        content: Element<*>,
        name: string,
        onPress: () => void
    ) => {
        const { bottomButton, buttonStyle } = this.props;
        const defaultButtonStyle =
            name === 'Skip' || name === 'Prev'
                ? styles.leftButtonContainer
                : styles.rightButtonContainer;
        return (
            <View style={!bottomButton && defaultButtonStyle}>
                <TouchableOpacity
                    onPress={onPress}
                    style={bottomButton ? styles.flexOne : buttonStyle}
                >
                    {content}
                </TouchableOpacity>
            </View>
        );
    };

    renderNextButton = () => this.renderButton('Next', this.onNextPress);

    renderPrevButton = () => this.renderButton('Prev', this.onPrevPress);

    renderDoneButton = () => {
        const { onDone } = this.props;
        return this.renderButton('Done', onDone || this.onDonePress);
    };

    renderSkipButton = () => {
        const { onSkip, slides } = this.props;
        // scrollToEnd does not work in RTL so use goToSlide instead
        return this.renderButton('Skip', () =>
            onSkip ? onSkip() : this.goToSlide(slides.length - 1)
        );
    };

    renderPagination = () => {
        const { activeIndex } = this.state;
        const {
            slides,
            paginationStyle,
            activeDotStyle,
            dotStyle,
        } = this.props;
        const isLastSlide = activeIndex === slides.length - 1;
        const isFirstSlide = activeIndex === 0;

        const skipBtn =
            (!isFirstSlide && this.renderPrevButton()) ||
            (!isLastSlide && this.renderSkipButton());
        const btn = isLastSlide
            ? this.renderDoneButton()
            : this.renderNextButton();

        return (
            <View
                style={[
                    styles.paginationContainer,
                    paginationContainerBottom,
                    paginationStyle,
                ]}
            >
                <View style={[styles.paginationDots, listDirection]}>
                    {slides.length > 1 &&
                        slides.map((_, i) => (
                            <TouchableOpacity
                                // eslint-disable-next-line react/no-array-index-key
                                key={i}
                                style={[
                                    styles.dot,
                                    this.rtlSafeIndex(i) === activeIndex
                                        ? activeDotStyle
                                        : dotStyle,
                                ]}
                                onPress={() => this.onPaginationPress(i)}
                            />
                        ))}
                </View>
                {btn}
                {skipBtn}
            </View>
        );
    };

    rtlSafeIndex = (i: number) => {
        const { slides } = this.props;
        return isAndroidRTL ? slides.length - 1 - i : i;
    };

    onMomentumScrollEnd = (e: ScrollEvent) => {
        const offset = e.nativeEvent.contentOffset.x;
        const { width, activeIndex } = this.state;
        const { onSlideChange } = this.props;
        // Touching very very quickly and continuous brings about
        // a variation close to - but not quite - the width.
        // That's why we round the number.
        // Also, Android phones and their weird numbers
        const newIndex = this.rtlSafeIndex(Math.round(offset / width));
        if (newIndex === activeIndex) {
            // No page change, don't do anything
            return;
        }
        const lastIndex = activeIndex;
        this.setState({ activeIndex: newIndex });
        if (onSlideChange) {
            onSlideChange(newIndex, lastIndex);
        }
    };

    onLayout = () => {
        const { width, height, activeIndex } = this.state;
        if (width !== windowWidth || height !== windowHeight) {
            // Set new width to update rendering of pages
            this.setState({ width, height });
            // Set new scroll position
            const func = () => {
                if (this.slidingFlatList) {
                    this.slidingFlatList.scrollToOffset({
                        offset: this.rtlSafeIndex(activeIndex) * width,
                        animated: false,
                    });
                }
            };

            if (Platform.OS === 'android') {
                setTimeout(func, 0);
            } else {
                func();
            }
        }
    };

    render() {
        // Separate props used by the component to props passed to FlatList
        const { hidePagination, slides, style, ...otherProps } = this.props;
        const { width } = this.state;

        return (
            <View style={style}>
                <FlatList
                    {...otherProps}
                    ref={ref => {
                        this.slidingFlatList = ref;
                    }}
                    data={slides}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    style={[styles.flexOne, listDirection]}
                    renderItem={this.renderItem}
                    onMomentumScrollEnd={this.onMomentumScrollEnd}
                    extraData={width}
                    onLayout={this.onLayout}
                />
                {!hidePagination && this.renderPagination()}
            </View>
        );
    }
}

export default Slider;
