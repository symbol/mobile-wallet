import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ManagerHandler, Section } from '@src/components';
import GlobalStyles from '../../styles/GlobalStyles';

const styles = StyleSheet.create({
    inner: {
        width: '100%',
        borderRadius: 6,
        marginTop: 0,
        marginBottom: 8,
        paddingBottom: 1,
        backgroundColor: GlobalStyles.color.WHITE,
        flex: 1,
    },
    section: {
        flex: 1,
    },
    loading: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 16,
        minHeight: 80,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        backgroundColor: '#fff5',
    },
});

interface Props {
    isScrollable: boolean;
}

type State = {};

export default class GradientBackground extends Component<Props, State> {
    state = {};

    render() {
        const {
            children,
            style = {},
            isScrollable = true,
            isLoading = false,
        } = this.props;

        return (
            <Section
                type="list"
                style={[styles.section, style]}
                isScrollable={isScrollable}
            >
                <View style={[styles.inner]}>
                    {children}
                    {isLoading && <View style={styles.loadingOverlay} />}
                    {isLoading && (
                        <ActivityIndicator
                            style={styles.loading}
                            size="large"
                            color={GlobalStyles.color.SECONDARY}
                        />
                    )}
                </View>
            </Section>
        );
    }
}
