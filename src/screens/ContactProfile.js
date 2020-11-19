import React, { Component } from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Button, ImageBackground, Text, Section, TitleBar, GradientBackground, TableView } from '@src/components';
import { connect } from 'react-redux';
import store from '@src/store';
import { Router } from '@src/Router';
import { IContact } from 'symbol-address-book/IContact';
import { AddressQR } from 'symbol-qr-library';
import { SvgXml } from 'react-native-svg';
import ConfirmModal from '@src/components/molecules/ConfirmModal';

const styles = StyleSheet.create({
    qr: {
        marginTop: 8,
        marginBottom: 8,
        padding: 8,
        width: 120,
        height: 120,
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
        isRemoveModalOpen: false,
        contactQR: null,
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

    onViewShotRef = (ref: any) => {
        if (ref) {
            this.viewShotRef = ref;
        }
    };

    async componentDidMount() {
        const { selectedContact, network } = this.props;
        const name = selectedContact.name;
        const contactAddress = selectedContact.address;
        const generationHash = network.generationHash;
        const addressQR = new AddressQR(name, contactAddress, network.selectedNetwork.type, generationHash);
        const addressQRsvg = await addressQR.toBase64().toPromise();
        this.setState({
            contactQR: addressQRsvg,
        });
    }

    render() {
        const { selectedContact } = this.props;
        let { isRemoveModalOpen, contactQR } = this.state;
		const list = {
			address: selectedContact.address,
			phone: selectedContact.phone,
			email: selectedContact.email,
			label: selectedContact.label,
			notes: selectedContact.notes,
		};

        return (
            <GradientBackground name="mesh_small" theme="light">
                <TitleBar theme="light" onBack={() => Router.goBack(this.props.componentId)} title={selectedContact.name} />
                <Section type="form" isScrollable>
                    <Section type="form-item">
                        <Section type="center">
                            {contactQR && <Image style={styles.qr} source={{ uri: contactQR }} />}
                        </Section>
                    </Section>
					<Section>
						<TableView data={list} />
					</Section>
					<Section type="form-bottom">
						<Section type="form-item">
							<Button text="Edit Contact" theme="light" onPress={() => this.submit()} />
						</Section>
						<Section type="button">
							<Button text="Remove Contact" theme="dark" onPress={() => this.remove()} />
						</Section>
					</Section>
                </Section>
                <ConfirmModal
                    isModalOpen={isRemoveModalOpen}
                    showTopbar={true}
                    title={'Remove contact'}
                    text={'Are you sure you want to remove contact?'}
                    showClose={false}
                    onClose={() => this.cancelRemove()}
                    onSuccess={() => this.confirmRemove(selectedContact.id)}>
                </ConfirmModal>
            </GradientBackground>
        );
    }
}

export default connect(state => ({
    addressBook: state.addressBook.addressBook,
    selectedContact: state.addressBook.selectedContact,
    network: state.network,
}))(ContactProfile);
