/**
 * @format
 * @flow
 */

import React from 'react';
import type { Node } from 'react';
import { Modal, View, TouchableOpacity } from 'react-native';
import styles from '../ConfirmModal/confirmmodal.styl';
import Card from '@src/components/atoms/Card';
import TitleBar from '@src/components/atoms/TitleBar';
import Button from '@src/components/controls/Button';
import {Text, Col, Section, Checkbox} from '@src/components';
import GlobalStyles from '@src/styles/GlobalStyles';
import { testIDs } from '@src/components/molecules/CheckableTextLink';
import CheckBox from "react-native-check-box";
import translate from "@src/locales/i18n";

type Props = {
    children: Node,
    handleClose: () => ?boolean,
    isModalOpen: boolean,
    showTopbar: boolean,
    title: string,
    showBack: boolean,
    onBack: () => ?any,
    showClose: boolean,
    confirmDisabled?: boolean,
    onClose: () => ?any,
};

const ConfirmModal = (props: Props) => {
    const { children, isModalOpen, handleClose, onSuccess, showTopbar, title, text, showBack, onBack, showClose, onClose, noPadding, confirmDisabled } = props;
    const contentStyle = noPadding ? {} : styles.contentBody;
    return (
        <Modal animationType="fade" transparent visible={isModalOpen} onRequestClose={handleClose}>
            <View style={styles.modalOverlay} />

            <View style={styles.modalWrapper}>
                <Card style={styles.bottomCard}>
                    <View style={styles.contentWrapper}>
                        {showTopbar && (
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
                        )}
                        <Section type="form" style={{ flex: null }}>
                            <Section type="form-item">
                                <Text type="regular" theme="light" align="center" wrap>
                                    {text}
                                </Text>
                            </Section>
                            {children}
                            <Section type="form-item">
                                <Button style={styles.button} title="Confirm" theme="light" fullWidth={false} disabled={confirmDisabled} onPress={onSuccess} />
                            </Section>
                            {onClose && (
                                <Section type="button">
                                    <TouchableOpacity onPress={onClose}>
                                        <Text style={{ color: GlobalStyles.color.PRIMARY }} theme="light" type="bold" align="center">
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                </Section>
                            )}
                        </Section>
                    </View>
                </Card>
            </View>
        </Modal>
    );
};

export default ConfirmModal;
