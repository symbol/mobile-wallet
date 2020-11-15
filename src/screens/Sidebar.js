import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, TouchableItem, Image } from 'react-native';
import {
    Section,
    GradientBackground,
    Text,
    Icon,
    Col,
    OptionsMenu,
    Row,
    SymbolGradientContainer,
    Trunc,
    Input,
    Button,
    ManagerHandler,
    TitleBar,
    Container,
} from '@src/components';
import GlobalStyles from '@src/styles/GlobalStyles';
import { Router } from '@src/Router';
import { connect } from 'react-redux';
import store from '@src/store';
import PopupModal from '@src/components/molecules/PopupModal';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: 'row',
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
        width: '100%',
        margin: 0,
        padding: 0,
    },
    selectedAccountBoxContent: {
        paddingBottom: 34,
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
    connectorImage: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: null,
        height: '100%',
        resizeMode: 'contain',
        aspectRatio: 1,
    },
    accountBox: {
        backgroundColor: GlobalStyles.color.WHITE,
        borderRadius: 5,
        marginVertical: 8,
        paddingHorizontal: 32,
        paddingVertical: 8,
    },
    optionsIcon: {
        width: 30,
        height: 40,
        alignItems: 'flex-end',
        paddingTop: 4,
        paddingRight: 10,
        marginRight: -16,
    },
    menuBottomContainer: {
        //borderTopWidth: 1,
        borderColor: GlobalStyles.color.WHITE,
        paddingVertical: 8,
        alignItems: 'center',
    },
    menuItem: {
        margin: 4,
        paddingHorizontal: 17,
        paddingVertical: 8,
    },
    menuItemIcon: {
        marginRight: 17,
    },
    menuItemText: {},
});

type Props = {
    componentId: string,
};

type State = {
    isNameModalOpen: boolean,
    editingAccountId: string,
    newName: string,
};

class Sidebar extends Component<Props, State> {
    state = {
        isNameModalOpen: false,
        editingAccountId: '',
        newName: '',
    };

    handleSelectAccount = id => {
        store.dispatchAction({ type: 'wallet/loadAccount', payload: id });
    };

    goToAddressBook = () => {
        Router.goToAddressBook({}, this.props.componentId);
    };

    handleDeleteAccount = id => {
        store.dispatchAction({ type: 'wallet/removeAccount', payload: id });
    };

    handleOpenRenameAccountModal = async (id, name) => {
        await this.setState({
            isNameModalOpen: true,
            editingAccountId: id,
            newName: name,
        });
    };

    handleRenameAccount = _ => {
        const { editingAccountId, newName } = this.state;
        store.dispatchAction({ type: 'wallet/renameAccount', payload: { id: editingAccountId, newName: newName } });
        this.setState({
            isNameModalOpen: false,
        });
    };

    handleAddAccount = () => {
        Router.goToCreateAccount({}, this.props.componentId);
    };

    handleAccountDetails = () => {
        Router.goToAccountDetails({}, this.props.componentId);
    };

    handleSettingsClick = () => {
        Router.goToSettings({}, this.props.componentId);
    };

    renderSelectedAccountItem = () => {
        const { address, selectedAccount, balance, nativeMosaicNamespace, isLoading } = this.props;
        const options = [
            { iconName: 'edit_light', label: 'Rename', onPress: () => this.handleOpenRenameAccountModal(selectedAccount.id, selectedAccount.name) },
            // { iconName: 'delete_light', label: 'Delete', onPress: () => this.handleDeleteAccount(selectedAccount.id) },
            { iconName: 'wallet_filled_light', label: 'Details', onPress: () => this.handleAccountDetails() },
        ];
        const buttons = (
            <OptionsMenu list={options}>
                <Icon name="options_dark" size="small" />
            </OptionsMenu>
        );

        return (
            <View onPress={() => this.handleAccountDetails()}>
                <SymbolGradientContainer style={styles.selectedAccountBox} noPadding>
                    <Container>
						<Image source={require('@src/assets/backgrounds/connector.png')} style={styles.connectorImage} />
							<ManagerHandler dataManager={{isLoading}}>
							
								<TitleBar onBack={() => this.props.onHide()} buttons={buttons} />
								<Section type="form" style={styles.selectedAccountBoxContent}>
							
								<Text style={styles.selectedAccountName} type="title-small" theme="dark">
									{selectedAccount ? selectedAccount.name : ''}
								</Text>
								<Text style={styles.selectedAccountAddress} theme="dark">
									<Trunc type="address">{address}</Trunc>
								</Text>
								<Row align="end" justify="space-between" fullWidth>
									<Text style={styles.selectedAccountMosaic} theme="dark">
										{nativeMosaicNamespace}
									</Text>
									<Text style={styles.selectedAccountBalance} theme="dark">
										{balance}
									</Text>
								</Row>
							
                        	</Section>
						</ManagerHandler>
                    </Container>
                </SymbolGradientContainer>
            </View>
        );
    };

