import React, { Component } from 'react';
import { Button, GradientBackground, Row, Section, Text, TitleBar } from '@src/components';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Router } from '@src/Router';
import Contact from '@src/components/organisms/Contact';
import store from '@src/store';
import translate from '@src/locales/i18n';
import GlobalStyles from '@src/styles/GlobalStyles';

type Props = {
    componentId: string,
};

type State = {};

const styles = StyleSheet.create({
    tab: {
        paddingBottom: 5,
        paddingLeft: 10,
    },
    activeTab: {
        borderBottomColor: GlobalStyles.color.PINK,
        borderBottomWidth: 2,
        marginBottom: -2,
        marginLeft: 10,
    },
});
class AddressBookPage extends Component<Props, State> {
    state = {
        selectedTab: 'whitelist',
        addressBookContacts: this.props.addressBook.getWhiteListedContacts(),
    };

    submit = () => {
        store
            .dispatchAction({
                type: 'addressBook/selectContact',
                payload: null,
            })
            .then(() => Router.goToAddContact({}, this.props.componentId));
    };

    onSelectBlackList = () => {
        this.setState({
            selectedTab: 'blacklist',
            addressBookContacts: this.props.addressBook.getBlackListedContacts(),
        });
    };

    onSelectWhiteList = () => {
        this.setState({
            selectedTab: 'whitelist',
            addressBookContacts: this.props.addressBook.getWhiteListedContacts(),
        });
    };

    render() {
        const { selectedTab, addressBookContacts } = this.state;

        return (
            <GradientBackground
                name="mesh"
                theme="light"
                titleBar={
                    <TitleBar theme="light" title={translate('addressBook.title')} onBack={() => Router.goBack(this.props.componentId)} />
                }
            >
                {
                    <Section type="form-item">
                        <Row style={styles.tabs}>
                            <TouchableOpacity
                                style={[{ marginRight: 16 }, styles.tab, selectedTab === 'whitelist' && styles.activeTab]}
                                onPress={() => this.onSelectWhiteList()}
                            >
                                <Text type="bold" theme="light">
                                    Whitelist
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[{ marginRight: 16 }, styles.tab, selectedTab === 'blacklist' && styles.activeTab]}
                                onPress={() => this.onSelectBlackList()}
                            >
                                <Text type="bold" theme="light">
                                    Blacklist
                                </Text>
                            </TouchableOpacity>
                        </Row>
                    </Section>
                }
                <Section type="list" isScrollable>
                    {addressBookContacts.map((contact, index) => {
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
                                key={'addr' + index}
                            />
                        );
                    })}
                </Section>
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
