import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {Button, ImageBackground, Text, Section, TitleBar, Input, GradientBackground} from '@src/components';
import { connect } from 'react-redux';
import { AddressBook } from 'symbol-address-book/AddressBook';
import { writeFile, getFSInfo } from 'react-native-fs';
import store from '@src/store';

import { Router } from '@src/Router';
import { IContact } from 'symbol-address-book/IContact';
import PopupModal from '@src/components/molecules/PopupModal';

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    section: {
        marginTop: 20,
        marginRight: '3%',
        marginLeft: '3%',
    },
    button: {
        marginTop: 20,
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
        isModalOpen: false,
        isRemoveModalOpen: false,
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
        store.dispatchAction({ type: 'addressBook/removeContact', payload: id }).then(_ => Router.goBack(this.props.componentId));
    };

    cancelRemove = () => {
        this.setState({
            isRemoveModalOpen: false,
        });
    };

    render() {
        const { selectedContact } = this.props;
        const { isRemoveModalOpen } = this.state;
        return (
            <ImageBackground name="tanker">
                <TitleBar theme="light" onBack={() => Router.goBack(this.props.componentId)} title="Contact Profile" />
                <Section type="form" style={styles.section}>
                    <Section type="form-item">
                        <Text type="text" style={styles.title} theme="light"> Name </Text>
                        <Text type="text" theme="light"> {selectedContact.name}</Text>
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
                <PopupModal
                    isModalOpen={isRemoveModalOpen}
                    showTopbar={true}
                    title={'Remove contact'}
                    showClose={true}
                    onClose={() => this.setState({ isRemoveModalOpen: false })}>
                    <Section type="form">
                        <Section type="form-bottom">
                            <Button text="Confirm" theme="light" onPress={() => this.confirmRemove(selectedContact.id)} />
                        </Section>
                        <Section type="form-bottom">
                            <Button text="Cancel" theme="light" onPress={() => this.cancelRemove(selectedContact.id)} />
                        </Section>
                    </Section>
                </PopupModal>

            </ImageBackground>
        );
    }
}

export default connect(state => ({
    addressBook: state.addressBook.addressBook,
    selectedContact: state.addressBook.selectedContact,
}))(ContactProfile);
