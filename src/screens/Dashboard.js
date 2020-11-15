import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { menuItems } from '@src/config';
import { NavigationMenu } from '@src/components';
import Home from './Home';
import History from './History';
import Harvest from './Harvest';
import News from '@src/screens/News';
import Mosaics from '@src/screens/Mosaics';
import Sidebar from '@src/screens/Sidebar';
import { Router } from '@src/Router';
import store from '@src/store';
import NodeDownOverlay from '@src/components/organisms/NodeDownOverlay';
import { connect } from 'react-redux';

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

class Dashboard extends Component<Props, State> {
    state = {
        currentTab: 'home',
        isSidebarShown: false,
    };

    componentDidMount() {
        store.dispatchAction({ type: 'network/registerNodeCheckJob' });
    }

    onTabChange = tabName => {
        this.setState({ currentTab: tabName });
    };

    render() {
        const { componentId, isNodeUp } = this.props;
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
            case 'mosaics':
                Tab = Mosaics;
                break;
            case 'news':
                Tab = News;
                break;
            case 'harvest':
                Tab = Harvest;
                break;
        }
        return (
            <View style={styles.root}>
                <Tab
                    {...this.props}
                    contentStyle={styles.contentContainer}
                    onOpenMenu={() => this.setState({ isSidebarShown: true })}
                    onOpenSettings={() => Router.goToSettings({}, this.props.componentId)}
                    changeTab={this.onTabChange}
                />
                <NavigationMenu menuItemList={menuItems} onChange={this.onTabChange} value={currentTab} />
                <Sidebar componentId={componentId} isVisible={this.state.isSidebarShown} onHide={() => this.setState({ isSidebarShown: false })} />
                {!isNodeUp && <NodeDownOverlay />}
            </View>
        );
    }
}

export default connect(state => ({
    isNodeUp: state.network.isUp,
}))(Dashboard);
