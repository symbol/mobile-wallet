/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';
import GradientContainer from '@src/components/organisms/SymbolGradientContainer';
import GradientButton from '@src/components/atoms/GradientButton';
import styles from './ShowMnemonics.styl';
import Card from '@src/components/atoms/Card';
import TitleBar from '@src/components/atoms/TitleBar';
import translate from '@src/locales/i18n';
import { Router } from '@src/Router';
import store from '@src/store';

const testIDs = {
    listItem: 'list-item-mnemonic',
    submitButton: 'button-submit',
};

type PassPhraseItem = {
    key: string,
    id: string,
};

class ShowMnemonics extends Component {
    handleSubmit = () => {
        const { isBackup } = this.props;
        Router.goToVerifyMnemonics({ isBackup }, this.props.componentId);
    };

    renderOrderedMnemonicItem = () => {
        const mnemonic = store.getState().wallet.mnemonic;
        // const mnemonicArray = mnemonic.split(' ');
        const mnemonicPassPhrase = mnemonic
            .split(' ')
            .map((item, index) => ({ key: item, id: index }));

        return mnemonicPassPhrase.map((item: PassPhraseItem) => (
            <View style={styles.orderedChip} key={item.id}>
                <Text testID={testIDs.listItem} style={styles.orderedChipText}>
                    {item.key}
                </Text>
            </View>
        ));
    };

    render() {
        return (
            <GradientContainer
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                angle={135}
                useAngle
                style={styles.gradientContainer}
            >
                <TitleBar
                    title={translate('CreateWallet.ShowMnemonics.title')}
                    theme="dark"
                    showBack
                    onBack={() => Router.goBack(this.props.componentId)}
                />
                <View style={styles.contentContainer}>
                    <Text style={styles.textContent}>
                        {translate('CreateWallet.ShowMnemonics.description')}
                    </Text>
                    <Card style={styles.orderedMnemonics}>
                        <ScrollView>
                            <View style={styles.mnemonicsListWrapper}>
                                {this.renderOrderedMnemonicItem()}
                            </View>
                        </ScrollView>
                    </Card>
                    <GradientButton
                        title={translate(
                            'CreateWallet.ShowMnemonics.submitButton'
                        )}
                        style={styles.button}
                        testID={testIDs.submitButton}
                        onPress={this.handleSubmit}
                    />
                </View>
            </GradientContainer>
        );
    }
}

export { testIDs };

export default ShowMnemonics;
