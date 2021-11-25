import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import {
    GradientBackground,
    LinkExplorer,
    LinkFaucet,
    QRImage,
    Row,
    Section,
    TableView,
    Text,
    TitleBar,
} from '@src/components';
import { Router } from '@src/Router';
import { connect } from 'react-redux';
import GlobalStyles from '@src/styles/GlobalStyles';
import HarvestingService from '@src/services/HarvestingService';
import NetworkService from '@src/services/NetworkService';
import { Account } from 'symbol-sdk';

const styles = StyleSheet.create({
    textButton: {
        color: GlobalStyles.color.PRIMARY,
    },
    qr: {
        marginTop: 8,
        marginBottom: 8,
        padding: 8,
        width: 120,
        height: 120,
    },
});

type Props = {};

type State = {
    loading: boolean,
    networkKeys: {
        vrf: any,
        linked: any,
        node: any,
    },
};

class LinkedKeysDetails extends Component<Props, State> {
    state = {
        loading: true,
        networkKeys: {
            vrf: '',
            linked: '',
            node: '',
        },
    };

    componentDidMount() {
        const { selectedAccount, selectedNetwork } = this.props;
        HarvestingService.getAccountKeys(selectedAccount, selectedNetwork).then(
            keys => {
                this.setState({
                    networkKeys: {
                        vrf: keys.vrf.publicKey,
                        linked: keys.linked.publicKey,
                        node: keys.node.publicKey,
                    },
                    loading: false,
                });
            }
        );
    }

    render = () => {
        const { harvestingModel, selectedNetwork, componentId } = this.props;
        const { networkKeys, isLoading } = this.state;
        const networkType = NetworkService.getNetworkTypeFromModel(
            selectedNetwork
        );

        let vrfPrivateKey = null,
            vrfPublicKey = networkKeys.vrf;
        if (harvestingModel) {
            const savedVrfAccount = Account.createFromPrivateKey(
                harvestingModel.vrfPrivateKey,
                networkType
            );
            if (networkKeys.vrf === savedVrfAccount.publicKey) {
                vrfPrivateKey = savedVrfAccount.privateKey;
                vrfPublicKey = savedVrfAccount.publicKey;
            }
        }

        let remotePrivateKey = null,
            remotePublicKey = networkKeys.linked;
        if (harvestingModel) {
            const savedRemoteAccount = Account.createFromPrivateKey(
                harvestingModel.remotePrivateKey,
                networkType
            );
            if (networkKeys.linked === savedRemoteAccount.publicKey) {
                remotePrivateKey = savedRemoteAccount.privateKey;
                remotePublicKey = savedRemoteAccount.publicKey;
            }
        }

        const nodePublicKey = harvestingModel
            ? harvestingModel.nodePublicKey
            : networkKeys.node;

        const data = {
            vrfPublicKey,
            vrfPrivateKey,
            remotePublicKey,
            remotePrivateKey,
            nodePublicKey,
        };

        return (
            <GradientBackground
                name="mesh_small_2"
                theme="light"
                dataManager={{ isLoading }}
            >
                <TitleBar
                    theme="light"
                    onBack={() => Router.goBack(this.props.componentId)}
                    title="Linked Keys Details"
                />
                <Section type="form" style={styles.list} isScrollable>
                    <TableView componentId={componentId} data={data} />
                </Section>
            </GradientBackground>
        );
    };
}

export default connect(state => ({
    selectedAccount: state.wallet.selectedAccount,
    selectedNetwork: state.network.selectedNetwork,
    harvestingModel: state.harvesting.harvestingModel,
}))(LinkedKeysDetails);
