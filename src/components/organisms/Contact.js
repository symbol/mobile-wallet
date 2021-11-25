import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Col, Icon, Row, Text, Trunc } from '@src/components';
import Card from '@src/components/atoms/Card';
import { Router } from '@src/Router';
import store from '@src/store';

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: 60,
        borderRadius: 6,
        marginTop: 4,
        marginBottom: 4,
        padding: 17,
        paddingTop: 8,
        backgroundColor: '#fffe',
    },
});

type Props = {
    address: string,
    name: string,
    phone: string,
    email: string,
    label: string,
    notes: string,
    id: string,
    componentId: string,
};

export default class Contact extends Component<Props> {
    onPress(contact) {
        store
            .dispatchAction({
                type: 'addressBook/selectContact',
                payload: contact,
            })
            .then(_ => Router.goToContactProfile({}, this.props.componentId));
    }

    render() {
        return (
            <TouchableOpacity onPress={() => this.onPress(this.props)}>
                <Card style={styles.root}>
                    <Row align="center">
                        <Icon
                            name="contact_light"
                            style={{ marginRight: 16 }}
                        />
                        <Col grow>
                            <Text
                                theme="light"
                                type="bold"
                                style={styles.title}
                            >
                                {this.props.name}
                            </Text>
                            <Text
                                theme="light"
                                type="regular"
                                align={'left'}
                                style={styles.content}
                            >
                                <Trunc type="mosaicId">
                                    {this.props.address}
                                </Trunc>
                            </Text>
                        </Col>
                    </Row>
                </Card>
            </TouchableOpacity>
        );
    }
}
