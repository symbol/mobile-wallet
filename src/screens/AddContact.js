import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Button, Dropdown, GradientBackground, Input, InputAddress, Section, Text, TitleBar } from '@src/components';
import { connect } from 'react-redux';
import store from '@src/store';
import GlobalStyles from '@src/styles/GlobalStyles';
import { Router } from '@src/Router';
import { isAddressValid } from '@src/utils/validators';
import translate from '@src/locales/i18n';

const styles = StyleSheet.create({
    warning: {
        color: GlobalStyles.color.RED,
    },
});

export class AddContact extends Component {
    state = {
        address: '',
        name: '',
        notes: '',
        isBlackListed: false,
        update: false,
        isAddressValid: false,
        isAddressTaken: false,
        isAddressCurrent: false,
    };

    addContact = () => {
        const contact = {
            address: this.state.address,
            name: this.state.name,
            notes: this.state.notes,
            isBlackListed: this.state.isBlackListed,
        };

        store
            .dispatchAction({
                type: 'addressBook/addContact',
                payload: contact,
            })
            .then(() => Router.goBack(this.props.componentId));
    };

    updateContact = () => {
        const contact = {
            address: this.state.address,
            name: this.state.name,
            notes: this.state.notes,
            isBlackListed: this.state.isBlackListed,
            id: this.state.id,
        };

        store.dispatchAction({
            type: 'addressBook/selectContact',
            payload: contact,
        });
        store
            .dispatchAction({
                type: 'addressBook/updateContact',
                payload: contact,
            })
            .then(() => Router.goBack(this.props.componentId));
    };

    componentDidMount() {
        const { selectedContact, address, name, isBlackListed } = this.props;
        const isDataProvidedViaProps = address || name || typeof isBlackListed === 'boolean';
        const isUpdateAction = !!selectedContact;

        if (isDataProvidedViaProps) {
            this.onAddressChange(address || '');
            this.onChangeField('name')(name || '');
            this.setState({
                isBlackListed: isBlackListed || false,
            });
        } else if (isUpdateAction) {
            this.setState({
                address: selectedContact.address,
                name: selectedContact.name,
                phone: selectedContact.phone,
                email: selectedContact.email,
                label: selectedContact.label,
                notes: selectedContact.notes,
                isBlackListed: selectedContact.isBlackListed,
                id: selectedContact.id,
                update: true,
                isAddressValid: true,
            });
        }
    }

    onAddressChange = address => {
        const { network, addressBook, currentAddress } = this.props;
        const isValid = isAddressValid(address, network);

        if (isValid) {
            const contact = addressBook.getContactByAddress(address);
            this.setState({
                address,
                isAddressValid: isValid,
                isAddressTaken: !!contact,
                isAddressCurrent: address === currentAddress,
            });
        } else {
            this.setState({
                address,
                isAddressValid: false,
                isAddressTaken: false,
                isAddressCurrent: false,
            });
        }
    };

    onListChange = listType => {
        this.setState({
            isBlackListed: listType === 'blacklist',
            name: listType === 'blacklist' ? '' : this.state.name,
        });
    };

    onChangeField = fieldName => newValue => {
        this.setState({
            [fieldName]: newValue.substr(0, 28),
        });
    };

    render() {
        const { address, name, notes, isBlackListed, isAddressValid, isAddressTaken, isAddressCurrent } = this.state;

        const listType = isBlackListed ? 'blacklist' : 'whitelist';
        const listTypeOptions = [
            {
                value: 'whitelist',
                label: translate('addressBook.whitelist'),
            },
            {
                value: 'blacklist',
                label: translate('addressBook.blacklist'),
            },
        ];
        const isButtonDisabled = !isAddressValid || (!isBlackListed && name.length === 0) || isAddressTaken || isAddressCurrent;
        let addressWarningText = '';
        let titleText = translate('addressBook.addContact');
        let buttonText = translate('CreateNewAccount.submitButton');
        let buttonAction = () => this.addContact();

        if (this.state.update) {
            titleText = translate('addressBook.updateContact');
            buttonText = translate('addressBook.updateContact');
            buttonAction = () => this.updateContact();
        }

        if (!address.length) {
            addressWarningText = translate('addressBook.addressRequiredWarning');
        } else if (!isAddressValid) {
            addressWarningText = translate('addressBook.addressWarning');
        } else if (isAddressTaken) {
            addressWarningText = translate('addressBook.addressTakenWarning');
        } else if (isAddressCurrent) {
            addressWarningText = translate('addressBook.addressCurrentWarning');
        }

        return (
            <GradientBackground name="mesh_small" theme="light">
                <TitleBar theme="light" onBack={() => Router.goBack(this.props.componentId)} title={titleText} />
                <Section type="form" isScrollable>
                    <Section type="form-item">
                        <Dropdown
                            title={translate('addressBook.listType')}
                            theme="light"
                            value={listType}
                            list={listTypeOptions}
                            onChange={listType => this.onListChange(listType)}
                        />
                    </Section>
                    {!isBlackListed && (
                        <Section type="form-item">
                            <Input
                                value={name}
                                placeholder={translate('table.name')}
                                theme="light"
                                onChangeText={this.onChangeField('name')}
                                testID="input-name"
                            />
                            {name.length === 0 && (
                                <Text theme="light" style={styles.warning}>
                                    {translate('addressBook.nameWarning')}
                                </Text>
                            )}
                        </Section>
                    )}
                    <Section type="form-item">
                        <InputAddress
                            value={address}
                            placeholder={translate('table.address')}
                            theme="light"
                            fullWidth
                            onChangeText={address => this.onAddressChange(address)}
                            showAddressBook={false}
                            testID="input-address"
                        />
                        {!!addressWarningText && (
                            <Text theme="light" style={styles.warning}>
                                {addressWarningText}
                            </Text>
                        )}
                    </Section>
                    <Section type="form-item">
                        <Input
                            value={notes}
                            placeholder={translate('table.notes')}
                            theme="light"
                            onChangeText={this.onChangeField('notes')}
                            testID="input-notes"
                        />
                    </Section>
                    <Section type="form-bottom">
                        <Section type="button">
                            <Button text={buttonText} theme="light" onPress={buttonAction} isDisabled={isButtonDisabled} />
                        </Section>
                    </Section>
                </Section>
            </GradientBackground>
        );
    }
}

export default connect(state => ({
    currentAddress: state.account.selectedAccountAddress,
    network: state.network.selectedNetwork,
    addressBook: state.addressBook.addressBook,
    selectedContact: state.addressBook.selectedContact,
}))(AddContact);

AddContact.propsTypes = {
    address: PropTypes.string,
    name: PropTypes.string,
    isBlackListed: PropTypes.bool,
};
