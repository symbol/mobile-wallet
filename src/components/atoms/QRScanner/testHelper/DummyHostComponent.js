/**
 * @format
 * @flow
 */
type Props = {
  startScanner: (() => void) => any,
  QRHandler: () => void,
  enableScannerOnStart: boolean,
};
const DummyQRHostComponent = (props: Props) => {
  const { startScanner, QRHandler, enableScannerOnStart } = props;
  return enableScannerOnStart ? startScanner(QRHandler) : null;
};

export default DummyQRHostComponent;
