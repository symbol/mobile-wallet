import React, { Component } from 'react';
import { TouchableOpacity, View, Switch, Image, Text } from 'react-native';
import styles from './SettingsListItem.styl';

type Props = {
    title: string,
    icon: any,
    itemValue?: string | boolean,
    rightIcon?: ?number,
    onPress?: () => void | null,
    onValueChange?: (value: boolean) => void,
};

export default class SettingsListItem extends Component<Props> {
    render() {
        const { icon, title, isSwitch, isSelector, itemValue, onPress, onValueChange } = this.props;

        return (
            <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
                <View style={styles.itemTitle}>
                    <Image source={icon} style={styles.itemIcon} />
                    <Text style={styles.itemTitleText}>{title}</Text>
                </View>
                {isSelector && (
                    <View style={styles.dropDownSelector}>
                        <Text style={styles.dropDownSelectorText}>{itemValue}</Text>
                        <Image
                            source={require('../../assets/icons/ic-chevron-down-white.png')}
                            style={styles.dropDownSelectorIcon}
                        />
                    </View>
                )}
                {isSwitch && (
                    <Switch
                        onValueChange={onValueChange}
                        value={Boolean(itemValue)}
                        style={styles.Switch}
                    />
                )}
            </TouchableOpacity>
        );
    }
}
