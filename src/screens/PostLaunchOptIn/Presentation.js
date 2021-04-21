import React, { Component } from 'react';
import { 
    StyleSheet, 
    View, 
    Image
} from 'react-native';
import { 
    Section, 
    Button, 
    Text,
} from '@src/components';
import Slider from '@src/components/molecules/Slider';
import translate from '@src/locales/i18n';


const styles = StyleSheet.create({
    root: {
        paddingLeft: 0,
        paddingRight: 0
    },
    slider: {
        flex: 1,
    },
    slideContent: {
        flex: 0.8,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width : '100%',
    },

    image: {
        width: 200,
        height: 200,
        bottom: 0,
        resizeMode: 'contain',
    },
    
    contentContainer: {
        flex: 0.8,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },

    textContainer: {
        flex: 0.5,
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
    },

    bottomContaner: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    }
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
            image: require('@src/assets/claim.png'),
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
            image: require('@src/assets/optin.png'),
        },
    ];

    componentDidMount() {
        this.setState({
            step: 0
        })
    }

    onButtonPress() {
        if (this.state.step < this.slides.length - 1)
            this.slider.current?.onNextPress();
        else
            this.props.onFinish();
    }

    getButtonText() {
        console.log(this.slider.current?.state.activeIndex)
        return this.state.step < this.slides.length - 1
            ? translate('optin.next')
            : translate('optin.getStarted')
    }

    onSlideChange(index) {
        this.setState({step: index})
    }

    renderItem = (props) => {
        const { image, title, text } = props;

        return ( 
            <View style={styles.slideContent}>
                <View style={styles.contentContainer}>  
                    <Image style={styles.image} source={image} />
                    <View style={styles.textContainer}>
                        <Text theme="light" style={styles.title}>{title}</Text>
                        <Text theme="light" style={styles.text}>{text}</Text>
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
                    slides={this.slides}
                    renderItem={this.renderItem}
                    onSlideChange={(index) => this.onSlideChange(index)}
                    showNextButton={false}
                    showDoneButton={false}
                    autoScrollInterval={60000}
                />
                <Section type="form-bottom">
                    <Section type="text">
                        <Button 
                            theme="light"
                            text={this.getButtonText()} 
                            onPress={() => this.onButtonPress()} 
                        />
                    </Section>
                </Section>
            </Section>
        );
    }
}

export default Welcome;
