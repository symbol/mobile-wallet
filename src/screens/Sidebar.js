import React, { Component } from 'react';
import {
    FlatList,
    Image,
    Platform,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    Button,
    Col,
    GradientBackground,
    Icon,
    Input,
    ManagerHandler,
    OptionsMenu,
    Row,
    Section,
    SymbolGradientContainer,
    Text,
    TitleBar,
    Trunc,
} from '@src/components';
import GlobalStyles from '@src/styles/GlobalStyles';
import { Router } from '@src/Router';
import { connect } from 'react-redux';
import store from '@src/store';
import PopupModal from '@src/components/molecules/PopupModal';
import { downloadFile } from '@src/utils/donwload';
import ConfirmModal from '@src/components/molecules/ConfirmModal';
import { showPasscode } from '@src/utils/passcode';
import translate from '@src/locales/i18n';
import { getAccountIndexFromDerivationPath } from '@src/utils/format';

const styles = StyleSheet.create({
    root: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#0005',
    },
    menuContainer: {
        width: '80%',
        height: '100%',
        backgroundColor: GlobalStyles.color.DARKWHITE,
    },
    selectedAccountBox: {
        overflow: 'hidden',
        height: '100%',
        flex: 0,
        width: '100%',
        margin: 0,
        padding: 0,
    },
    selectedAccountBoxContent: {},
    titleBar: {
        marginTop:
            (StatusBar.currentHeight || 0) + (Platform.OS === 'ios' ? 20 : 0),
    },
    selectedAccountName: {},
    selectedAccountAddress: {
        fontSize: 1 * 12,
        lineHeight: 1.75 * 12,
        marginBottom: 17,
    },
    selectedAccountMosaic: {
        fontSize: 1 * 12,
        lineHeight: 1.75 * 12,
    },
    selectedAccountBalance: {
        fontSize: 2.5 * 12,
        lineHeight: 3.25 * 12,
    },
    selectedAccountBalanceLight: {
        fontSize: 2.5 * 12,
        lineHeight: 3.25 * 12,
        opacity: 0.6,
    },
    connectorImage: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: null,
        height: '100%',
        resizeMode: 'contain',
        aspectRatio: 1,
    },
    selectedIndex: {
        position: 'absolute',
        bottom: -45,
        left: 30,
        fontSize: 120,
        lineHeight: null,
        opacity: 0.07,
    },
    accountBox: {
        backgroundColor: GlobalStyles.color.WHITE,
        borderRadius: 5,
        marginTop: 8,
        //marginBottom: 4,
        paddingHorizontal: 32,
        paddingVertical: 8,
    },
    accountType: {
        marginTop: -15,
    },
    optionsIcon: {
        width: 34,
        height: 40,
        alignItems: 'flex-end',
        paddingTop: 4,
        paddingRight: 10,
        marginRight: -16,
    },
    topOptinIcon: {
        paddingTop: 11,
    },
    menuBottomContainer: {
        //borderTopWidth: 1,
        borderColor: GlobalStyles.color.SECONDARY,
        paddingVertical: 8,
        alignItems: 'flex-start',
        //backgroundColor: GlobalStyles.color.WHITE,
    },
    menuItem: {
        margin: 4,
        paddingHorizontal: 30,
        paddingVertical: 8,
    },
    menuItemIcon: {
        marginRight: 17,
    },
    menuItemText: {},
    menuItemTextDisabled: {
        color: '#666666',
    },
});

type Props = {
    componentId: string,
};

type State = {
    isNameModalOpen: boolean,
    editingAccountId: string,
    newName: string,
    savingPaperWallet: boolean,
};

class Sidebar extends Component<Props, State> {
    state = {
        isNameModalOpen: false,
        isRemoveModalOpen: false,
        removeModalTitle: '',
        removeModalDescription: '',
        editingAccountId: '',
        newName: '',
    };

    handleSelectAccount = id => {
        store.dispatchAction({ type: 'wallet/loadAccount', payload: id });
    };

