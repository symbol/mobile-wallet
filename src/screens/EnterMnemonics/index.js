/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';

import * as bip39 from 'bip39';
import * as _ from 'lodash';

import styles from './EnterMnemonics.styl';
import GradientContainer from '@src/components/organisms/SymbolGradientContainer';
import translate from '@src/locales/i18n';
import Warning from '@src/components/atoms/Warning';
import GradientButton from '@src/components/atoms/GradientButton';
import { Router } from '@src/Router';
import TitleBar from '@src/components/atoms/TitleBar';
import Card from '@src/components/atoms/Card';
import store from '@src/store';

const INITIAL_TEXT = ' ';
const DEFAULT_LANGUAGE = 'english';
const Space = ' ';

class EnterMnemonics extends Component {
    maxMnemonicsAllowed: number = 24;

    constructor(props: Props) {
        super(props);
        const language = props.language in bip39.wordlists ? props.language : DEFAULT_LANGUAGE;
        const wordlist = bip39.wordlists[language];
        this.state = {
            mnemonics: [],
            suggestions: [],
            text: ' ',
            wordlist: wordlist,
            validMnemonic: true,
            showWarning: false,
            reset: false,
        };
    }

    onKeyPress = (event: { nativeEvent: { key: string } }) => {
        const {
            nativeEvent: { key },
        } = event;
        if (key !== 'Backspace' && key !== ' ') {
            return;
        }
        if (key === ' ') {
            const { text } = this.state;
            // eslint-disable-next-line no-unused-expressions
            text.toLowerCase().trim().length > 1 && this.validateAndAddToMnemonics(text.toLowerCase().trim());
            return;
        }
        // $FlowFixMe
        this.setState({ validMnemonic: true });
    };

    // $FlowFixMe
    onChange = ({ nativeEvent: { text } }) => {
        const { wordlist, mnemonics, reset } = this.state;
        let changeText = text;
        let isReset = reset;

        const suggestions = _.filter(wordlist, w => {
            return w.startsWith(changeText.toLowerCase().trimStart());
        });
        // handle paste events
        const mnemonicsList = changeText
            .toLowerCase()
            .trim()
            .split(Space);
        if (mnemonicsList.length > 1) {
            mnemonicsList.forEach(this.validateAndAddToMnemonics);
            changeText = INITIAL_TEXT; // to reset input field
        }

        // reset input text on successful mnemonic validation,
        // This will fix ios input value carryforward issue.
        if (Platform.OS === 'ios' && isReset) {
            changeText = INITIAL_TEXT; // to reset input field
            isReset = false;
        }

        // refill textfield with the last mnemonic in the mnemonic list
        // or fill it with a whitespace to emulate backspace event
        if (text.length === 0) {
            changeText = this.removeMnemonic();
        }

        this.setState({
            suggestions: suggestions.length < 10 ? suggestions : [],
            text: changeText,
            reset: isReset,
        });
    };

    removeMnemonic = () => {
        const { mnemonics } = this.state;
        const mnemonic = mnemonics.pop() || '';
        return INITIAL_TEXT + mnemonic;
    };

    suggestionOnClick = (e: Array<any>) => {
        const { suggestions, mnemonics } = this.state;
        // $FlowFixMe
        const mnemonic = suggestions.splice(e.index, 1);
        this.validateAndAddToMnemonics(mnemonic[0]);
        // $FlowFixMe
        const { validMnemonic } = this.state;
        if (validMnemonic) {
            this.setState({
                suggestions: [],
                mnemonics: mnemonics,
                reset: false,
            });
        }
    };

    // $FlowFixMe
    validateAndAddToMnemonics = mnemonic => {
        const { wordlist, mnemonics } = this.state;
        if (wordlist.includes(mnemonic)) {
            mnemonics.push(mnemonic);
            // $FlowFixMe
            this.setState({
                mnemonics: mnemonics,
                text: INITIAL_TEXT,
                reset: true,
                validMnemonic: true,
            });
        } else {
            // $FlowFixMe
            this.setState({
                validMnemonic: false,
            });
        }
    };

    // $FlowFixMe
    mnemonicOnClick = e => {
        const { mnemonics } = this.state;
        mnemonics.splice(e.index, 1);
        this.setState({
            mnemonics,
        });
    };

