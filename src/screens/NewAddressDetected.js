import React, { Component } from 'react';
import { Image, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Input, LinkExplorer, Section, Text } from '@src/components';
import { Router } from '@src/Router';
import translate from '@src/locales/i18n';
import modalStyles from '../components/organisms/ModalSelector.styl';
import store from '@src/store';
const styles = StyleSheet.create({
    buttonIcon: {
        width: 50,
        height: 50,
    },
    addressBookImage: {
        marginLeft: -8,
    },
    title: {
        fontSize: 22,
        lineHeight: 33,
        color: '#3D064B',
        fontFamily: 'NotoSans-Bold',
        marginBottom: -5,
    },
    secondTitle: {
        fontSize: 22,
        lineHeight: 33,
        color: '#3D064B',
        fontFamily: 'NotoSans-Bold',
        marginBottom: -15,
    },
    subtitle: {
        fontFamily: 'NotoSans-Regular',
        fontSize: 12,
        lineHeight: 14,
    },
    bottomText: {
        fontFamily: 'NotoSans-Regular',
        fontSize: 11,
        lineHeight: 14,
        fontSize: 11,
        color: '#000000',
        opacity: 0.7,
        letterSpacing: 0.02,
        marginTop: 10,
    },
    link: {
        marginTop: 10,
    },
    line: {
        borderBottomColor: '#3D064B',
        borderBottomWidth: 1,
        marginLeft: '15%',
        marginRight: '15%',
        marginBottom: 11,
        opacity: 0.3,
    },
    acceptanceForm: {
        backgroundColor: '#f3f4f8',
        paddingLeft: '10%',
        paddingRight: '10%',
        flex: 1,
        bottom: 1,
        left: 0,
        top: 0,
    },
    saveButton: {
        height: 48,
    },

    inputField: {
        marginBottom: -10,
    },
    contactNote: {
        marginBottom: 10,
    },
});

type Props = {
    componentId: string,
    transactionHash: string,
    signerAddress: string,
};

type State = {};

class NewAddressDetected extends Component<Props, State> {
    state = { contactName: '', contactNote: '', visible: false };
    addContact() {
        const contact = {
            address: this.props.signerAddress,
            name: this.state.contactName,
            isBlackListed: false,
            notes: this.state.contactNote,
        };

        store
            .dispatchAction({
                type: 'addressBook/addContact',
                payload: contact,
            })
            .then(() => {
                Router.goBack(this.props.componentId);
                this.setState({ visible: false });
            });
    }
    //TODO:: remove values for transaction signer and hash
    onClosePopup() {
        this.setState({ visible: false });
    }

    render = () => {
        let { contactName, contactNote, visible } = this.state;
        const { transactionHash, signerAddress } = this.props;
        if (!!transactionHash.length && !!signerAddress.length) {
            this.setState({ visible: true });
        }
        return (
            <Modal visible={visible}>
                <ScrollView type="form" style={styles.acceptanceForm}>
                    <TouchableOpacity style={modalStyles.closeButton} onPress={() => this.onClosePopup()} activeOpacity={0.5}>
                        <Image source={require('@src/assets/icons/ic-close-black.png')} />
                    </TouchableOpacity>
                    <Image source={require('@src/assets/icons/Stamp3x.png')} style={styles.buttonIcon} />

                    <Text type="bold" theme="light" style={styles.title} align="left" wrap>
                        {'Success!'}
                    </Text>
                    <Text type="bold" theme="light" style={styles.subtitle} align="left" wrap>
                        {'Transaction signed successfully, pending to be confirmed by network!'}
                    </Text>
                    <Section type="form-item" style={styles.link}>
                        <LinkExplorer type="transaction" value={transactionHash} />
                    </Section>

                    <View style={styles.line} />
                    <Section>
                        <Image
                            source={require('@src/assets/icons/address-book2x.png')}
                            style={(styles.buttonIcon, styles.addressBookImage)}
                        />
                        <Text type="bold" theme="light" style={(styles.title, styles.secondTitle)} align="left" wrap>
                            {'New address detected'}
                        </Text>
                    </Section>
                    <Section type="form-item">
                        <Input
                            style={styles.inputField}
                            value={contactName}
                            theme="light"
                            onChangeText={value => this.setState({ contactName: value })}
                        />
                        <Input
                            style={styles.contactNote}
                            value={contactNote}
                            theme="light"
                            onChangeText={value => this.setState({ contactNote: value })}
                        />
                        <Button
                            theme="dark"
                            style={styles.saveButton}
                            text={translate('history.cosignFormButtonContinue')}
                            disabled={contactName == ''}
                            onPress={() => this.addContact()}
                        />
                        <Text type="bold" theme="light" style={styles.bottomText} align="left" wrap>
                            {
                                'Your address book lets you save cryptocurrency addresses that you use frequently. After you add an address, you won’t have to manually enter it every time it’s requireed and will not have as many security confirmation screens'
                            }
                        </Text>
                    </Section>
                </ScrollView>
            </Modal>
        );
    };
}
export default NewAddressDetected;
