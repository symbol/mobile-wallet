import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { GradientBackground, Icon, QRImage, Section, TableView, Text, TitleBar } from '@src/components';
import { connect } from 'react-redux';
import store from '@src/store';
import { Router } from '@src/Router';
import GlobalStyles from '@src/styles/GlobalStyles';
import ConfirmModal from '@src/components/molecules/ConfirmModal';
import Row from '@src/components/controls/Row';
import { createGoBack } from '@src/utils/navigation';
import translate from '@src/locales/i18n';

class ContactProfile extends Component {
    state = {
        address: '',
        name: '',
        label: '',
        notes: '',
        update: false,
        isRemoveModalOpen: false,
        contactQR: null,
    };

    edit = () => {
        Router.goToAddContact({}, this.props.componentId);
    };

    remove = () => {
        this.setState({
            isRemoveModalOpen: true,
        });
    };

    confirmRemove = id => {
        store.dispatchAction({ type: 'addressBook/removeContact', payload: id }).then(createGoBack(this.props.componentId));
    };

    cancelRemove = () => {
        this.setState({
            isRemoveModalOpen: false,
        });
    };

    render() {
        const { selectedContact } = this.props;
        const { isRemoveModalOpen } = this.state;
        const list = {
            address: selectedContact.address,
            transactionsAllowed: selectedContact.isBlackListed
                ? translate('addressBook.transactionsBlocked')
                : translate('addressBook.transactionsAllowed'),
            notes: selectedContact.notes,
        };

        return (
            <GradientBackground name="mesh_small" theme="light">
                <TitleBar theme="light" onBack={createGoBack(this.props.componentId)} title={selectedContact.name} />
                <Section type="form" isScrollable>
                    <Section type="form-item">
                        <Section type="center">
                            <QRImage type="address" accountName={selectedContact.name} address={selectedContact.address} />
                        </Section>
                    </Section>
                    <Section>
                        <TableView data={list} />
                    </Section>
                    <Section type="form-bottom">
                        <Section type="form-item">
                            <TouchableOpacity onPress={() => this.edit()}>
                                <Row align="center" justify="start">
                                    <Icon name="edit_primary" size="small" style={{ marginRight: 8 }} />
                                    <Text
                                        style={{
                                            color: GlobalStyles.color.PRIMARY,
                                        }}
                                        theme="light"
                                        type="bold"
                                        align="left"
                                    >
                                        {translate('addressBook.editContact')}
                                    </Text>
                                </Row>
                            </TouchableOpacity>
                        </Section>
                        <Section type="button">
                            <TouchableOpacity onPress={() => this.remove()}>
                                <Row align="center" justify="start">
                                    <Icon name="delete_primary" size="small" style={{ marginRight: 8 }} />
                                    <Text
                                        style={{
                                            color: GlobalStyles.color.PRIMARY,
                                        }}
                                        theme="light"
                                        type="bold"
                                        align="left"
                                    >
                                        {translate('addressBook.removeContact')}
                                    </Text>
                                </Row>
                            </TouchableOpacity>
                        </Section>
                    </Section>
                </Section>
                <ConfirmModal
                    isModalOpen={isRemoveModalOpen}
                    showTopbar={true}
                    title={translate('addressBook.removeContactModalTitle')}
                    text={translate('addressBook.removeContactModalBody')}
                    showClose={false}
                    onClose={() => this.cancelRemove()}
                    onSuccess={() => this.confirmRemove(selectedContact.id)}
                ></ConfirmModal>
            </GradientBackground>
        );
    }
}

export default connect(state => ({
    addressBook: state.addressBook.addressBook,
    selectedContact: state.addressBook.selectedContact,
    network: state.network,
}))(ContactProfile);
