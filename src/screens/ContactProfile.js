import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { GradientBackground, Icon, QRImage, Section, TableView, Text, TitleBar } from '@src/components';
import { connect } from 'react-redux';
import store from '@src/store';
import { Router } from '@src/Router';
import { IContact } from 'symbol-address-book/IContact';
import GlobalStyles from '@src/styles/GlobalStyles';
import ConfirmModal from '@src/components/molecules/ConfirmModal';
import Row from '@src/components/controls/Row';

type Props = {
    componentId: string,
    contact: IContact,
};

type State = {};

class ContactProfile extends Component<Props, State> {
    state = {
        address: '',
        name: '',
        phone: '',
        email: '',
        label: '',
        notes: '',
        update: false,
        isRemoveModalOpen: false,
        contactQR: null,
    };

    submit = () => {
        Router.goToAddContact({}, this.props.componentId);
    };

    remove = () => {
        this.setState({
            isRemoveModalOpen: true,
        });
    };

    confirmRemove = id => {
        store.dispatchAction({ type: 'addressBook/removeContact', payload: id }).then(() => Router.goBack(this.props.componentId));
    };

    cancelRemove = () => {
        this.setState({
            isRemoveModalOpen: false,
        });
    };

    onViewShotRef = (ref: any) => {
        if (ref) {
            this.viewShotRef = ref;
        }
    };

    render() {
        const { selectedContact } = this.props;
        let { isRemoveModalOpen } = this.state;
        const list = {
            address: selectedContact.address,
            phone: selectedContact.phone,
            email: selectedContact.email,
            notes: selectedContact.notes,
        };

        return (
            <GradientBackground name="mesh_small" theme="light">
                <TitleBar theme="light" onBack={() => Router.goBack(this.props.componentId)} title={selectedContact.name} />
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
                            {/* <Button text="Edit Contact" theme="light" onPress={() => this.submit()} /> */}
                            <TouchableOpacity onPress={() => this.submit()}>
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
                                        Edit Contact
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
                                        Remove Contact
                                    </Text>
                                </Row>
                            </TouchableOpacity>
                        </Section>
                        {/* <Section type="button">
							<Button text="Remove Contact" theme="dark" onPress={() => this.remove()} />
						</Section> */}
                    </Section>
                </Section>
                <ConfirmModal
                    isModalOpen={isRemoveModalOpen}
                    showTopbar={true}
                    title={'Remove contact'}
                    text={'Are you sure you want to remove contact?'}
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
