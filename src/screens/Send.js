import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Checkbox, Section, GradientBackground, TitleBar, Input, InputAddress, Button, Dropdown, MosaicDropdown, Text } from '@src/components';
import ConfirmTransaction from '@src/screens/ConfirmTransaction';
import Store from '@src/store';
import _ from 'lodash';
import { Router } from '@src/Router';
import { connect } from 'react-redux';
import type { MosaicModel } from '@src/storage/models/MosaicModel';
import { isAddressValid } from '@src/utils/validators';
import { filterCurrencyMosaic } from '@src/utils/filter';
import { resoveAmount } from '@src/utils/format';
import GlobalStyles from '@src/styles/GlobalStyles';
import translate from "@src/locales/i18n";
import {defaultFeesConfig} from "@src/config/fees";
import {AccountHttp, Address} from "symbol-sdk";

const styles = StyleSheet.create({
    transactionPreview: {
        width: '100%',
        height: 60,
        borderRadius: 6,
        marginTop: 4,
        marginBottom: 4,
        padding: 17,
        paddingTop: 8,
        backgroundColor: '#fff5',
    },
    warning: {
		color: GlobalStyles.color.RED
	}
});

type Props = {};

type State = {};

class Send extends Component<Props, State> {
    state = {
        recipientAddress: '',
        mosaicName: this.props.network.currencyMosaicId,
        amount: '',
        message: '',
        isEncrypted: false,
        fee: defaultFeesConfig.normal,
        isConfirmShown: false,
        showAddressError: false,
        showAmountError: false,
        loadingEncrypted: false,
        isMaxFeeLoading: false,
        maxFeeList: {
            ...defaultFeesConfig,
            current: defaultFeesConfig.normal
        }
    };

    componentDidMount = async () => {
		Store.dispatchAction({ type: 'transfer/clear' });
		const { recipientAddress, amount, mosaicName, message } = this.props;
        let isMosaicPresent = true;

		if(recipientAddress)
			this.onAddressChange(recipientAddress);
		if(mosaicName)
            isMosaicPresent = await this.onMosaicChange(mosaicName);
		if(amount && isMosaicPresent)
			this.onAmountChange(amount);
		if(message)
			this.onMessageChange(message);

        this.updateMaxFee();
    };

    verify = () => {
        if (!this.state.recipientAddress.length) {
            console.error('Alert("Invalid recipient address")');
            return false;
        }
        if (+this.props.ownedMosaics.find(mosaic => mosaic.mosaicId === this.state.mosaicName).amount < +this.state.amount) {
            console.error('Alert("Invalid amount")');
            return false;
        }
        return true;
    };

    isFormValid = () => {
        const { recipientAddress } = this.state;
        const { network } = this.props;
        if (!isAddressValid(recipientAddress, network)) {
            return false;
        }
        return this.isAmountValid();
    };

    isAmountValid = () => {
        const { ownedMosaics, network } = this.props;
        const nativeMosaic = filterCurrencyMosaic(ownedMosaics, network);
        if (!nativeMosaic) {
            return false;
        }
        const selectedMosaic = ownedMosaics.find(mosaic => mosaic.mosaicId === this.state.mosaicName);
        const parsedAmount = resoveAmount(selectedMosaic.amount, selectedMosaic.divisibility);
        const sendingAmount = parseFloat(this.state.amount);
        const fee = parseFloat(this.state.fee);
        // Basic check amount not greater than what user has
        if (parsedAmount < sendingAmount) {
            return false;
        }
        // Fee check
        if (nativeMosaic.amount < fee) {
            return false;
        }
        // Case sending same mosaic than currency mosaic
    
        return !(selectedMosaic.mosaicId === network.currencyMosaicId && parsedAmount <= sendingAmount + this.state.maxFeeList.current);
    };

    updateMaxFee = async () => {
        const { network } = this.props;
        this.setState({
            isMaxFeeLoading: true
        });
        setTimeout(async () => {
            const defaultMaxFees = await Promise.all([
                ...Object.keys({...defaultFeesConfig, current: this.state.fee})
                    .map(async key => 
                        [
                            key, 
                            resoveAmount(await Store.dispatchAction({
                                type: 'transfer/getMaxFee',
                                payload: this.prepareTansaction(defaultFeesConfig[key]),
                            }), network.currencyDivisibility)
                        ]
                    )
            ]);
    
            const maxFeeList = Object.fromEntries(defaultMaxFees)

            this.setState({
                isMaxFeeLoading: false,
                maxFeeList
            });
            this.verifyAmount();
        });
    };

