/**
 * @format
 */

// IMPORTANT: react-native-gesture-handler must be imported FIRST
import 'react-native-gesture-handler';

import { AppRegistry, I18nManager } from 'react-native';

// Enable RTL support - direction will be set dynamically by LanguageContext
try {
    I18nManager.allowRTL(true);
    // Don't force RTL here - let LanguageContext handle it based on selected language
} catch (e) {
    console.warn('Failed to configure RTL:', e);
}

import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
