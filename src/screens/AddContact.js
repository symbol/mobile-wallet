import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Button, ImageBackground, Input, InputAddress, Section, TitleBar } from '@src/components';
import { connect } from 'react-redux';
import { AddressBook } from 'symbol-address-book/AddressBook';
import { writeFile, getFSInfo } from 'react-native-fs';
import store from '@src/store';
import Store from '@src/store';

import { Router } from '@src/Router';
import { IContact } from 'symbol-address-book/IContact';

const styles = StyleSheet.create({
    list: {
        marginTop: 20,
    },
});

type Props = {
    componentId: string,
    contact: IContact,
};

type State = {};

class AddContact extends Component<Props, State> {
    state = {
        address: '',
        name: '',
        phone: '',
        email: '',
        label: '',
        notes: '',
        update: false,
    };

    submit = () => {
        const contact = {
            address: this.state.address,
            name: this.state.name,
            phone: this.state.phone,
            email: this.state.email,
            label: this.state.label,
            notes: this.state.notes,
        };

        store.dispatchAction({ type: 'addressBook/addContact', payload: contact }).then(_ => Router.goBack(this.props.componentId));
    };

    update = id => {
        const contact = {
            address: this.state.address,
            name: this.state.name,
            phone: this.state.phone,
            email: this.state.email,
            label: this.state.label,
            notes: this.state.notes,
            id: id,
        };
        store.dispatchAction({ type: 'addressBook/selectContact', payload: contact });
        store.dispatchAction({ type: 'addressBook/updateContact', payload: contact }).then(_ => Router.goBack(this.props.componentId));
    };

    componentDidMount() {
        const { selectedContact } = this.props;
        if (selectedContact) {
            this.state.update = true;
            this.setState({
                address: selectedContact.address,
                name: selectedContact.name,
                phone: selectedContact.phone,
                email: selectedContact.email,
                label: selectedContact.label,
                notes: selectedContact.notes,
                id: selectedContact.id,
            });
        }
    }

    render() {
        let { address, name, phone, email, label, notes, id } = this.state;

        return (
            <ImageBackground name="tanker">
                {!this.state.update && <TitleBar theme="light" onBack={() => Router.goBack(this.props.componentId)} title="Add Contact" />}
                {this.state.update && <TitleBar theme="light" onBack={() => Router.goBack(this.props.componentId)} title="Update Contact" />}
                <Section type="form" style={styles.list} isScrollable>
                    <Section type="form-item">
                        <InputAddress value={address} placeholder="Address" theme="light" fullWidth onChangeText={address => this.setState({ address })} />
                    </Section>
                    <Section type="form-item">
                        <Input value={name} placeholder="Name" theme="light" onChangeText={name => this.setState({ name })} />
                    </Section>
                    <Section type="form-item">
                        <Input value={phone} placeholder="Phone" theme="light" onChangeText={phone => this.setState({ phone })} />
                    </Section>
                    <Section type="form-item">
                        <Input value={email} placeholder="Email" theme="light" onChangeText={email => this.setState({ email })} />
                    </Section>
                    <Section type="form-item">
                        <Input value={label} placeholder="Label" theme="light" onChangeText={label => this.setState({ label })} />
                    </Section>
                    <Section type="form-item">
                        <Input value={notes} placeholder="Notes" theme="light" onChangeText={notes => this.setState({ notes })} />
                    </Section>
                    {!this.state.update && (
                        <Section>
                            <Button text="Confirm" theme="light" onPress={() => this.submit()} />
                        </Section>
                    )}
                    {this.state.update && (
                        <Section>
                            <Button text="Update Contact" theme="light" onPress={() => this.update(id)} />
                        </Section>
                    )}
                </Section>
            </ImageBackground>
        );
    }
}

export default connect(state => ({
    addressBook: state.addressBook.addressBook,
    selectedContact: state.addressBook.selectedContact,
}))(AddContact);
