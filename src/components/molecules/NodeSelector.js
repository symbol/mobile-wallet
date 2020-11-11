import React, { Component } from 'react';
import { StyleSheet, View, Picker } from 'react-native';
import { getNodes } from '@src/config/environment';

const styles = StyleSheet.create({
    root: {
        marginLeft: 0,
        opacity: 0.8,
    },
    container: {
        width: '100%',
    },
});

export default class NodeSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: getNodes(props.network),
        };
    }

    render() {
        const { nodes } = this.state;
        const { selectedNode, onNodeSelect, disabled } = this.props;

        return (
            <View style={styles.container}>
                <Picker
                    enabled={!disabled}
                    selectedValue={selectedNode}
                    onValueChange={(itemValue, itemIndex) => onNodeSelect(itemValue)}>
                    {nodes.map(node => (
                        <Picker.Item label={node} value={node} />
                    ))}
                </Picker>
            </View>
        );
    }
}