    goToAddressBook = () => {
        Router.goToAddressBook({}, this.props.componentId);
    };

    handleDeleteAccount = () => {
        const { editingAccountId } = this.state;
        store.dispatchAction({
            type: 'wallet/removeAccount',
            payload: editingAccountId,
        });
        this.setState({
            isRemoveModalOpen: false,
        });
    };

    handleOpenRemoveAccountModal = async (
        id,
        removeModalTitle,
        removeModalDescription
    ) => {
        showPasscode(this.props.componentId, () => {
            this.setState({
                isRemoveModalOpen: true,
                removeModalTitle,
                removeModalDescription,
                editingAccountId: id,
            });
        });
    };

    handleOpenRenameAccountModal = async (id, name) => {
        await this.setState({
            isNameModalOpen: true,
            editingAccountId: id,
            newName: name,
        });
    };

    handleRenameAccount = () => {
        const { editingAccountId, newName } = this.state;
        store.dispatchAction({
            type: 'wallet/renameAccount',
            payload: { id: editingAccountId, newName: newName },
        });
        this.setState({
            isNameModalOpen: false,
        });
    };

    handleAddAccount = () => {
        Router.goToCreateAccount({}, this.props.componentId);
    };

    handleBackupAccounts = async () => {
        this.setState({ savingPaperWallet: true });
        const paperWalletBytes = await store.dispatchAction({
            type: 'wallet/downloadPaperWallet',
        });
        const uniqueVal = new Date()
            .getTime()
            .toString()
            .slice(9);
        downloadFile(
            paperWalletBytes,
            `symbol-wallet-${this.props.address.slice(0, 6)}-${uniqueVal}.pdf`,
            'base64'
        )
            .then(() => {
                this.setState({ savingPaperWallet: false });
            })
            .catch(() => {
                this.setState({ savingPaperWallet: false });
            });
    };

    handleAccountDetails = () => {
        Router.goToAccountDetails({}, this.props.componentId);
    };

    handleSettingsClick = () => {
        Router.goToSettings({}, this.props.componentId);
    };

    renderSelectedAccountItem = () => {
        const {
            address,
            selectedAccount,
            balance,
            nativeMosaicNamespace,
            isLoading,
        } = this.props;
        const options = [
            {
                iconName: 'edit_light',
                label: translate('sidebar.rename'),
                onPress: () =>
                    this.handleOpenRenameAccountModal(
                        selectedAccount.id,
                        selectedAccount.name
                    ),
            },
            // { iconName: 'delete_light', label: 'Delete', onPress: () => this.handleDeleteAccount(selectedAccount.id) },
            {
                iconName: 'wallet_filled_light',
                label: translate('sidebar.details'),
                onPress: () => this.handleAccountDetails(),
            },
        ];
        const buttons = (
            <OptionsMenu
                list={options}
                style={[styles.optionsIcon, styles.topOptinIcon]}
            >
                <Icon name="options_dark" size="small" />
            </OptionsMenu>
        );
        const intBalance = ('' + balance).split('.')[0];
        const decimalBalance = ('' + balance).split('.')[1];
        const truncatedDecimalBalance =
            intBalance.length < 9
                ? intBalance.length > 4 && decimalBalance
                    ? decimalBalance.slice(
                          0,
                          decimalBalance.length - (intBalance.length - 2)
                      ) + '...'
                    : decimalBalance
                : '..';

        return (
            <SymbolGradientContainer
                style={styles.selectedAccountBox}
                noPadding
            >
                <Image
                    source={require('@src/assets/backgrounds/connector.png')}
                    style={styles.connectorImage}
                />
                <TitleBar
                    onBack={() => this.props.onHide()}
                    buttons={buttons}
                    style={styles.titleBar}
                />
                <Section type="form" style={styles.selectedAccountBoxContent}>
                    <ManagerHandler
                        dataManager={{ isLoading }}
                        theme="dark"
                        noLoadingText
                    >
                        <Text
                            style={styles.selectedAccountName}
                            type="title-small"
                            theme="dark"
                        >
                            {selectedAccount ? selectedAccount.name : ''}{' '}
                            {selectedAccount.type === 'optin' && (
                                <Icon name="warning" size="small" />
                            )}
                        </Text>
                        <Text
                            style={styles.selectedAccountAddress}
                            theme="dark"
                        >
                            <Trunc type="address">{address}</Trunc>
                        </Text>
                        <Row align="end" justify="space-between">
                            <Text
                                style={styles.selectedAccountMosaic}
                                theme="dark"
                            >
                                {nativeMosaicNamespace}
                            </Text>
                            <Row>
                                <Text
                                    style={styles.selectedAccountBalance}
                                    theme="dark"
                                >
                                    {intBalance}
                                </Text>
                                {decimalBalance && (
                                    <Text
                                        style={
                                            styles.selectedAccountBalanceLight
                                        }
                                        theme="dark"
                                    >
                                        .{truncatedDecimalBalance}
                                    </Text>
                                )}
                            </Row>
                        </Row>
                    </ManagerHandler>
                </Section>
            </SymbolGradientContainer>
        );
    };

