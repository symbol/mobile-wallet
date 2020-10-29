import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text, FlatList, Modal } from 'react-native';
import GlobalStyles from '@src/styles/GlobalStyles';
import Card from '@src/components/atoms/Card';
import translate from '@src/locales/i18n';
import styles from './ModalSelector.styl';
import BottomModal from '@src/components/atoms/BottomModal/BottomModal';

type Props = {
    data: any[],
    selectedItem: any,
    isModalOpen: boolean,
    onClose: () => {},
    onSelect: () => {},
};

export default class ModalSelector extends Component<Props> {
    renderItem = ({ item }: { item: string }) => {
        const { selectedItem, onSelect } = this.props;

        return (
            <TouchableOpacity
                onPress={() => onSelect(item)}
                style={[styles.selectItem, selectedItem === item ? styles.selectItemActive : '']}>
                <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
        );
    };

    keyExtractor = (item: string) => item;

    render() {
        const { isModalOpen, data, onClose } = this.props;

        return (
            <BottomModal isModalOpen={isModalOpen} onClose={onClose}>
                <Card style={styles.bottomCard}>
                    <TouchableOpacity onPress={onClose} style={GlobalStyles.closeButton}>
                        <Image
                            style={styles.closeIcon}
                            source={require('../../assets/icons/ic-close-black.png')}
                        />
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>
                            {translate('Settings.currency.selectBoxTitle')}
                        </Text>
                    </View>
                    <FlatList
                        data={data}
                        renderItem={this.renderItem}
                        keyExtractor={this.keyExtractor}
                    />
                </Card>
            </BottomModal>
        );
    }
}
