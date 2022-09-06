import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Col, Icon, Row, Text, Trunc } from '@src/components';
import { Router } from '@src/Router';
import store from '@src/store';

const styles = StyleSheet.create({
    root: {
        width: '100%',
        borderRadius: 6,
        marginTop: 4,
        marginBottom: 4,
        backgroundColor: '#fffe',
    },
});

export default class Contact extends Component {
    onPress(contact) {
        store
            .dispatchAction({
                type: 'addressBook/selectContact',
                payload: contact,
            })
            .then(() => Router.goToContactProfile({}, this.props.componentId));
    }

    render() {
        const { data } = this.props;
        const iconName = this.props.data.isBlackListed ? 'contact_blocked_light' : 'contact_light';

        return (
            <TouchableOpacity onPress={() => this.onPress(data)}>
                <Row align="center">
                    <Icon name={iconName} style={{ marginRight: 16 }} />
                    <Col grow>
                        {!!data.name && (
                            <Text theme="light" type="bold" style={styles.title}>
                                {data.name}
                            </Text>
                        )}
                        <Text theme="light" type="regular" align={'left'} style={styles.content}>
                            <Trunc type="namespaceName">{data.address}</Trunc>
                        </Text>
                    </Col>
                </Row>
            </TouchableOpacity>
        );
    }
}