    renderAccountSelectorItem = ({ name, balance, address = 'n/a', id, type, path }) => {
        const options = [
            { iconName: 'edit_light', label: 'Rename', onPress: () => this.handleOpenRenameAccountModal(id, name) },
            { iconName: 'delete_light', label: 'Delete', onPress: () => this.handleDeleteAccount(id) },
        ];

        return (
            <TouchableOpacity style={styles.accountBox} onPress={() => this.handleSelectAccount(id)}>
                <Row justify="space-between" fullWidth>
                    <Text type="bold" theme="light">
                        {name}
                    </Text>
                    <OptionsMenu list={options} style={styles.optionsIcon}>
                        <Icon name="options_light" size="small" />
                    </OptionsMenu>
                </Row>
                <Text type="regular" align="left" theme="light">
                    <Trunc type="address">{address}</Trunc>
                </Text>
                <Text type="regular" align="left" theme="light">
                    {type === 'hd' ? `Seed account #` : 'Private key account'}
                </Text>
            </TouchableOpacity>
        );
    };

    renderMenuItem = ({ iconName, text, onPress }) => {
        return (
            <TouchableOpacity onPress={() => onPress()}>
                <Row fullWidth style={styles.menuItem} align="center">
                    <Icon name={iconName} style={styles.menuItemIcon} size="small" />
                    <Text theme="light" type="bold" style={styles.menuItemText}>
                        {text}
                    </Text>
                </Row>
            </TouchableOpacity>
        );
    };

    render = () => {
        const { accounts, selectedAccount, isVisible, isLoading } = this.props;
        const { isNameModalOpen, newName } = this.state;
        const menuItems = [
            { iconName: 'add_filled_light', text: 'Add Account', onPress: () => this.handleAddAccount() },
            { iconName: 'wallet_filled_light', text: 'Open address book', onPress: () => this.goToAddressBook() },
        ];

        if (!isVisible) return null;

        return (
            // TODO: restyle
            <View style={styles.root}>
                <View style={styles.menuContainer}>
                    <GradientBackground theme="light" name="mesh_small_2" style={{ width: '100%', height: '100%' }} noPadding>
                        <Col justify="space-between" fullHeight>
                            <Section isScrollable>
                                {selectedAccount && this.renderSelectedAccountItem(selectedAccount)}
                                {accounts.map(account => {
                                    if (account.id !== selectedAccount.id) return this.renderAccountSelectorItem(account);
                                    else return null;
                                })}
                            </Section>
                            <Section style={styles.menuBottomContainer}>{menuItems.map(this.renderMenuItem)}</Section>
                        </Col>
                    </GradientBackground>
                </View>
                <TouchableOpacity justify="end" style={{ width: '100%', height: '100%' }} fullHeight onPress={() => this.props.onHide()} />
                <PopupModal
                    isModalOpen={isNameModalOpen}
                    showTopbar={true}
                    title={'Change name'}
                    showClose={true}
                    onClose={() => this.setState({ isNameModalOpen: false })}>
                    <Section type="form">
                        <Section type="form-item">
                            <Input
                                value={newName}
                                placeholder="Account name"
                                theme="light"
                                editable={true}
                                onChangeText={newName => this.setState({ newName })}
                            />
                        </Section>
                        <Section type="form-bottom">
                            <Button text="Rename" theme="light" onPress={() => this.handleRenameAccount()} />
                        </Section>
                    </Section>
                </PopupModal>
            </View>
        );
    };
}

export default connect(state => ({
    address: state.account.selectedAccountAddress,
    selectedAccount: state.wallet.selectedAccount,
    balance: state.account.balance,
    nativeMosaicNamespace: 'XYM', //TODO: remove hardcode. state.mosaic.nativeMosaicSubNamespaceName,
	accounts: state.wallet.accounts,
	isLoading: state.account.loading,
}))(Sidebar);
