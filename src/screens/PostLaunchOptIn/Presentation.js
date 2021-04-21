import React, { Component } from 'react';
import { 
    StyleSheet, 
    View, 
    TouchableOpacity, 
    Image
} from 'react-native';
import { 
    GradientBackground, 
    TitleBar, 
    ListContainer, 
    ListItem, 
    Section, 
    Button, 
    Input, 
    Icon, 
    Text
} from '@src/components';
import Slider from '@src/components/molecules/Slider';
import translate from '@src/locales/i18n';
import GlobalStyles from '@src/styles/GlobalStyles';


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
        //backgroundColor: '#ff05'
    },
      
    imageContainer: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#f005'
    },

    image: {
        width: 152,
        height: 152,
        bottom: 0,
        resizeMode: 'contain',
        //backgroundColor: '#f00'
    },
    
    contentContainer: {
        //backgroundColor: '#00f',
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
    },

    textContainer: {
        flex: 0.4,
        //backgroundColor: '#00f',
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
        flex: 0.1,
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
            title: translate(['INTRO_slideOne', 'title']),
            text: translate(['INTRO_slideOne', 'text']),
            image: require('@src/assets/intro/slide_0.png'),
            mesh: require('@src/assets/intro/mesh_1.png'),
            bg: {
                colors: ['#095265', '#203455', '#262439'],
                angle: 135,
            },
        },
        {
            key: 'slide_2',
            title: translate(['INTRO_slideTwo', 'title']),
            text: translate(['INTRO_slideTwo', 'text']),
            image: require('@src/assets/intro/slide_2.png'),
            mesh: require('@src/assets/intro/mesh_2.png'),
            bg: {
                colors: ['#262439', '#203455', '#095265'],
                angle: 45,
            },
        },
    ];

    componentDidMount() {
        this.setState({
            step: 0
        })
    }

    onButtonPress() {
        if (this.slider.current?.state.activeIndex < this.slides.length)
            this.slider.current?.onNextPress();
        else
            this.props.onFinish();
    }

    getButtonText() {
        console.log(this.slider.current?.state.activeIndex)
        return this.slider.current?.state.activeIndex < this.slides.length
            ? translate('next')
            : translate('openOptinManager')
    }

    renderItem = (props) => {
        const { image, title, text, mesh } = props;

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
        const {
            currentStep,
            steps
        } = this.state;

        return (
            <Section type="form" style={styles.root}>
                <Slider
                    ref={this.slider}
                    style={styles.slider}
                    slides={this.slides}
                    renderItem={this.renderItem}
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
