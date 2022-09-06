import React, { Component } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Button, GradientBackground, ListContainer, ListItem, Section, Tabs, TitleBar } from '@src/components';
import { connect } from 'react-redux';
import { Router } from '@src/Router';
import Contact from '@src/components/organisms/Contact';
import store from '@src/store';
import translate from '@src/locales/i18n';

const styles = StyleSheet.create({
    tabs: {
        marginBottom: 26,
    },
});
class AddressBookPage extends Component {
    state = {
        listType: 'whitelist',
    };

    submit = () => {
        store
            .dispatchAction({
                type: 'addressBook/selectContact',
                payload: null,
            })
            .then(() => Router.goToAddContact({}, this.props.componentId));
    };

    render() {
        const { addressBook, componentId } = this.props;
        const { listType } = this.state;
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

        return (
            <GradientBackground
                name="mesh"
                theme="light"
                titleBar={<TitleBar theme="light" title={translate('addressBook.title')} onBack={() => Router.goBack(componentId)} />}
            >
                <Tabs style={styles.tabs} value={listType} list={tabs} onChange={listType => this.setState({ listType })} />
                <ListContainer isScrollable={false}>
                    <FlatList
                        data={contactList}
                        renderItem={({ item, index }) => (
                            <ListItem>
                                <Contact data={item} componentId={componentId} id={item.id} key={listType + index} />
                            </ListItem>
                        )}
                    />
                </ListContainer>
                <Section type="form-bottom">
                    <Section type="list">
                        <Section type="form-item">
                            <Button text={translate('addressBook.addContact')} theme="light" onPress={() => this.submit()} />
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
