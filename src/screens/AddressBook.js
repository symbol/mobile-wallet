import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Button, ImageBackground, Section, TitleBar } from '@src/components';
import { connect } from 'react-redux';
import { Router } from '@src/Router';
import Contact from '@src/components/organisms/Contact';
import store from '@src/store';

type Props = {
    componentId: string,
};

type State = {};

const styles = StyleSheet.create({
    button: {
        marginLeft: '10%',
        marginRight: '10%',
        marginTop: 10,
        top: -100,
    },
});

class AddressBookPage extends Component<Props, State> {
    state = {};

    submit = () => {
        Router.goToAddContact({}, this.props.componentId);
    };

    render() {
        const { addressBook, componentId } = this.props;
        const {} = this.state;

        return (
            <ImageBackground name="tanker">
                <TitleBar theme="light" title="Address Book" />
                <Section type="list" isScrollable>
                    {addressBook.getAllContacts().map(contact => {
                        return <Contact id={contact.id} name={contact.name} address={contact.address} phone={contact.phone} email={contact.email} label={contact.label} notes={contact.notes} />;
                    })}
                </Section>
                <Section style={styles.button}>
                    <Button text="Add Contact" theme="light" onPress={() => this.submit(addressBook)} />
                </Section>
            </ImageBackground>
        );
    }
}

export default connect(state => ({
    addressBook: state.addressBook.addressBook,
}))(AddressBookPage);
