/**
 * @format
 * @flow
 */
import React, { Component } from 'react';
import { Image, View, Text, TouchableOpacity, BackHandler } from 'react-native';
import PINCode from '@haskkor/react-native-pincode';
import styles from './Passcode.styl';
import translate from '@src/locales/i18n';
import GradientContainer from '@src/components/organisms/SymbolGradientContainer';
import { AsyncCache } from '@src/utils/storage/AsyncCache';
import { deletePasscode, getPasscodeStatus } from '@src/utils/passcode';

type Props = {
    disablePasscode: boolean,
    enableTouchID: boolean,
    resetPasscode: boolean,
    onSuccess: () => void,
};
type State = {
    isPinSet: boolean,
    isTouchIDEnabled: boolean,
    isLoading: boolean,
};

class Passcode extends Component<Props, State> {
    backHandler: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            isPinSet: false,
            isLoading: true,
            isTouchIDEnabled: false,
        };
    }

    componentDidDisappear() {
        this.backHandler && this.backHandler.remove();
    }

    componentDidAppear() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleCancel);
    }

    componentDidMount = async () => {
        const { resetPasscode } = this.props;

        if (resetPasscode) {
            await deletePasscode();
        }

        const isPinSet = await getPasscodeStatus();
        const isTouchIDEnabled = isPinSet;

        this.setState({ isPinSet: isPinSet, isTouchIDEnabled: isTouchIDEnabled, isLoading: false });
    };

    handleCancel = async () => {
        const { onSuccess } = this.props;
        const { isPinSet } = this.state;
        if (!isPinSet) {
            await onSuccess();
            return true;
        }
        BackHandler.exitApp();
        return true;
    };

    finish = async () => {
        const { disablePasscode, enableTouchID, onSuccess } = this.props;

        if (disablePasscode) {
            await deletePasscode();
            this.updateSecurity('none', onSuccess);
            return;
        }

        const { isPinSet } = this.state;
        if (isPinSet) {
            onSuccess();
        } else {
            this.updateSecurity(enableTouchID ? 'biometrics' : 'passcode', onSuccess);
        }
    };

    updateSecurity = (securityMode: string, postLoginFunc: () => void) => {
        AsyncCache.setIsPasscodeSelected(securityMode !== 'none').then(_ => {
            postLoginFunc();
        });
    };

    renderCustomDeleteIcon = () => {
        return (
            <Image style={styles.iconDelete} source={require('@src/assets/icons/ic-delete.png')} />
        );
    };

    renderCustomCancel = () => {
        return (
            <TouchableOpacity onPress={this.handleCancel} style={styles.cancelText}>
                <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
        );
    };

    render() {
        const { isPinSet, isTouchIDEnabled, isLoading } = this.state;

        const type = isPinSet ? 'enter' : 'choose';

        return (
            <GradientContainer
                colors={['#44004e', '#44004e']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                angle={135}
                useAngle
                style={styles.gradientContainer}>
                {!isLoading && (
                    <React.Fragment>
                        <Image
                            style={styles.icon}
                            source={require('@src/assets/icons/lock.png')}
                        />

                        <PINCode
                            status={type}
                            titleChoose={translate('Settings.passcode.choose.title')}
                            titleConfirm={translate('Settings.passcode.choose.title')}
                            subtitleChoose={translate('Settings.passcode.choose.subtitle')}
                            titleEnter={
                                isTouchIDEnabled
                                    ? translate('Settings.passcode.enterBiometrics.title')
                                    : translate('Settings.passcode.enterPasscode.title')
                            }
                            subtitleConfirm={translate('Settings.passcode.choose.titleconfirm')}
                            titleAttemptFailed={translate('Settings.passcode.titleError')}
                            subtitleError={translate('Settings.passcode.subtitleError')}
                            maxAttempts={20}
                            stylePinCodeTextTitle={styles.title}
                            stylePinCodeTextSubtitle={styles.subtitle}
                            stylePinCodeColorTitle="#ffffff"
                            stylePinCodeColorTitleError="#ff9600"
                            stylePinCodeColorSubtitle="#ff00ff"
                            stylePinCodeColorSubtitleError="#ff9600"
                            stylePinCodeMainContainer={styles.stylePinCodeMainContainer}
                            stylePinCodeColumnButtons={styles.stylePinCodeColumnButtons}
                            stylePinCodeButtonNumber="#ffffff"
                            styleMainContainer={styles.styleMainContainer}
                            stylePinCodeChooseContainer={styles.stylePinCodeChooseContainer}
                            stylePinCodeEnterContainer={styles.stylePinCodeChooseContainer}
                            stylePinCodeRowButtons={styles.stylePinCodeRowButtons}
                            stylePinCodeTextButtonCircle={styles.numberButtonText}
                            stylePinCodeButtonCircle={styles.stylePinCodeButtonCircle}
                            stylePinCodeEmptyColumn={styles.stylePinCodeEmptyColumn}
                            stylePinCodeColumnDeleteButton={styles.stylePinCodeColumnDeleteButton}
                            buttonComponentLockedPage={() => null}
                            iconComponentLockedPage={() => null}
                            numbersButtonOverlayColor="#5200c633"
                            colorCircleButtons="transparent"
                            colorPassword="#ff00ff"
                            buttonDeleteText="Delete"
                            customBackSpaceIcon={this.renderCustomDeleteIcon}
                            bottomLeftComponent={!isPinSet && this.renderCustomCancel()}
                            finishProcess={() => this.finish()}
                            touchIDDisabled={!isTouchIDEnabled}
                        />
                    </React.Fragment>
                )}
            </GradientContainer>
        );
    }
}

export default Passcode;
