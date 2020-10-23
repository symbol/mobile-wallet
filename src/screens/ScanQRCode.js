/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { View, Text } from 'react-native';
import translate from "@src/locales/i18n";
import QRScanner from "@src/components/atoms/QRScanner";
import {Router} from "@src/Router";

type State = {
  showWarning: boolean,
};

const testIDs = {
  qrContainer: 'QR-scanner',
  bottomView: 'QR-bottom-view',
  invalidQR: 'invalid-qr',
};
export { testIDs };

class ScanQRCode extends Component<Props, State> {
  static defaultProps = {
    cameraFadeIn: true,
    errorTitle: translate('ImportWallet.ShowQRCode.errorTitle'),
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      showWarning: false,
    };
  }

  onRead = (res: any) => {
    if (typeof res === 'object' && res !== null && res.data) {
      let parsedPlainQR: any = null;
      try {
        parsedPlainQR = JSON.parse(res.data);
      } catch (e) {}
      if (parsedPlainQR && parsedPlainQR.data && parsedPlainQR.data.plainMnemonic) {
        this.props.setName('Imported wallet');
        this.props.setMnemonic(parsedPlainQR.data.plainMnemonic);
      } else {
        // save encrypted mnemonic
        // Router.goToEnterPassword()
      }
    } else {
      this.setState({ showWarning: true });
    }
  };

  onCloseQR = () => {
    Router.goBack(this.props.componentId);
  };

  render() {
    const { errorTitle } = this.props;
    const { showWarning } = this.state;
    if (showWarning) {
      return (
        <View testID={testIDs.invalidQR}>
          <Text>{errorTitle}</Text>
        </View>
      );
    }
    else {
      return (
          <QRScanner onDataHandler={this.onRead} closeFn={this.onCloseQR}/>
      );
    }
  }
}

export default ScanQRCode;
