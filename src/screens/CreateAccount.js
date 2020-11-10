import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Section, GradientBackground, TitleBar, Input, Text, Button } from '@src/components';
import { Router } from '@src/Router';
import store from '@src/store';
import { isPrivateKeyValid } from '@src/utils/account';

const styles = StyleSheet.create({});

export default class CreateAccount extends Component {
    state = {
        loading: false,
        name: '',
        privateKey: '',
        isNameValid: false,
        isPkValid: false,
        isIndexValid: true,
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

    render = () => {
        const { name, privateKey, index, isIndexValid, isPkValid, isNameValid, loading } = this.state;
        return (
            <GradientBackground name="mesh_small_2" theme="light">
                <TitleBar theme="light" onBack={() => this.goBack()} title="Create Account" />
                <Section type="form" style={styles.list} isScrollable>
                    <Section type="form-item">
                        <Input value={name} placeholder="New account name" theme="light" fullWidth onChangeText={val => this.handleNameChange(val)} />
                    </Section>
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
                    <Section type="form-item">
                        <Input value={privateKey} placeholder="Private Key" theme="light" fullWidth onChangeText={val => this.handlePkChange(val)} />
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
                </Section>
            </GradientBackground>
        );
    };
}
