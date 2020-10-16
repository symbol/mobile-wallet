import './shim';
import { AppState } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { startApp, handleAppStateChange } from './src/App';
import {Router} from "./src/Router";

// Register screens
Router.registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
  startApp();
  AppState.addEventListener('change', handleAppStateChange);
});
