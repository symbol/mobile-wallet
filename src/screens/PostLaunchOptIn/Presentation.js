import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Section, Text } from '@src/components';
import Slider from '@src/components/molecules/Slider';
import translate from '@src/locales/i18n';

const styles = StyleSheet.create({
    root: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    slider: {
        flex: 1,
    },

    slide: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'column',
    },

    content: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        flex: 0.8,
    },

    image: {
        flex: 0.4,
        alignSelf: 'center',
        width: 200,
        height: 200,
        bottom: 0,
        marginBottom: 16,
        resizeMode: 'contain',
    },

    textContainer: {
        flex: 0.4,
    },

    title: {
        fontSize: 24,
        fontFamily: 'NotoSans-SemiBold',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
        flexWrap: 'wrap',
        paddingHorizontal: 32,
    },

    text: {
        fontSize: 14,
        fontWeight: '400',
        textAlign: 'center',
        paddingLeft: 32,
        paddingRight: 32,
        flexWrap: 'wrap',
        marginBottom: 16,
    },

    note: {
        fontSize: 10,
        fontWeight: '400',
        textAlign: 'center',
        paddingLeft: 32,
        paddingRight: 32,
        flexWrap: 'wrap',
    },

    bottomContaner: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
});

type Props = {
    componentId: string,
};

type State = {};

class Welcome extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.slider = React.createRef();
    }

    state = {
        step: 0,
    };

    slides = [
        {
            key: 'slide_1',
            title: translate('optin.presentationSlide1Title'),
            text: translate('optin.presentationSlide1Text'),
            image: require('@src/assets/optin.png'),
        },
        {
            key: 'slide_2',
            title: translate('optin.presentationSlide2Title'),
            text: translate('optin.presentationSlide2Text'),
            image: require('@src/assets/snapshot.png'),
        },
        {
            key: 'slide_3',
            title: translate('optin.presentationSlide3Title'),
            text: translate('optin.presentationSlide3Text'),
            note: translate('optin.presentationSlide3Note'),
            image: require('@src/assets/claim.png'),
        },
    ];

    componentDidMount() {
        this.setState({
            step: 0,
        });
    }

    onButtonPress() {
        if (this.state.step < this.slides.length - 1) this.slider.current?.onNextPress();
        else this.props.onFinish();
    }

    getButtonText() {
        return this.state.step < this.slides.length - 1 ? translate('optin.next') : translate('optin.getStarted');
    }

    onSlideChange(index) {
        this.setState({ step: index });
    }

    renderItem = props => {
        const { image, title, text, note = '' } = props;

        return (
            <View style={styles.slide}>
                <View style={styles.content}>
                    <Image style={styles.image} source={image} />
                    <View style={styles.textContainer}>
                        <Text theme="light" style={styles.title}>
                            {title}
                        </Text>
                        <Text theme="light" style={styles.text}>
                            {text}
                        </Text>
                        <Text theme="light" style={styles.note}>
                            {note}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    render() {
        return (
            <Section type="form" style={styles.root}>
                <Slider
                    ref={this.slider}
                    style={styles.slider}
                    contentContainerStyle={styles.sliderInner}
                    slides={this.slides}
                    renderItem={this.renderItem}
                    onSlideChange={index => this.onSlideChange(index)}
                    showNextButton={false}
                    showDoneButton={false}
                    autoScrollInterval={60000}
                    hidePagination
                />
                <Section type="form-bottom">
                    <Section type="text">
                        <Button theme="light" text={this.getButtonText()} onPress={() => this.onButtonPress()} />
                    </Section>
                </Section>
            </Section>
        );
    }
}

export default Welcome;
