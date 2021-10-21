import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Text, Section, Col, Row } from '@src/components';
import GlobalStyles from '../../styles/GlobalStyles';
import translate from '@src/locales/i18n';

const styles = StyleSheet.create({
    link: {
        fontSize: 12,
        color: GlobalStyles.color.BLUE,
        textDecorationLine: 'underline',
    },
});
interface Props {
    url: string;
    title: string;
}
export default class ReadMoreLink extends Component<Props, State> {
    onPress(url: string) {
        Linking.openURL(url);
    }

    render = () => {
        const title = this.props.title;
        if (title) {
            return (
                <Section type="form-item">
                    <Text theme="light" align="center" type="regular">
                        {title}
                    </Text>
                    <Row justify="space-between" align="end" fullWidth>
                        <Col style={{ flex: 1, marginTop: 10 }}>
                            <TouchableOpacity onPress={() => this.onPress(this.props.url)}>
                                <Text theme="light" align="right" style={styles.link}>
                                    {translate('news.readMore')}
                                </Text>
                            </TouchableOpacity>
                        </Col>
                    </Row>
                </Section>
            );
        } else {
            return (
                <Row justify="space-between" align="end" fullWidth>
                    <Col style={{ flex: 1, marginTop: 10 }}>
                        <TouchableOpacity onPress={() => this.onPress(this.props.url)}>
                            <Text theme="light" align="right" style={styles.link}>
                                {translate('news.readMore')}
                            </Text>
                        </TouchableOpacity>
                    </Col>
                </Row>
            );
        }
    };
}
