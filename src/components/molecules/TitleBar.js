import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Col, Icon, Row, Section, Text } from '@src/components';
import GlobalStyles from '../../styles/GlobalStyles';

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: 72,
        marginTop: 2,
    },
    iconLeft: {
        height: '100%',
        paddingEnd: GlobalStyles.section.title.paddingLeft / 2,
        paddingStart: GlobalStyles.section.title.paddingLeft / 2,
        marginLeft: -(GlobalStyles.section.title.paddingLeft / 2),
    },
    iconLeftOld: {
        marginLeft: -(GlobalStyles.section.title.paddingLeft / 2) - 5,
    },
    iconRight: {
        height: '100%',
        paddingEnd: GlobalStyles.section.title.paddingLeft / 2,
        paddingStart: GlobalStyles.section.title.paddingLeft / 2,
        marginRight: -(GlobalStyles.section.title.paddingLeft / 2),
    },
    iconRightOld: {
        marginRight: -(GlobalStyles.section.title.paddingLeft / 2) - 5,
    },
});

type Theme = 'light' | 'dark';

interface Props {
    theme: Theme;
    onOpenMenu: function;
    onBack: function;
    onSettings: function;
    title: string;
    subtitle: string;
    buttons: Component[];
}

interface State {
    items: MenuItem[];
}

export default class PluginList extends Component<Props, State> {
    render = () => {
        const {
            style = {},
            theme,
            onOpenMenu,
            onBack,
            onClose,
            onSettings,
            title,
            buttons,
        } = this.props;
        const iconBackName = theme === 'light' ? 'back_light' : 'back_dark';

        const iconCloseName = theme === 'light' ? 'close_light' : 'close_dark';

        const iconSettingsName =
            theme === 'light' ? 'settings_filled_light' : 'settings_dark';

        const iconMenuName =
            theme === 'light' ? 'wallet_filled_light' : 'options_dark';

        const leftIconStyle = onBack ? styles.iconLeftOld : {};

        const rightIconStyle = theme === 'dark' ? styles.iconRightOld : {};

        return (
            <Section type="title" style={[style]}>
                <Row justify="space-between" align="center" style={styles.root}>
                    <Row justify="start" align="center">
                        {!!onOpenMenu && (
                            <TouchableOpacity
                                style={[styles.iconLeft, leftIconStyle]}
                                onPress={onOpenMenu}
                            >
                                <Icon name={iconMenuName} size="small" />
                            </TouchableOpacity>
                        )}
                        {!!onBack && (
                            <TouchableOpacity
                                style={[styles.iconLeft, leftIconStyle]}
                                onPress={onBack}
                            >
                                <Icon name={iconBackName} />
                            </TouchableOpacity>
                        )}
                        {!onBack && !onOpenMenu && <Icon name="none" />}
                    </Row>
                    <Col style={{ flex: 1 }} align="center" justify="center">
                        <Text
                            type="title-small"
                            theme={theme}
                            wrap
                            align="center"
                            style={{ maxWidth: '80%' }}
                        >
                            {title}
                        </Text>
                    </Col>
                    <Row justify="end" align="center">
                        {buttons}
                        {!!onSettings && (
                            <TouchableOpacity
                                style={[styles.iconRight, rightIconStyle]}
                                onPress={onSettings}
                            >
                                <Icon name={iconSettingsName} size="small" />
                            </TouchableOpacity>
                        )}
                        {!!onClose && (
                            <TouchableOpacity
                                style={[styles.iconRight, rightIconStyle]}
                                onPress={onClose}
                            >
                                <Icon name={iconCloseName} size="small" />
                            </TouchableOpacity>
                        )}
                        {!onSettings && !onClose && !buttons && (
                            <Icon name="none" />
                        )}
                    </Row>
                </Row>
            </Section>
        );
    };
}
