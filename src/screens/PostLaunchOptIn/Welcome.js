import React, { Component } from 'react';
import { 
    FlatList, 
    RefreshControl, 
    StyleSheet, 
    View, 
    TouchableOpacity, 
    Image 
} from 'react-native';
import { 
    GradientBackground, 
    TitleBar, 
    ListContainer, 
    ListItem, 
    Section, 
    Button, 
    Input, 
    Icon, 
    OptionsMenu,
    FadeView
} from '@src/components';
import { connect } from 'react-redux';
import translate from '@src/locales/i18n';
import Text from '@src/components/controls/Text';
import Presentation from '@src/screens/PostLaunchOptIn/Presentation';
import store from '@src/store';
import { Router } from '@src/Router';
import BasicModal from '@src/components/molecules/BasicModal';
import OptInService from '@src/services/OptInService';
import nem from 'nem-sdk';
import type { NIS1Account } from '@src/services/OptInService';
import { AddressQR, ContactQR } from 'symbol-qr-library';
import NetworkService from '@src/services/NetworkService';
import { PublicAccount } from 'symbol-sdk';
import Trunc from '@src/components/organisms/Trunc';
import GlobalStyles from '@src/styles/GlobalStyles';
import ConfirmModal from '@src/components/molecules/ConfirmModal';

