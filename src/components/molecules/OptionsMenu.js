import React, { Component } from 'react';
import { FlatList, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import Popover from 'react-native-popover-view';
import { Icon, Row, Text } from '@src/components';

const styles = StyleSheet.create({
    root: {
        paddingVertical: 8,
    },
    listItem: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    icon: {
        marginRight: 16,
    },
    label: {},
});

type Theme = 'light' | 'dark';

type ListItem = {
    onPress: () => void,
    iconName: String,
    label: string,
};

interface Props {
    theme: Theme;
    list: ListItem[];
}

type State = { isVisible: boolean };

export default class OptionsMenu extends Component<Props, State> {
    state = {
        isVisible: false,
    };

    onPressItem = async item => {
        await this.setState({ isVisible: false });
        if (typeof item.item.onPress === 'function') {
            setTimeout(item.item.onPress, 500);
        }
    };

    renderItem = item => {
        return (
            <TouchableHighlight underlayColor="#0001" onPress={() => this.onPressItem(item)}>
                <Row style={styles.listItem} align="center">
                    <Icon style={styles.icon} name={item.item.iconName} size="small" />
                    <Text style={styles.label} type="bold" theme="light">
                        {item.item.label}
                    </Text>
                </Row>
            </TouchableHighlight>
        );
    };

    render = () => {
        const { style = {}, list = [], children } = this.props;
        const { isVisible } = this.state;

        return (
            <>
                <Popover
                    from={
                        <TouchableOpacity style={style} onPress={() => this.setState({ isVisible: true })}>
                            {children}
                        </TouchableOpacity>
                    }
                    isVisible={isVisible}
                    animationConfig={{ duration: 200 }}
                    arrowStyle={{ backgroundColor: 'transparent' }}
                    onRequestClose={() => this.setState({ isVisible: false })}
                >
                    <FlatList
                        style={styles.root}
                        data={list}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => item.label + index}
                    />
                </Popover>
            </>
        );
    };
}
