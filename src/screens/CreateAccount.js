import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown, Section, GradientBackground, TitleBar, Input, InputAddress, Text, Button } from '@src/components';
import { Router } from '@src/Router';
import store from '@src/store';
import { isPrivateKeyValid } from '@src/utils/account';
import RadioForm from 'react-native-simple-radio-button';
import { AccountQR, ContactQR } from 'symbol-qr-library';
import PopupModal from '@src/components/molecules/PopupModal';
import PasswordModal from '@src/components/molecules/PasswordModal';
import translate from "@src/locales/i18n";
import { connect } from 'react-redux';
import GlobalStyles from '@src/styles/GlobalStyles';
import { showMessage } from 'react-native-flash-message';

const styles = StyleSheet.create({
	warning: {
		color: GlobalStyles.color.RED
	}
});

class CreateAccount extends Component {
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
		isNameAlreadyExists: false,
		isPrivateKeyAlreadyExists: false
    };

    goBack = () => {
        Router.goBack(this.props.componentId);
    };

    handleNameChange = val => {
        this.setState({ name: val, isNameValid: val.length > 0 });
		this.checkNameIsAvailable(val);
	};

    handlePkChange = val => {
		this.setState({ privateKey: val, isPkValid: isPrivateKeyValid(val) });
		this.checkPrivateKeyIsNotImported(val);
    };

    handleIndexChange = val => {
        const parsedVal = parseInt(val);
        this.setState({ index: parsedVal, isIndexValid: val === '' || (!isNaN(parsedVal) && parsedVal >= 0) });
	};

	checkPrivateKeyIsNotImported = (val) => {
		const { accounts } = this.props;
		const { privateKey } = this.state;
		const _privateKey = val || privateKey;

		this.setState({isPrivateKeyAlreadyExists: !!accounts.find(account => account.privateKey === _privateKey)});
	};

	checkNameIsAvailable = (val) => {
		const { accounts } = this.props;
		const { name } = this.state;
		const _name = val || name;

		this.setState({isNameAlreadyExists: !!accounts.find(account => account.name === _name)});
	};

    createSeedAccount = async () => {
		this.setState({ loading: true });
		
		const { name, index } = this.state;
		await store.dispatchAction({ type: 'wallet/createHdAccount', payload: { index, name } });
		this.goBack();
		
        this.setState({ loading: false });
    };

    createPrivateKeyAccount = async () => {
        this.setState({ loading: true });
		
		const { name, privateKey } = this.state;
		await store.dispatchAction({ type: 'wallet/createPkAccount', payload: { privateKey, name } });
		this.goBack();
		
		this.setState({ loading: false });
    };

    onDecryptQR = async password => {
        const { scannedAccountQR } = this.state;
        try {
            const decrypted = new AccountQR.fromJSON(scannedAccountQR, password);
            await this.setState({ privateKey: decrypted.accountPrivateKey });
            return this.createPrivateKeyAccount();
        } catch {
            this.setState({ error: 'Invalid password provided' });
        }
    };

    onReadQRCode = async res => {
        try {
            const accountQR = AccountQR.fromJSON(res.data);
            await this.handlePkChange(accountQR.accountPrivateKey);
            //return this.createPrivateKeyAccount();
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
		const { name, 
			privateKey, 
			index, 
			isIndexValid, 
			isPkValid, 
			isNameValid, 
			loading, 
			importMethod, 
			showDecryptModal, 
			error, 
			isNameAlreadyExists, 
			isPrivateKeyAlreadyExists 
		} = this.state;

        return (
            <GradientBackground dataManager={{ isLoading: loading }} name="mesh_small_2" theme="light">
                <TitleBar theme="light" onBack={() => this.goBack()} title={translate('createAccount.title')} />
                <Section type="form" style={styles.list} isScrollable>
                    <Section type="form-item">
                        <Input value={name} placeholder={translate('createAccount.name')} theme="light" fullWidth onChangeText={val => this.handleNameChange(val)} />
						{isNameAlreadyExists && <Text theme="light" style={styles.warning}>{translate('createAccount.errorAccountNameExist')}</Text>}
					</Section>
					<Section type="form-item">
						<Dropdown
							theme="light"
							title={translate('createAccount.type')}
                            placeholder="Select"
							list={[
								{ label: translate('createAccount.fromSeed') , value: 0 },
								{ label: translate('createAccount.fromPk'), value: 1 },
							]}
							value={importMethod}
							onChange={value => {
								this.setState({ importMethod: value });
							}}
						/>
					</Section>
                    {importMethod === 0 && (
						<Section type="form-item">
							<Input
								value={index}
								placeholder={translate('createAccount.seed')}
								theme="light"
								fullWidth
								onChangeText={val => this.handleIndexChange(val)}
							/>
						</Section>
                    )}
					{importMethod === 0 && <Section type="form-bottom">
						<Button
							text={translate('createAccount.createSeed')}
							theme="light"
							disabled={!isNameValid || isNameAlreadyExists || !isIndexValid}
							onPress={() => this.createSeedAccount()}
							loading={loading}
						/>
					</Section>}
                    {importMethod === 1 &&
                        <>
                            <Section type="form-item">
								<InputAddress 
									value={privateKey} 
									placeholder="Private Key" 
									theme="light" 
									fullWidth 
									qrType="privateKey"
									showAddressBook={false}
									onChangeText={val => this.handlePkChange(val)} 
								/>
									{isPrivateKeyAlreadyExists && <Text theme="light" style={styles.warning}>{translate('createAccount.errorPrivateKeyExist')}</Text>}
									{!isPkValid && privateKey.length > 0 && <Text theme="light" style={styles.warning}>{translate('createAccount.errorInvalidPrivateKey')}</Text>}
							</Section>
                            {!!error && <Section type="form-item">
                                <Text theme="light" type="alert">
                                    {error}
                                </Text>
                            </Section>}
						</>
					}
					{importMethod === 1 &&
						<Section type="form-bottom">
							<Button
								text={translate('createAccount.createPk')}
								theme="light"
								disabled={!isNameValid || isNameAlreadyExists || isPrivateKeyAlreadyExists || !isPkValid}
								loading={loading}
								onPress={() => this.createPrivateKeyAccount()}
							/>
						</Section>
                    }
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

export default connect(state => ({
    accounts: state.wallet.accounts,
}))(CreateAccount);
