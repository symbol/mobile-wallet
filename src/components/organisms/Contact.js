import React from 'react';
import PropTypes from 'prop-types';
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
    },
    icon: {
        marginRight: 16,
    },
});

export default function Contact(props) {
    const { componentId, data } = props;
    const iconName = data.isBlackListed ? 'contact_blocked_light' : 'contact_light';

    const selectContact = () => {
        store
            .dispatchAction({
                type: 'addressBook/selectContact',
                payload: data,
            })
            .then(() => Router.goToContactProfile({}, componentId));
    };

    return (
        <TouchableOpacity onPress={selectContact}>
            <Row align="center">
                <Icon name={iconName} style={styles.icon} />
                <Col grow>
                    {!!data.name && (
                        <Text theme="light" type="bold" style={styles.title}>
                            {data.name}
                        </Text>
                    )}
                    <Text theme="light" type="regular" style={styles.content}>
                        <Trunc type="address-long">{data.address}</Trunc>
                    </Text>
                </Col>
            </Row>
        </TouchableOpacity>
    );
}

Contact.propsTypes = {
    componentId: PropTypes.number,
    data: PropTypes.object,
};
