import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Button, GradientBackground, ImageBackground, Input, InputAddress, Section, Text, TitleBar } from '@src/components';
import { connect } from 'react-redux';
import store from '@src/store';
import GlobalStyles from '@src/styles/GlobalStyles';

import { Router } from '@src/Router';
import { IContact } from 'symbol-address-book/IContact';
import { isAddressValid } from '@src/utils/validators';
import translate from '@src/locales/i18n';

const styles = StyleSheet.create({
    warning: {
        color: GlobalStyles.color.RED,
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
        isAddressValid: false,
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
        const { selectedContact, address, name } = this.props;

        if (address && name) {
            this.onAddressChange(address);
            this.setState({ name });
        } else if (selectedContact) {
            this.state.update = true;
            this.state.isAddressValid = true;
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

    onAddressChange = address => {
        const { network } = this.props;
        this.setState({ address: address, isAddressValid: isAddressValid(address, network) });
    };

    onChangeField = fieldName => newValue => {
        if (newValue.length < 30) {
            this.setState({
                [fieldName]: newValue,
            });
        }
    };

    render() {
        let { address, name, phone, email, label, notes, id, isAddressValid } = this.state;

        return (
            <GradientBackground name="mesh_small" theme="light">
                {!this.state.update && (
                    <TitleBar theme="light" onBack={() => Router.goBack(this.props.componentId)} title={translate('addressBook.addContact')} />
                )}
                {this.state.update && (
                    <TitleBar theme="light" onBack={() => Router.goBack(this.props.componentId)} title={translate('addressBook.updateContact')} />
                )}
                <Section type="form" isScrollable>
                    <Section type="form-item">
                        <Input value={name} placeholder={translate('table.name')} theme="light" onChangeText={this.onChangeField('name')} />
                        {name.length === 0 && (
                            <Text theme="light" style={styles.warning}>
                                {translate('addressBook.nameWarning')}
                            </Text>
                        )}
                    </Section>
                    <Section type="form-item">
                        <InputAddress
                            value={address}
                            placeholder={translate('table.address')}
                            theme="light"
                            fullWidth
                            onChangeText={address => this.onAddressChange(address)}
                            showAddressBook={false}
                        />
                        {!isAddressValid && (
                            <Text theme="light" style={styles.warning}>
                                {translate('addressBook.addressWarning')}
                            </Text>
                        )}
                    </Section>
                    <Section type="form-item">
                        <Input value={phone} placeholder={translate('table.phone')} theme="light" onChangeText={this.onChangeField('phone')} />
                    </Section>
                    <Section type="form-item">
                        <Input value={email} placeholder={translate('table.email')} theme="light" onChangeText={email => this.setState({ email })} />
                    </Section>
                    <Section type="form-item">
                        <Input value={notes} placeholder={translate('table.notes')} theme="light" onChangeText={notes => this.setState({ notes })} />
                    </Section>
                    {!this.state.update && (
                        <Section type="form-bottom">
                            <Section type="button">
                                <Button
                                    text={translate('CreateNewAccount.submitButton')}
                                    theme="light"
                                    onPress={() => this.submit()}
                                    isDisabled={!isAddressValid || name.length < 1}
                                />
                            </Section>
                        </Section>
                    )}
                    {this.state.update && (
                        <Section type="form-bottom">
                            <Section type="button">
                                <Button
                                    text={translate('addressBook.updateContact')}
                                    theme="light"
                                    onPress={() => this.update(id)}
                                    isDisabled={!isAddressValid || name.length < 1}
                                />
                            </Section>
                        </Section>
                    )}
                </Section>
            </GradientBackground>
        );
    }
}

export default connect(state => ({
    network: state.network.selectedNetwork,
    addressBook: state.addressBook.addressBook,
    selectedContact: state.addressBook.selectedContact,
}))(AddContact);
