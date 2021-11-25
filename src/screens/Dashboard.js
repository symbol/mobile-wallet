import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { menuItems } from '@src/config';
import { GradientBackground, NavigationMenu } from '@src/components';
import NodeDownOverlay from '@src/components/organisms/NodeDownOverlay';
import Home from '@src/screens/Home';
import History from '@src/screens/History';
import Harvest from '@src/screens/Harvest';
import Mosaics from '@src/screens/Mosaics';
import Sidebar from '@src/screens/Sidebar';
import { Router } from '@src/Router';
import store from '@src/store';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
    tabWrapper: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        marginBottom: 10,
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
            case 'harvest':
                Tab = Harvest;
                break;
        }
        return (
            <GradientBackground theme="light" noPadding>
                <View style={styles.tabWrapper}>
                    <Tab
                        {...this.props}
                        contentStyle={styles.contentContainer}
                        onOpenMenu={() =>
                            this.setState({ isSidebarShown: true })
                        }
                        onOpenSettings={() =>
                            Router.goToSettings({}, this.props.componentId)
                        }
                        changeTab={this.onTabChange}
                    />
                </View>
                <NavigationMenu
                    menuItemList={menuItems}
                    onChange={this.onTabChange}
                    value={currentTab}
                />
                <Sidebar
                    componentId={componentId}
                    isVisible={this.state.isSidebarShown}
                    onHide={() => this.setState({ isSidebarShown: false })}
                />
                {!isNodeUp && <NodeDownOverlay />}
            </GradientBackground>
        );
    }
}

export default connect(state => ({
    isNodeUp: state.network.isUp,
}))(Dashboard);
