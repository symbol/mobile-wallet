import React, { Component } from 'react';
import { Text as NativeText, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Row, Text, CopyView, FadeView } from '@src/components';
import GlobalStyles from '../../styles/GlobalStyles';
import { Router } from '@src/Router';
import { showPasscode } from '@src/utils/passcode';

const styles = StyleSheet.create({
    showButton: {
        width: '10%',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: GlobalStyles.color.PRIMARY,
        color: GlobalStyles.color.PRIMARY,
    },
    progressBar: {
        width: '100%',
    },
    progressBarInner: {
        height: 2,
        backgroundColor: GlobalStyles.color.GREEN,
    },
});

type Theme = 'light' | 'dark';

interface Props {
    type: Type;
    align: Align;
    theme: Theme;
}

type State = {
    isSecretShown: boolean,
};

export default class SecretView extends Component<Props, State> {
    state = {
        isSecretShown: false,
        counter: 10,
        title: 'Show',
    };

    onShowClick = () => {
        const { passcode } = this.props;
        const callBack = () => {
            this.setState({ isSecretShown: true });
            this.setState({ counter: 10 });

            const timer = setInterval(() => {
                if (this.state.counter === 0) {
                    clearInterval(timer);
                    this.setState({ isSecretShown: false });
                }
                this.setState({ counter: this.state.counter - 1 });
            }, 1000);
        };
        showPasscode(this.props.componentId, callBack);
    };

    render = () => {
        const { children, style = {}, theme, title, component } = this.props;
        const { isSecretShown, counter } = this.state;

        if (isSecretShown)
            return (
                <FadeView>
                    <Row wrap>
                        <CopyView type="regular" theme={theme} style={style}>
                            {children}
                        </CopyView>
                        <View style={styles.progressBar}>
                            <View style={[{ width: counter * 10 + '%' }, styles.progressBarInner]} />
                        </View>
                    </Row>
                </FadeView>
            );
        else
            return (
                <TouchableOpacity onPress={() => this.onShowClick()}>
                    <NativeText>
                        <Text type="bold" style={styles.showButton}>
                            {title}
                        </Text>
                    </NativeText>
                </TouchableOpacity>
            );
    };
}
