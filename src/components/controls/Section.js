import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';

const styles = StyleSheet.create({
    scrollWrapper: {
        height: '100%',
    },
    scrollContent: {
        flexGrow: 1,
    },
});

type Type = 'title' | 'subtitle' | 'text' | 'center' | 'button' | 'form' | 'form-without-padding' | 'form-item';

interface Props {
    type: Type;
    isScrollable: boolean;
}

type State = {};

export default class Text extends Component<Props, State> {
    render() {
        const { children, type, isScrollable, style = {} } = this.props;
        let globalStyle = {};

        switch (type) {
            case 'title':
                globalStyle = GlobalStyles.section.title;
                break;
            case 'subtitle':
                globalStyle = GlobalStyles.section.subtitle;
                break;
            case 'text':
                globalStyle = GlobalStyles.section.text;
                break;
            case 'center':
                globalStyle = GlobalStyles.section.center;
                break;
            case 'button':
                globalStyle = GlobalStyles.section.button;
                break;
            case 'list':
                globalStyle = GlobalStyles.section.list;
                break;
            case 'form':
                globalStyle = GlobalStyles.section.form;
                break;
            case 'form-without-padding':
                globalStyle = GlobalStyles.section.formWithoutPaddings;
                break;
            case 'form-item':
                globalStyle = GlobalStyles.section.formItem;
                break;
            case 'form-bottom':
                globalStyle = GlobalStyles.section.formBottom;
                break;
        }

        return !isScrollable ? (
            <View style={[globalStyle, style]}>{children}</View>
        ) : (
            <ScrollView style={[styles.scrollWrapper, style]} contentContainerStyle={[styles.scrollContent]}>
                <View style={[globalStyle]}>{children}</View>
            </ScrollView>
        );
    }
}
