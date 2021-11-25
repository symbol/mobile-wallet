import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {
    Button,
    GradientBackground,
    ImageBackground,
    Section,
    TitleBar,
} from '@src/components';
import { connect } from 'react-redux';
import { Router } from '@src/Router';
import Contact from '@src/components/organisms/Contact';
import store from '@src/store';
import translate from '@src/locales/i18n';

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
        store
            .dispatchAction({
                type: 'addressBook/selectContact',
                payload: null,
            })
            .then(_ => Router.goToAddContact({}, this.props.componentId));
    };

    render() {
        const { addressBook } = this.props;
        const {} = this.state;

        return (
            <GradientBackground
                name="mesh"
                theme="light"
                titleBar={
                    <TitleBar
                        theme="light"
                        title={translate('addressBook.title')}
                        onBack={() => Router.goBack(this.props.componentId)}
                    />
                }
            >
                <Section type="list" isScrollable>
                    {addressBook.getAllContacts().map(contact => {
                        return (
                            <Contact
                                {...this.props}
                                id={contact.id}
                                name={contact.name}
                                address={contact.address}
                                phone={contact.phone}
                                email={contact.email}
                                label={contact.label}
                                notes={contact.notes}
                            />
                        );
                    })}
                </Section>
                <Section type="form-bottom">
                    <Section type="list">
                        <Section type="form-item">
                            <Button
                                text={translate('addressBook.addContact')}
                                theme="light"
                                onPress={() => this.submit()}
                            />
                        </Section>
                    </Section>
                </Section>
            </GradientBackground>
        );
    }
}

export default connect(state => ({
    addressBook: state.addressBook.addressBook,
}))(AddressBookPage);
