import React, { Component } from 'react';
import {Image, StyleSheet, View} from 'react-native';
import { Button, ImageBackground, Text, Section, TitleBar } from '@src/components';
import { connect } from 'react-redux';
import store from '@src/store';
import { Router } from '@src/Router';
import { IContact } from 'symbol-address-book/IContact';
import { AddressQR } from 'symbol-qr-library';
import { SvgXml } from 'react-native-svg';
import ConfirmModal from '@src/components/molecules/ConfirmModal';

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    section: {
        marginTop: 0,
        marginRight: '3%',
        marginLeft: '3%',
    },
    button: {
        marginTop: 20,
    },
    qr: {
        marginTop: 16,
        marginBottom: 16,
        padding: 16,
    }
});

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
        Router.showPasscode(
            {
                resetPasscode: false,
                onSuccess: () => {
                    this.setState({
                        isRemoveModalOpen: true,
                    });
                    Router.goBack(this.props.componentId);
                },
            },
            this.props.componentId
        );
    };

    confirmRemove = id => {
        store.dispatchAction({ type: 'addressBook/removeContact', payload: id }).then(_ => Router.goBack(this.props.componentId));
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

    async componentDidMount() {
        const { selectedContact, network } = this.props;
        const name = selectedContact.name;
        const contactAddress = selectedContact.address;
        const generationHash = network.generationHash;
        const addressQR = new AddressQR(name, contactAddress, network.selectedNetwork.type, generationHash);
        const addressQRsvg = await addressQR.toString('svg').toPromise();
        this.setState({
            contactQR: addressQRsvg,
        });
    }

    render() {
        const { selectedContact } = this.props;
        let { isRemoveModalOpen, contactQR } = this.state;

        return (
            <ImageBackground name="tanker">
                <TitleBar theme="light" onBack={() => Router.goBack(this.props.componentId)} title={selectedContact.name} />
                <Section type="form" style={styles.section}>
                    <Section type="form-item">
                        <Section type="center">
                            {contactQR && <SvgXml style={styles.qr} xml={contactQR} width="140px" height="140px" />}
                        </Section>
                    </Section>
                    <Section type="form-item">
                        <Text type="text" style={styles.title} theme="light"> Address </Text>
                        <Text type="text" theme="light"> {selectedContact.address} </Text>
                    </Section>
                    <Section type="form-item">
                        <Text type="text" style={styles.title} theme="light"> Phone </Text>
                        <Text type="text" theme="light"> {selectedContact.phone} </Text>
                    </Section>
                    <Section type="form-item">
                        <Text type="text" style={styles.title} theme="light"> Email </Text>
                        <Text type="text" theme="light"> {selectedContact.email} </Text>
                    </Section>
                    <Section type="form-item">
                        <Text type="text" style={styles.title} theme="light"> Label </Text>
                        <Text type="text" theme="light"> {selectedContact.label} </Text>
                    </Section>
                    <Section type="form-item">
                        <Text type="text" style={styles.title} theme="light"> Notes </Text>
                        <Text type="text" theme="light"> {selectedContact.notes} </Text>
                    </Section>
                    <Section>
                        <Button style={styles.button} text="Edit Contact" theme="light" onPress={() => this.submit()} />
                    </Section>
                    <Section>
                        <Button style={styles.button} text="Remove Contact" theme="dark" onPress={() => this.remove()} />
                    </Section>
                </Section>
                <ConfirmModal
                    isModalOpen={isRemoveModalOpen}
                    showTopbar={true}
                    title={'Remove contact'}
                    text={'Are you sure you want to remove contact?'}
                    showClose={false}
                    onClose={() => this.cancelRemove()}
                    onSuccess={() => this.confirmRemove(selectedContact.id)}>
                </ConfirmModal>
            </ImageBackground>
        );
    }
}

export default connect(state => ({
    addressBook: state.addressBook.addressBook,
    selectedContact: state.addressBook.selectedContact,
    network: state.network,
}))(ContactProfile);
