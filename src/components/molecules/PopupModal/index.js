/**
 * @format
 * @flow
 */

import React from 'react';
import type { Node } from 'react';
import { Modal, View } from 'react-native';
import styles from './popupmodal.styl';
import Card from '@src/components/atoms/Card';
import TitleBar from '@src/components/atoms/TitleBar';
import Text from '@src/components/controls/Section';

type Props = {
    children: Node,
    handleClose: () => ?boolean,
    isModalOpen: boolean,
    showTopbar: boolean,
    title: string,
    showBack: boolean,
    onBack: () => ?any,
    showClose: boolean,
    onClose: () => ?any,
};

const PopupModal = (props: Props) => {
    const {
        children,
        isModalOpen,
        handleClose,
        showTopbar,
        title,
        showBack,
        onBack,
        showClose,
        onClose,
        noPadding,
        style = {},
        containerStyle = {},
    } = props;
    const contentStyle = noPadding ? {} : styles.contentBody;
    return (
        <Modal
            animationType="fade"
            transparent
            visible={isModalOpen}
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay} />

            <View style={styles.modalWrapper}>
                <Card style={[styles.bottomCard, containerStyle]}>
                    <View style={styles.contentWrapper}>
                        {showTopbar && (
                            <TitleBar
                                style={styles.titleBar}
                                titleTextStyle={styles.titleText}
                                onClose={handleClose || onClose}
                                iconStyle={styles.backButton}
                                showBack={showBack}
                                onBack={onBack}
                                showClose={showClose}
                                title={title}
                                alignLeft
                            />
                        )}
                        <View style={[contentStyle, style]}>{children}</View>
                    </View>
                </Card>
            </View>
        </Modal>
    );
};

export default PopupModal;
