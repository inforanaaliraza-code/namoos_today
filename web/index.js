/**
 * Web entry point for React Native Web
 * Supports RTL/LTR direction based on language
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from '../App';

// Initialize with default LTR direction (English)
// Direction will be updated by LanguageContext when language changes
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('dir', 'ltr');
  document.documentElement.setAttribute('lang', 'en');
}

// Register the app
AppRegistry.registerComponent('Namos_App', () => App);

// Start the app
AppRegistry.runApplication('Namos_App', {
  initialProps: {},
  rootTag: document.getElementById('root'),
});