    renderAccountSelectorItem = ({ name, id, type, path }) => {
        const {
            networkType,
            nativeMosaicNamespace,
            accountBalances,
        } = this.props;
        const deleteText =
            type === 'hd' || type === 'optin'
                ? translate('sidebar.hide')
                : translate('sidebar.remove');

        const deleteModalTitle =
            type === 'hd' || type === 'optin'
                ? translate('sidebar.hideAccountTitle')
                : translate('sidebar.removeAccountTitle');

        const deleteModalDescription =
            type === 'hd' || type === 'optin'
                ? translate('sidebar.hideAccountDescription')
                : translate('sidebar.removeAccountDescription');

        const index = getAccountIndexFromDerivationPath(path, networkType);

        const options = [
            {
                iconName: 'edit_light',
                label: translate('sidebar.rename'),
                onPress: () => this.handleOpenRenameAccountModal(id, name),
            },
        ];

        if (parseInt(index) !== 0 || type === 'optin') {
            options.push({
                iconName: 'delete_light',
                label: deleteText,
                onPress: () =>
                    this.handleOpenRemoveAccountModal(
                        id,
                        deleteModalTitle,
                        deleteModalDescription
                    ),
            });
        }

        return (
            <TouchableOpacity
                style={styles.accountBox}
                onPress={() => this.handleSelectAccount(id)}
            >
                <Row justify="space-between" fullWidth>
                    <Text type="bold" theme="light">
                        {name}{' '}
                        {type === 'optin' && (
                            <Icon name="warning" size="small" />
                        )}
                    </Text>
                    <OptionsMenu list={options} style={styles.optionsIcon}>
                        <Icon name="options_light" size="small" />
                    </OptionsMenu>
                </Row>
                <Row justify="space-between" fullWidth>
                    <Text
                        type="regular"
                        align="left"
                        theme="light"
                        style={styles.accountType}
                    >
                        {type === 'hd' &&
                            translate('sidebar.seed') + ' ' + index}
                        {type === 'privateKey' && translate('sidebar.pk')}
                        {type === 'optin' && translate('sidebar.optin')}
                    </Text>
                    <Text
                        type="regular"
                        align="right"
                        theme="light"
                        style={styles.accountType}
                    >
                        {accountBalances && accountBalances[id] !== undefined
                            ? `${accountBalances[id]} ${nativeMosaicNamespace}`
                            : ''}
                    </Text>
                </Row>
            </TouchableOpacity>
        );
    };

    renderMenuItem = ({ iconName, text, onPress, disabled = false }) => {
        return (
            <TouchableOpacity onPress={() => onPress()} disabled={disabled}>
                <Row fullWidth style={styles.menuItem} align="center">
                    <Icon
                        name={iconName}
                        style={styles.menuItemIcon}
                        size="small"
                    />
                    <Text
                        theme="light"
                        type="bold"
                        style={
                            disabled
                                ? styles.menuItemTextDisabled
                                : styles.menuItemText
                        }
                    >
                        {text}
                    </Text>
                </Row>
            </TouchableOpacity>
        );
    };

