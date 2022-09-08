import React, { useState } from 'react';
import { connect } from 'react-redux';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, ContactItem, GradientBackground, ListContainer, ListItem, Section, Tabs, TitleBar } from '@src/components';
import { Router } from '@src/Router';
import store from '@src/store';
import translate from '@src/locales/i18n';

const styles = StyleSheet.create({
    tabs: {
        marginBottom: 26,
    },
});

export function AddressBookPage(props) {
    const { addressBook, componentId } = props;
    const [listType, setListType] = useState('whitelist');
    const tabs = [
        {
            value: 'whitelist',
            label: translate('addressBook.whitelist'),
        },
        {
            value: 'blacklist',
            label: translate('addressBook.blacklist'),
        },
    ];
    const contactList = addressBook
        .getAllContacts()
        .filter(contact => (listType === 'whitelist' ? !contact.isBlackListed : contact.isBlackListed));

    const goBack = () => Router.goBack(componentId);
    const openContact = contact =>
        store
            .dispatchAction({
                type: 'addressBook/selectContact',
                payload: contact,
            })
            .then(() => Router.goToContactProfile({}, componentId));
    const addContact = () =>
        store
            .dispatchAction({
                type: 'addressBook/selectContact',
                payload: null,
            })
            .then(() => Router.goToAddContact({}, componentId));

    return (
        <GradientBackground
            name="mesh"
            theme="light"
            titleBar={<TitleBar theme="light" title={translate('addressBook.title')} onBack={goBack} />}
        >
            <Tabs style={styles.tabs} value={listType} list={tabs} onChange={setListType} />
            <ListContainer isScrollable={false}>
                <FlatList
                    data={contactList}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={() => openContact(item)}>
                            <ListItem>
                                <ContactItem data={item} key={listType + index} />
                            </ListItem>
                        </TouchableOpacity>
                    )}
                />
            </ListContainer>
            <Section type="form-bottom">
                <Section type="list">
                    <Section type="form-item">
                        <Button text={translate('addressBook.addContact')} theme="light" onPress={addContact} />
                    </Section>
                </Section>
            </Section>
        </GradientBackground>
    );
}

export default connect(state => ({
    addressBook: state.addressBook.addressBook,
}))(AddressBookPage);
