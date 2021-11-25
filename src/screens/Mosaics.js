import React, { Component } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import {
    GradientBackground,
    ListContainer,
    ListItem,
    MosaicDisplay,
    TitleBar,
} from '@src/components';
import { connect } from 'react-redux';
import translate from '@src/locales/i18n';
import store from '@src/store';

const styles = StyleSheet.create({
    list: {
        marginBottom: 10,
    },
});

type Props = {
    componentId: string,
};

type State = {};

class Mosaics extends Component<Props, State> {
    state = {};

    renderMosaicItem = ({ item, index }) => {
        const { nativeMosaicNamespaceName } = this.props;
        return (
            <ListItem>
                <MosaicDisplay
                    mosaic={item}
                    isNative={item.mosaicName === nativeMosaicNamespaceName}
                    key={'' + index + 'mosaics'}
                />
            </ListItem>
        );
    };

    refresh = async () => {
        await store.dispatchAction({ type: 'account/loadBalance' });
    };

    render() {
        const {
            ownedMosaics,
            nativeMosaicNamespaceName,
            onOpenMenu,
            onOpenSettings,
            isLoading,
        } = this.props;
        const dataManager = { isLoading };
        const {} = this.state;

        return (
            <GradientBackground
                name="connector_small"
                theme="light"
                dataManager={dataManager}
            >
                <TitleBar
                    theme="light"
                    title={translate('mosaics.title')}
                    onOpenMenu={() => onOpenMenu()}
                    onSettings={() => onOpenSettings()}
                />
                <ListContainer
                    type="list"
                    style={styles.list}
                    isScrollable={true}
                >
                    <FlatList
                        data={ownedMosaics}
                        renderItem={this.renderMosaicItem}
                        onEndReachedThreshold={0.9}
                        keyExtractor={(item, index) => '' + index + 'mosaics'}
                        refreshControl={
                            <RefreshControl
                                //refresh control used for the Pull to Refresh
                                refreshing={isLoading}
                                onRefresh={() => this.refresh()}
                            />
                        }
                    />
                </ListContainer>
            </GradientBackground>
            //</ImageBackground>
        );
    }
}

export default connect(state => ({
    ownedMosaics: state.account.ownedMosaics,
    isLoading: state.account.loading,
    nativeMosaicNamespaceName: 'symbol.xym', //TODO: remove hardcode
}))(Mosaics);
