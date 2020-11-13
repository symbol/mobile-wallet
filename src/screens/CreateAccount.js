import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Section, GradientBackground, TitleBar, Input, Text, Button } from '@src/components';
import { Router } from '@src/Router';
import store from '@src/store';
import { isPrivateKeyValid } from '@src/utils/account';
import RadioForm from 'react-native-simple-radio-button';
import { AccountQR, ContactQR } from 'symbol-qr-library';
import PopupModal from '@src/components/molecules/PopupModal';
import PasswordModal from '@src/components/molecules/PasswordModal';

const styles = StyleSheet.create({});

export default class CreateAccount extends Component {
    state = {
        loading: false,
        error: '',
        name: '',
        privateKey: '',
        isNameValid: false,
        isPkValid: false,
        isIndexValid: true,
        importMethod: 0,
        scannedAccountQR: null,
        showDecryptModal: false,
    };

    goBack = () => {
        Router.goBack(this.props.componentId);
    };

    handleNameChange = val => {
        this.setState({ name: val, isNameValid: val.length > 0 });
    };

    handlePkChange = val => {
        this.setState({ privateKey: val, isPkValid: isPrivateKeyValid(val) });
    };

    handleIndexChange = val => {
        const parsedVal = parseInt(val);
        this.setState({ index: parsedVal, isIndexValid: val === '' || (!isNaN(parsedVal) && parsedVal >= 0) });
    };

    createSeedAccount = async () => {
        this.setState({ loading: true });
        const { name, index } = this.state;
        await store.dispatchAction({ type: 'wallet/createHdAccount', payload: { index, name } });
        this.goBack();
    };

    createPrivateKeyAccount = async () => {
        this.setState({ loading: true });
        const { name, privateKey } = this.state;
        await store.dispatchAction({ type: 'wallet/createPkAccount', payload: { privateKey, name } });
        this.goBack();
    };

    onDecryptQR = password => {
        const { scannedAccountQR } = this.state;
        try {
            const decrypted = new AccountQR.fromJSON(scannedAccountQR, password);
            this.setState({ privateKey: decrypted.accountPrivateKey });
        } catch {
            this.setState({ error: 'Invalid password provided' });
        }
    };

    onReadQRCode = res => {
        try {
            const accountQR = AccountQR.fromJSON(res.data);
            this.setState({ privateKey: accountQR.accountPrivateKey });
            return this.createPrivateKeyAccount();
        } catch (e) {
            if (e.message === 'Could not parse account information.') {
                this.setState({ scannedAccountQR: res.data, showDecryptModal: true });
            }
            this.setState({ error: 'Invalid QR' });
        }
    };

    scanPrivateKeyQR = async () => {
        Router.scanQRCode(this.onReadQRCode, () => {});
    };

    render = () => {
        const { name, privateKey, index, isIndexValid, isPkValid, isNameValid, loading, importMethod, showDecryptModal, error } = this.state;
        return (
            <GradientBackground dataManager={{ isLoading: loading }} name="mesh_small_2" theme="light">
                <TitleBar theme="light" onBack={() => this.goBack()} title="Create Account" />
                <Section type="form" style={styles.list} isScrollable>
                    <Section type="form-item">
                        <Input value={name} placeholder="New account name" theme="light" fullWidth onChangeText={val => this.handleNameChange(val)} />
                    </Section>
                    <RadioForm
                        radio_props={[
                            { label: 'Create by seed index', value: 0 },
                            { label: 'Create by private key', value: 1 },
                        ]}
                        initial={0}
                        onPress={value => {
                            this.setState({ importMethod: value });
                        }}
                    />
                    {importMethod === 0 && (
                        <View>
                            <Section type="form-item">
                                <Input
                                    value={index}
                                    placeholder="Seed index (leave blank for automatic increase)"
                                    theme="light"
                                    fullWidth
                                    onChangeText={val => this.handleIndexChange(val)}
                                />
                            </Section>
                            <Section type="form-bottom">
                                <Button
                                    text="Create seed account"
                                    theme="light"
                                    disabled={!isNameValid || !isIndexValid}
                                    onPress={() => this.createSeedAccount()}
                                    loading={loading}
                                />
                            </Section>
                        </View>
                    )}
                    {importMethod === 1 && (
                        <View>
                            <Section type="form-item">
                                <Input value={privateKey} placeholder="Private Key" theme="light" fullWidth onChangeText={val => this.handlePkChange(val)} />
                            </Section>
                            <Section type="form-bottom">
                                <Button text="Import by QR" theme="light" disabled={!isNameValid} loading={loading} onPress={() => this.scanPrivateKeyQR()} />
                            </Section>
                            <Section type="form-item">
                                <Text theme="light" type="alert">
                                    {error}
                                </Text>
                            </Section>
                            <Section type="form-bottom">
                                <Button
                                    text="Create private key account"
                                    theme="light"
                                    disabled={!isNameValid || !isPkValid}
                                    loading={loading}
                                    onPress={() => this.createPrivateKeyAccount()}
                                />
                            </Section>
                        </View>
                    )}
                </Section>
                <PasswordModal
                    showModal={showDecryptModal}
                    title={'Decrypt QR Code'}
                    onSubmit={this.onDecryptQR}
                    onClose={() => this.setState({ showDecryptModal: false })}
                />
            </GradientBackground>
        );
    };
}
