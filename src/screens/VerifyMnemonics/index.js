/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { isEqual } from 'lodash';

import GradientContainer from '@src/components/organisms/SymbolGradientContainer';
import GradientButton from '@src/components/atoms/GradientButton';
import translate from '@src/locales/i18n';
import styles from './VerifyMnemonics.styl';
import Card from '@src/components/atoms/Card';
import TitleBar from '@src/components/atoms/TitleBar';
import { Router } from '@src/Router';
import store from '@src/store';
import { createPasscode } from '@src/utils/passcode';

const testIDs = {
    listItemVerifiedMnemonics: 'list-item-mnemonic',
    listItemUnverifiedMnemonics: 'list-item-unverfied-mnemonic',
    submitButton: 'button-submit',
    textErrorPassPhrase: 'error-passphrase-order',
    textSuccessPassPhrase: 'success-passphrase-order',
};

type PassPhraseItem = {
    key: string,
    id: string,
};

class VerifyMnemonics extends Component {
    constructor(props) {
        super(props);

        const mnemonics = store.getState().wallet.mnemonic;
        const originalPassPhrase = mnemonics.split(' ').map((item, index) => ({ key: item, id: index }));
        const mnemonicPassPhrase = mnemonics.split(' ').map((item, index) => ({ key: item, id: index }));
        const sortedMnemonics = mnemonicPassPhrase.sort((a, b) => a.key.localeCompare(b.key));
        this.state = {
            mnemonics: originalPassPhrase,
            unverifiedMnemonics: sortedMnemonics,
            verifiedMnemonics: [],
            isInvalidOrder: false,
        };
    }

    handleSubmit = async () => {
        const { isBackup } = this.props;
        if (isBackup) {
            Router.goToDashboard({});
        } else {
            createPasscode(this.props.componentId);
        }
    };

    isValidPassphrase = () => {
        const { isInvalidOrder, mnemonics, verifiedMnemonics } = this.state;
        return !isInvalidOrder && mnemonics.length === verifiedMnemonics.length;
    };

    isInvalidPassphrase = () => {
        return !this.isValidPassphrase();
    };

    addItemUnverifiedMnemonic = (newItem, deleteFrom) => {
        const { mnemonics, verifiedMnemonics } = this.state;
        const concatedMnemonics = verifiedMnemonics.concat(newItem);

        this.setState({
            isInvalidOrder: !isEqual(concatedMnemonics, mnemonics.slice(0, concatedMnemonics.length)),
            unverifiedMnemonics: deleteFrom.filter(i => i.id !== newItem.id).sort((x, y) => x.key > y.key),
            verifiedMnemonics: verifiedMnemonics.concat(newItem),
        });
    };

    addItemVerifiedMnemonic = (newItem, deleteFrom) => {
        const { mnemonics } = this.state;
        const { unverifiedMnemonics } = this.state;
        const removedMnemonics = deleteFrom.filter(i => i.id !== newItem.id).map(item => item);

        this.setState({
            isInvalidOrder: !isEqual(removedMnemonics, mnemonics.slice(0, removedMnemonics.length)),
            verifiedMnemonics: deleteFrom.filter(i => i.id !== newItem.id),
            unverifiedMnemonics: unverifiedMnemonics.concat(newItem).sort((x, y) => x.key > y.key),
        });
    };

    renderVerifiedMnemonicItem = () => {
        const { verifiedMnemonics } = this.state;
        // $FlowFixMe
        return verifiedMnemonics.map((item: PassPhraseItem) => (
            <TouchableOpacity
                testID={item.key}
                style={styles.orderedChip}
                onPress={() => this.addItemVerifiedMnemonic(item, verifiedMnemonics)}
                key={item.id}
            >
                <Text style={styles.orderedChipText}>{item.key}</Text>
            </TouchableOpacity>
        ));
    };

    renderUnverifiedMnemonicItem = () => {
        const { unverifiedMnemonics } = this.state;
        // $FlowFixMe
        return unverifiedMnemonics.map((item: PassPhraseItem) => (
            <TouchableOpacity
                testID={item.key}
                style={styles.unorderedChip}
                onPress={() => this.addItemUnverifiedMnemonic(item, unverifiedMnemonics)}
                key={item.id}
            >
                <Text style={styles.unorderedChipText}>{item.key}</Text>
            </TouchableOpacity>
        ));
    };

    renderMnemonicNoteText = () => {
        return <Text style={styles.textContent}>{translate('CreateWallet.VerifyMnemonics.description')}</Text>;
    };

    keyExtractor = item => item.id;

    render() {
        const { isInvalidOrder } = this.state;
        return (
            <GradientContainer start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} angle={135} useAngle style={styles.gradientContainer}>
                <TitleBar
                    title={translate('CreateWallet.VerifyMnemonics.title')}
                    theme="dark"
                    showBack
                    onBack={() => Router.goBack(this.props.componentId)}
                />
                <ScrollView>
                    <View style={styles.contentContainer}>
                        {this.renderMnemonicNoteText()}
                        <Card style={styles.orderedMnemonicsCard}>
                            <View style={styles.orderedMnemonicsContent}>
                                <View style={styles.orderedMnemonics} testID={testIDs.listItemVerifiedMnemonics}>
                                    {this.renderVerifiedMnemonicItem()}
                                </View>

                                {this.isValidPassphrase() ? (
                                    <Text testID={testIDs.textSuccessPassPhrase} style={styles.success}>
                                        {translate('CreateWallet.VerifyMnemonics.success.passphraseOrder')}
                                    </Text>
                                ) : null}
                                {isInvalidOrder ? (
                                    <Text testID={testIDs.textErrorPassPhrase} style={styles.error}>
                                        {translate('CreateWallet.VerifyMnemonics.error.passphraseOrder')}
                                    </Text>
                                ) : null}
                            </View>
                        </Card>

                        <View style={styles.unorderedMnemonics} testID={testIDs.listItemUnverifiedMnemonics}>
                            {this.renderUnverifiedMnemonicItem()}
                        </View>
                        <GradientButton
                            testID={testIDs.submitButton}
                            title={translate('CreateWallet.VerifyMnemonics.submitButton.title')}
                            disabled={this.isInvalidPassphrase()}
                            onPress={this.handleSubmit}
                            style={styles.button}
                        />
                    </View>
                </ScrollView>
            </GradientContainer>
        );
    }
}

export { testIDs };

export default VerifyMnemonics;
