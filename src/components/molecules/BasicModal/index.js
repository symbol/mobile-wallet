/**
 * @format
 * @flow
 */

import React from 'react';
import type { Node } from 'react';
import { Modal, View } from 'react-native';
import styles from './confirmmodal.styl';
import Card from '@src/components/atoms/Card';
import TitleBar from '@src/components/atoms/TitleBar';

type Props = {
    children: Node,
    isModalOpen: boolean,
    title: string,
    showBack: boolean,
    onBack: () => ?any,
    showClose: boolean,
    confirmDisabled?: boolean,
    onClose: () => ?any,
};

const BasicModal = (props: Props) => {
    const {
        children,
        isModalOpen,
        handleClose,
        title,
        showBack,
        onBack,
        showClose,
    } = props;
    return (
        <Modal
            animationType="fade"
            transparent
            visible={isModalOpen}
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay} />

            <View style={styles.modalWrapper}>
                <Card style={styles.bottomCard}>
                    <View style={styles.contentWrapper}>
                        <TitleBar
                            style={styles.titleBar}
                            titleTextStyle={styles.titleText}
                            onClose={handleClose}
                            iconStyle={styles.backButton}
                            showBack={showBack}
                            onBack={onBack}
                            showClose={showClose}
                            title={title}
                            alignLeft
                        />
                        {children}
                    </View>
                </Card>
            </View>
        </Modal>
    );
};

export default BasicModal;