    render = () => {
        const { accounts, selectedAccount, isVisible, isLoading } = this.props;
        const { isNameModalOpen, newName, isRemoveModalOpen } = this.state;
        const menuItems = [
            {
                iconName: 'add_filled_light',
                text: translate('sidebar.addAccount'),
                onPress: () => this.handleAddAccount(),
            },
            {
                iconName: 'address_book_filled_light',
                text: translate('sidebar.openAddressBook'),
                onPress: () => this.goToAddressBook(),
            },
            /*{
                iconName: 'incoming_light',
                text: savingPaperWallet ? 'Saving paper wallet...' : 'Backup Accounts',
                onPress: () => this.handleBackupAccounts(),
                disabled: savingPaperWallet,
            },*/
        ];

        if (!isVisible) return null;

        return (
            // TODO: restyle
            <View style={styles.root}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.menuContainer}>
                        <GradientBackground
                            theme="light"
                            name="mesh_small_2"
                            style={{ width: '100%', height: '100%' }}
                            noPadding
                        >
                            <Col
                                justify="space-between"
                                style={{ height: '100%' }}
                            >
                                <View style={{ flex: 1 }}>
                                    <View style={{ height: 235 }}>
                                        {selectedAccount &&
                                            this.renderSelectedAccountItem(
                                                selectedAccount
                                            )}
                                    </View>
                                    {!isLoading && (
                                        <FlatList
                                            data={accounts}
                                            keyExtractor={(item, index) =>
                                                '' + index + 'accounts'
                                            }
                                            renderItem={account => {
                                                if (
                                                    account.item.id !==
                                                    selectedAccount.id
                                                )
                                                    return this.renderAccountSelectorItem(
                                                        account.item
                                                    );
                                                else return null;
                                            }}
                                        />
                                    )}
                                </View>

                                <View style={[styles.menuBottomContainer]}>
                                    {menuItems.map(this.renderMenuItem)}
                                </View>
                            </Col>
                        </GradientBackground>
                    </View>
                    <TouchableOpacity
                        style={{ width: '20%', height: '100%' }}
                        fullHeight
                        onPress={() => this.props.onHide()}
                    />
                </View>
                <PopupModal
                    isModalOpen={isNameModalOpen}
                    showTopbar={true}
                    title={'Change name'}
                    showClose={true}
                    onClose={() => this.setState({ isNameModalOpen: false })}
                >
                    <Section type="form">
                        <Section type="form-item">
                            <Input
                                value={newName}
                                placeholder="Account name"
                                theme="light"
                                editable={true}
                                onChangeText={newName =>
                                    this.setState({ newName })
                                }
                            />
                        </Section>
                        <Section type="form-bottom">
                            <Button
                                text={translate('sidebar.rename')}
                                theme="light"
                                onPress={() => this.handleRenameAccount()}
                            />
                        </Section>
                    </Section>
                </PopupModal>
                <ConfirmModal
                    isModalOpen={isRemoveModalOpen}
                    showTopbar={true}
                    title={this.state.removeModalTitle}
                    text={this.state.removeModalDescription}
                    showClose={false}
                    onClose={() => this.setState({ isRemoveModalOpen: false })}
                    onSuccess={() => this.handleDeleteAccount()}
                />
            </View>
        );
    };
}

export default connect(state => ({
    address: state.account.selectedAccountAddress,
    selectedAccount: state.wallet.selectedAccount,
    networkType: state.network.selectedNetwork.type,
    balance: state.account.balance,
    nativeMosaicNamespace: 'XYM', //TODO: remove hardcode. state.mosaic.nativeMosaicSubNamespaceName,
    accounts: state.wallet.accounts,
    isLoading: state.account.loading,
    accountBalances: state.wallet.accountBalances,
}))(Sidebar);
