/**
 * @format
 * @flow
 */
import { Dimensions, Platform, StatusBar } from 'react-native';

const getWindowDimensions = () => {
  return Dimensions.get('window');
};

const isIphoneX = () => {
  const dimen = getWindowDimensions();

  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 || dimen.width === 812 || dimen.height === 896 || dimen.width === 896)
  );
};

const getStatusBarHeight = (safe: boolean = true) => {
  return Platform.select({
    ios: isIphoneX() ? (safe ? 44 : 30) : 20,
    android: StatusBar.currentHeight,
    default: 0,
  });
};

const getBottomSpace = () => {
  return isIphoneX() ? 34 : 0;
};

const responsiveFontValue = (fontSize: number, standardScreenHeight: number = 680) => {
  const { height, width } = Dimensions.get('window');
  const standardLength = width > height ? width : height;
  const offset = width > height ? 0 : getStatusBarHeight(); // iPhone X style SafeAreaView size in portrait

  const deviceHeight =
    isIphoneX() || Platform.OS === 'android' ? standardLength - offset : standardLength;
  const heightPercent = (fontSize * deviceHeight) / standardScreenHeight;

  return Math.round(heightPercent);
};

export { isIphoneX, getWindowDimensions, getStatusBarHeight, getBottomSpace, responsiveFontValue };
