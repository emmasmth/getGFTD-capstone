import React from 'react';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './src/Redux/store';
import messaging from '@react-native-firebase/messaging';

messaging().registerDeviceForRemoteMessages();
export default function Main() {
    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <App />
            </Provider>
        </SafeAreaProvider>

    );
};

AppRegistry.registerComponent(appName, () => Main);