    // $FlowFixMe
    renderMnemonicItem = (item, props) => {
        const { viewType } = props;
        const itemStyle = viewType === 'chip' ? styles.suggestionChip : styles.orderedChip;
        const itemTextStyle = viewType === 'chip' ? styles.suggestionChipText : styles.orderedChipText;
        return (
            // $FlowFixMe
            <TouchableOpacity style={itemStyle} {...props}>
                <Text style={itemTextStyle}>{item}</Text>
            </TouchableOpacity>
        );
    };

    onPress = () => {
        const { mnemonics } = this.state;
        const isValid = bip39.validateMnemonic(mnemonics.join(Space));
        if (!isValid) {
            this.setState({ showWarning: true });
        } else {
            this.createWallet();
        }
    };

    createWallet = async () => {
        const { mnemonics } = this.state;
        store.dispatch({ type: 'wallet/setName', payload: 'Imported wallet' });
        store.dispatch({ type: 'wallet/setMnemonic', payload: mnemonics.join(' ') });
        Router.goToWalletLoading({}, this.props.componentId);
        // Router go to pre-dashboard
    };

    forceCreate = async () => {
        this.setState({ showWarning: false });
        this.createWallet();
    };

    hideWarning = () => {
        this.setState({ showWarning: false });
    };

    render() {
        // $FlowFixMe
        const { mnemonics, suggestions, validMnemonic, text, showWarning } = this.state;
        const mnemonicsContainerStyle = mnemonics.length < this.maxMnemonicsAllowed ? styles.orderedMnemonics : styles.orderedMnemonicsFinal;
        return (
            <GradientContainer start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} angle={135} useAngle style={styles.gradientContainer}>
                <TitleBar title={translate('ImportWallet.EnterMnemonics.title')} theme="dark" showBack onBack={() => Router.goBack(this.props.componentId)} />
                {showWarning && (
                    <Warning
                        hideWarning={this.hideWarning}
                        onIgnore={this.forceCreate}
                        message={translate('ImportWallet.EnterMnemonics.error.invalidMnemonics')}
                        okButtonText={translate('ImportWallet.EnterMnemonics.ignoreWarning')}
                    />
                )}

                <View style={styles.contentContainer}>
                    <Text style={styles.textContent}>{translate('ImportWallet.EnterMnemonics.content')}</Text>
                    <Card style={styles.orderedMnemonicsCard}>
                        <ScrollView style={styles.orderedMnemonicsScrollView}>
                            <View style={mnemonicsContainerStyle}>
                                {mnemonics.map((item, index) => {
                                    const key = `mnemonics-${index.toString()}`;
                                    const testid = `mnemonic-${item}`;
                                    return this.renderMnemonicItem(item, {
                                        viewType: 'chip',
                                        key: key,
                                        testID: testid,
                                        onPress: () => {
                                            this.mnemonicOnClick({ item, index });
                                        },
                                    });
                                })}
                                {mnemonics.length < this.maxMnemonicsAllowed && (
                                    // $FlowFixMe
                                    <TextInput
                                        testID="textInput"
                                        value={text}
                                        style={styles.textinput}
                                        onChange={this.onChange}
                                        onKeyPress={this.onKeyPress}
                                        autoCompleteType="off"
                                        autoCorrect={false}
                                        autoFocus
                                        autoCapitalize="none"
                                    />
                                )}
                            </View>
                        </ScrollView>
                    </Card>
                    <View style={styles.mnemonicSuggestion}>
                        {suggestions.map((item, index) => {
                            const key = `suggestions-${index.toString()}`;
                            const testid = `suggestion-${item}`;
                            return this.renderMnemonicItem(item, {
                                viewType: 'chip',
                                key: key,
                                testID: testid,
                                onPress: () => {
                                    // $FlowFixMe
                                    this.suggestionOnClick({ item, index });
                                },
                            });
                        })}
                    </View>
                    {!validMnemonic ? (
                        <Text testID="invalidMnemonic" style={styles.error}>
                            {translate('ImportWallet.EnterMnemonics.error.invalidMnemonic')}
                        </Text>
                    ) : null}
                    <GradientButton testID="submit" title={translate('ImportWallet.EnterMnemonics.button')} style={styles.button} onPress={this.onPress} />
                </View>
            </GradientContainer>
        );
    }
}

export default EnterMnemonics;
