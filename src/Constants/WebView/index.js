import React from 'react'
import { View} from 'react-native';
import { WebView } from 'react-native-webview';
export default function WebViews() {
    return (
        <View>
            <WebView
                source={{ uri: 'https://getgftd.io/terms-condition' }}
                style={{ marginTop: 20 }}
            />
        </View>
    );
};