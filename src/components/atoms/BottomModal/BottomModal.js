import React, { Component } from 'react';
import { Modal, View } from 'react-native';
import styles from './BottomModal.styl';
import Card from '@src/components/atoms/Card';

type Props = {
    isModalOpen: boolean,
    onClose: () => {},
};

export default class BottomModal extends Component<Props> {
    render() {
        const { isModalOpen, onClose, children } = this.props;

        return (
            <Modal
                animationType="slide"
                transparent
                visible={isModalOpen}
                onRequestClose={onClose}
            >
                <View style={styles.modalOverlay} />
                <View style={styles.bottomCardWrapper}>
                    <Card style={styles.bottomCard}>{children}</Card>
                </View>
            </Modal>
        );
    }
}