    prepareTansaction = (fee) => {
        const { ownedMosaics } = this.props;
        const mosaic: MosaicModel = _.cloneDeep(ownedMosaics.find(mosaic => mosaic.mosaicId === this.state.mosaicName));
        mosaic.amount = parseFloat(this.state.amount || '0') * Math.pow(10, mosaic.divisibility);

        return {
            recipientAddress: this.state.recipientAddress,
            mosaics: [mosaic],
            message: this.state.message,
            messageEncrypted: this.state.isEncrypted,
            fee: fee || this.state.fee,
        };
    };

    submit = async () => {
        this.setState({
            isLoading: true
        });

        setTimeout(async () => {
            await Store.dispatchAction({
                type: 'transfer/setTransaction',
                payload: this.prepareTansaction()
            });
    
            this.setState({
                isConfirmShown: true,
                isLoading: false,
            });
        });
    };

    showSendForm = () => {
        this.setState({
            isConfirmShown: false,
        });
    };

    renderConfirmTransaction = () => {
        return (
            <ConfirmTransaction
                componentId={this.props.componentId}
                isLoading={this.props.isLoading}
                isError={this.props.isError}
                errorMessage={this.props.errorMessage}
                isSuccessfullySent={this.props.isSuccessfullySent}
                transaction={this.props.transaction}
                submitActionName="transfer/broadcastTransaction"
                onBack={() => this.showSendForm()}
            />
        );
    };

    onAddressChange = recipientAddress => {
        const { network } = this.props;
        const showAddressError = !isAddressValid(recipientAddress, network);
        this.setState({ recipientAddress, showAddressError, isEncrypted: false });
    };

    onAmountChange = async val => {
        const standardComma = val.replace(/,/, '.');
        let [integer, decimal] = standardComma.split('.');
        const { ownedMosaics } = this.props;
        const selectedMosaic = ownedMosaics.find(mosaic => mosaic.mosaicId === this.state.mosaicName);
        if (decimal) {
            decimal = decimal.slice(0, selectedMosaic.divisibility);
        }
        if (integer === '' && decimal) {
            integer = '0';
        }
        let final = '' + Math.abs(parseInt(integer)) + (decimal ? '.' + decimal : '');
        if (standardComma.endsWith('.') && !decimal) {
            final = final + '.';
        }

        const invalidNumber = Number.isNaN(parseFloat(final));

        if(invalidNumber) {
            await this.setState({ amount: '0' });
        }
        else {
            await this.setState({ amount: '' + final });
        }

        
        this.updateMaxFee();
        this.verifyAmount();
    };

    verifyAmount = () => {
        const showAmountError = !this.isAmountValid();
        this.setState({ showAmountError });
    };

    onMosaicChange = async mosaicName => {
        const { ownedMosaics } = this.props;

        if(!ownedMosaics.find(mosaic => mosaic.mosaicId === mosaicName)) {
            Router.showMessage({
                message: translate('notification.noMosaicPresent', { mosaicName }), 
                type: 'danger'
            });
            return false;
        }

        await this.setState({ mosaicName });
        const { amount } = this.state;
        this.onAmountChange('' + amount);

        return true;
    };

    onMessageChange = async message => {
        let { isEncrypted } = this.state;
        if (message.length === 0) {
            isEncrypted = false;
        }
        if (message.length > 1024) {
            message.slice(0, 1024);
        }
        await this.setState({ message, isEncrypted });
        this.updateMaxFee();
    };

    onMessageEncryptedChange = async isEncrypted => {
        if (isEncrypted) {
            const {network} = this.props;
            const {recipientAddress} = this.state;
            this.setState({loadingEncrypted: true});
            let accountInfo;
            try {
                accountInfo = await new AccountHttp(network.node).getAccountInfo(Address.createFromRawAddress(recipientAddress)).toPromise();
            } catch (e) {}
            this.setState({loadingEncrypted: false});
            if (!accountInfo || !accountInfo.publicKey) {
                Router.showMessage({
                    message: translate('unsortedKeys.noPublicKeyWarning'),
                    type: 'warning'
                });
                this.setState({isEncrypted: false});
            } else {
                this.setState({isEncrypted: true});
            }
        } else {
            this.setState({isEncrypted: false});
        }

        this.updateMaxFee();
    };

