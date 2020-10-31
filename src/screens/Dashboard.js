import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { menuItems } from '@src/config';
import { NavigationMenu } from '@src/components';
import Home from './Home';
import History from './History';
import News from './News';

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#000',
    },
    contentContainer: {
        flex: 1,
        marginBottom: 64,
    },
});

type Props = {};

type State = {
    currentTab: string,
};

export default class Dashboard extends Component<Props, State> {
    state = {
        currentTab: 'home',
    };

    onTabChange = tabName => {
        this.setState({ currentTab: tabName });
    };

    render() {
        const { componentId } = this.props;
        const { currentTab } = this.state;
        let Tab;

        switch (currentTab) {
            default:
            case 'home':
                Tab = Home;
                break;
            case 'history':
                Tab = History;
                break;
            case 'news':
                Tab = News;
                break;
        }
        return (
            <View style={styles.root}>
                <Tab {...this.props} contentStyle={styles.contentContainer} componentId={componentId} />
                <NavigationMenu menuItemList={menuItems} onChange={this.onTabChange} value={currentTab} />
            </View>
        );
    }
}