const styles = StyleSheet.create({
    list: {
        marginBottom: 10,
        marginTop: 10,
    },
    content: {
        flex: 1
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    accountList: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    warning: {
        color: GlobalStyles.color.RED,
        fontSize: 10,
        marginTop: 5,
        marginLeft: 5,
    },
    optionsIcon: {
        width: 34,
        height: 40,
        alignSelf: 'flex-end',
        paddingTop: 4,
        paddingRight: 10,
        marginRight: -16,
    },
});

type Props = {
    componentId: string,
};

type State = {};

class Welcome extends Component<Props, State> {
    state = {
        importPrivateKey: '',
        validPrivateKey: false,
        isPrivateKeyModalOpen: false,
        isImportQRModalOpen: false,
        importQRPassword: '',
        validQRPassword: false,
        encryptedQRWallet: null,
        loadingQRPassword: false,
        isRemoveModalOpen: false,
        removeSelectedAccount: null,
        isPresentationShown: false
    };

    componentDidMount() {
        store.dispatchAction({ type: 'optin/load' })
            .then(() => {
                this.setState({
                    isPresentationShown: this.props.nis1Accounts.length > 0
                })
            });
    }

    onPresentationFinish() {
        this.setState({isPresentationShown: true})
    }

    handleOpenShowDetails = item => {
        store.dispatch({ type: 'optin/setSelectedNIS1Account', payload: item });
        Router.goToNIS1AccountDetails({}, this.props.componentId);
    };

    handleDeleteAccount = (item, index) => {
        const { removeSelectedAccount } = this.state;
        store.dispatchAction({ type: 'optin/removeNIS1Account', payload: removeSelectedAccount });
        this.setState({ isRemoveModalOpen: false, removeSelectedAccount: null })
    };

    renderAccountItem = ({ item, index }) => {
        const options = [
            { iconName: 'wallet_filled_light', label: translate('sidebar.details'), onPress: () => this.handleOpenShowDetails(item) },
            {
                iconName: 'delete_light',
                label: translate('sidebar.remove'),
                onPress: () => this.setState({ isRemoveModalOpen: true, removeSelectedAccount: item }),
            },
        ];
        return (
            <ListItem>
                <TouchableOpacity onPress={() => this.goToOptIn(index)} style={styles.accountList}>
                    <Image style={styles.icon} source={require('@src/assets/icons/account_nis.png')} />
                    <Text type={'regular'} theme={'light'} style={{ flex: 1 }}>
                        <Trunc type={'address'}>{item.address}</Trunc>
                    </Text>
                    <OptionsMenu list={options} style={styles.optionsIcon}>
                        <Icon name="options_light" size="small" />
                    </OptionsMenu>
                </TouchableOpacity>
            </ListItem>
        );
    };

    goToOptIn = (index: number) => {
        store.dispatchAction({ type: 'optin/loadNIS1Account', payload: index });
        Router.goToOptInAccountDetails({}, this.props.componentId);
    };

    onPrivateKeyChange = (text: string) => {
        const valid = (text.length === 64 || text.length === 66) && nem.utils.helpers.isPrivateKeyValid(text);
        this.setState({
            importPrivateKey: text,
            validPrivateKey: valid,
        });
    };

    onQRPasswordChange = (text: string) => {
        this.setState({
            loadingQRPassword: true,
        });
        const { encryptedQRWallet } = this.state;
        const encryptedData = encryptedQRWallet.data;
        const salt = nem.crypto.js.enc.Hex.parse(encryptedData.salt);
        const encrypted = encryptedData.priv_key;
        // generate key
        const key = nem.crypto.js
            .PBKDF2(text, salt, {
                keySize: 256 / 32,
                iterations: 2000,
            })
            .toString();
        // separated from priv_key iv and cipherdata
        const iv = encrypted.substring(0, 32);
        const encryptedPrvKey = encrypted.substring(32, 128);
        // separated  vh from priv_key iv and cipherdata
        const obj = {
            ciphertext: nem.crypto.js.enc.Hex.parse(encryptedPrvKey),
            iv: nem.utils.convert.hex2ua(iv),
            key: nem.utils.convert.hex2ua(key.toString()),
        };
        const decrypt = nem.crypto.helpers.decrypt(obj);
        const valid = !(decrypt === '' || (decrypt.length !== 64 && decrypt.length !== 66));
        this.setState({
            loadingQRPassword: false,
            importQRPassword: text,
            validQRPassword: valid,
            importPrivateKey: decrypt,
        });
    };

    onImportPrivateKey = async () => {
        const { importPrivateKey } = this.state;
        await store.dispatchAction({ type: 'optin/addPrivateKey', payload: importPrivateKey });
        this.setState({
            isPrivateKeyModalOpen: false,
            importPrivateKey: '',
            validPrivateKey: false,
        });
    };

    onImportQRPassword = async () => {
        const { importPrivateKey } = this.state;
        await store.dispatchAction({ type: 'optin/addPrivateKey', payload: importPrivateKey });
        this.setState({
            importPrivateKey: '',
            isImportQRModalOpen: false,
            importQRPassword: '',
            validQRPassword: false,
            encryptedQRWallet: null,
        });
    };

    onPrivateKeyQRScanned = async res => {
        try {
            const data = JSON.parse(res.data);
            if (data.v && data.type && data.data.name && data.data.priv_key && data.data.salt) {
                this.setState({
                    encryptedQRWallet: data,
                    isImportQRModalOpen: true,
                });
            } else {
                Router.showMessage({
                    message: 'Invalid QR code',
                    type: 'danger',
                });
            }
        } catch (e) {
            Router.showMessage({
                message: 'Invalid QR code',
                type: 'danger',
            });
        }
    };

    render() {
        const { nis1Accounts, isLoading, componentId } = this.props;
        const dataManager = { isLoading };
        const {
            isPrivateKeyModalOpen,
            importPrivateKey,
            validPrivateKey,
            isImportQRModalOpen,
            importQRPassword,
            validQRPassword,
            loadingQRPassword,
            isRemoveModalOpen,
            isPresentationShown
        } = this.state;

        return (
            <GradientBackground name="connector_small" theme="light" dataManager={dataManager}>
                <TitleBar theme="light" title={translate('optin.title')} onBack={() => Router.goBack(componentId)} />
                {isPresentationShown && <FadeView style={styles.content}> 
                <Text style={{ paddingLeft: 30, paddingRight: 30, marginBottom: 20 }} theme="light" type={'bold'} align={'center'}>
                    {translate('optin.welcomeDescription')}
                </Text>
                <ListContainer type="list" style={styles.list} isScrollable={true}>
                    <FlatList
                        data={nis1Accounts}
                        renderItem={this.renderAccountItem}
                        onEndReachedThreshold={0.9}
                        keyExtractor={(item, index) => '' + index + 'account'}
                    />
                </ListContainer>
                <View style={{ paddingLeft: 30, paddingRight: 30 }}>
                    <Section type="form-item">
                        <Button
                            text={translate('optin.importQR')}
                            theme="light"
                            onPress={() => Router.scanQRCode(this.onPrivateKeyQRScanned)}
                            icon={require('@src/assets/icons/qr_dark.png')}
                        />
                    </Section>
                    <Section type="form-item">
                        <Button
                            text={translate('optin.importPrivateKey')}
                            theme="light"
                            onPress={() => this.setState({ isPrivateKeyModalOpen: true })}
                            icon={require('@src/assets/icons/key_dark.png')}
                        />
                    </Section>
                </View>
                </FadeView>}
                {!isPresentationShown && <Presentation onFinish={() => this.onPresentationFinish()}/>}
                <BasicModal
                    isModalOpen={isImportQRModalOpen}
                    title={translate('optin.qrPassword')}
                    showClose={true}
                    handleClose={() => this.setState({ isImportQRModalOpen: false })}>
                    <Section type="form" style={styles.list} isScrollable>
                        <Section type="form-item">
                            <Input
                                type="password"
                                value={importQRPassword}
                                nativePlaceholder={translate('optin.decryptQRPlaceholder')}
                                placeholder={translate('optin.decryptQR')}
                                theme="light"
                                onChangeText={pw => this.onQRPasswordChange(pw)}
                            />
                            {!validQRPassword && (
                                <Text theme="light" style={styles.warning}>
                                    {translate('optin.invalidDecryptPassword')}
                                </Text>
                            )}
                        </Section>
                        <Section type="form-item">
                            <Button
                                loading={loadingQRPassword}
                                isDisabled={!validQRPassword}
                                text={translate('optin.importAccount')}
                                theme="light"
                                onPress={() => this.onImportQRPassword()}
                            />
                        </Section>
                    </Section>
                </BasicModal>
                <BasicModal
                    isModalOpen={isPrivateKeyModalOpen}
                    title={translate('optin.importPrivateKeyTitle')}
                    showClose={true}
                    handleClose={() => this.setState({ isPrivateKeyModalOpen: false })}>
                    <Section type="form" style={styles.list} isScrollable>
                        <Section type="form-item">
                            <Input
                                value={importPrivateKey}
                                nativePlaceholder={translate('optin.importPrivateKeyPlaceholder')}
                                placeholder={translate('optin.privateKey')}
                                theme="light"
                                onChangeText={pk => this.onPrivateKeyChange(pk)}
                            />
                            {!validPrivateKey && (
                                <Text theme="light" style={styles.warning}>
                                    {translate('optin.invalidPrivateKey')}
                                </Text>
                            )}
                        </Section>
                        <Section type="form-item">
                            <Button
                                isDisabled={!validPrivateKey}
                                text={translate('optin.importAccount')}
                                theme="light"
                                onPress={() => this.onImportPrivateKey()}
                            />
                        </Section>
                    </Section>
                </BasicModal>
                <ConfirmModal
                    isModalOpen={isRemoveModalOpen}
                    showTopbar={true}
                    title={translate('optin.removeModalTitle')}
                    text={translate('optin.removeModalDescription')}
                    showClose={false}
                    onClose={() => this.setState({ isRemoveModalOpen: false })}
                    onSuccess={() => this.handleDeleteAccount()}
                />
            </GradientBackground>
            //</ImageBackground>
        );
    }
}

export default connect(state => ({
    nis1Accounts: state.optin.nis1Accounts,
    isLoading: state.optin.loading,
}))(Welcome);