    onFeeChange(fee) {
        this.setState({ fee });
        this.updateMaxFee();
    };

    render = () => {
        const { 
            ownedMosaics, 
            isOwnedMosaicsLoading, 
            network 
        } = this.props;
        const { 
            recipientAddress, 
            mosaicName, 
            amount, 
            message, 
            isEncrypted,
            isMaxFeeLoading,
            maxFeeList,
            fee, 
            isConfirmShown, 
            showAddressError, 
            showAmountError, 
            loadingEncrypted 
        } = this.state;
        const mosaicList = ownedMosaics
            .filter(mosaic => !mosaic.expired)
            .map(mosaic => ({
                value: mosaic.mosaicId,
                label: mosaic.mosaicName,
                balance: resoveAmount(mosaic.amount, mosaic.divisibility),
            }));
        
        const feeList = [
            { value: defaultFeesConfig.slow, label: translate('fees.slow') + ' - ' + maxFeeList.slow },
            { value: defaultFeesConfig.normal, label: translate('fees.recommended') + ' - ' + maxFeeList.normal },
            { value: defaultFeesConfig.fast, label: translate('fees.fast') + ' - ' + maxFeeList.fast },
        ];

        const validForm = this.isFormValid();

        return isConfirmShown ? (
            this.renderConfirmTransaction()
        ) : (
            <GradientBackground name="mesh_small_2" theme="light">
                <TitleBar theme="light" onBack={() => Router.goBack(this.props.componentId)} title="Send" />
                <Section type="form" style={styles.list} isScrollable>
                    <Section type="form-item">
                        <InputAddress
                            value={recipientAddress}
                            placeholder={translate('table.recipientAddress')}
                            theme="light"
                            fullWidth
                            onChangeText={val => this.onAddressChange(val)}
                        />
                        {showAddressError && <Text theme="light" style={styles.warning}>Invalid address</Text>}
                    </Section>
                    <Section type="form-item">
                        <MosaicDropdown
                            value={mosaicName}
                            title={translate('table.mosaic')}
                            theme="light"
                            editable={true}
                            isLoading={isOwnedMosaicsLoading}
                            list={mosaicList}
                            onChange={mosaicName => this.onMosaicChange(mosaicName)}
                        />
                    </Section>
                    <Section type="form-item">
                        <Input
                            value={amount}
                            keyboardType="decimal-pad"
                            nativePlaceholder="0"
                            placeholder={translate('table.amount')}
                            theme="light"
                            onChangeText={amount => this.onAmountChange(amount)}
                        />
                        {amount.length > 0 && showAmountError && <Text theme="light" style={styles.warning}>Not enough funds</Text>}
                    </Section>
                    <Section type="form-item">
                        <Input value={message} placeholder={translate('table.messageText')} theme="light" onChangeText={message => this.onMessageChange(message)} />
                    </Section>
                    <Section type="form-item">
                        <Checkbox
                            loading={loadingEncrypted}
                            disabled={message.length === 0}
                            value={isEncrypted}
                            title={translate('table.encrypted')}
                            theme="light"
                            onChange={isEncrypted => this.onMessageEncryptedChange(isEncrypted)}
                        />
                    </Section>
                    <Section type="form-item">
                        <Dropdown 
                            isLoading={isMaxFeeLoading}
                            value={fee} 
                            title={translate('table.fee')} 
                            theme="light" 
                            editable={true} 
                            list={feeList} 
                            onChange={fee => this.onFeeChange(fee)} 
                        />
                    </Section>
                    <Section type="form-bottom">
                        <Button isLoading={false} isDisabled={!validForm} text={translate('plugin.send')} theme="light" onPress={() => this.submit()} />
                    </Section>
                </Section>
            </GradientBackground>
        );
    };
}

export default connect(state => ({
    isLoading: state.transfer.isLoading,
    isError: state.transfer.isError,
    errorMessage: state.transfer.errorMessage,
    isSuccessfullySent: state.transfer.isSuccessfullySent,
    transaction: state.transfer.transaction,
    network: state.network.selectedNetwork,
    ownedMosaics: state.account.ownedMosaics,
    isOwnedMosaicsLoading: state.account.isLoading,
}))(Send);
