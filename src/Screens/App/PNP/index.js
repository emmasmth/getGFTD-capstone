import React, { useContext } from 'react'
import { View, StyleSheet, StatusBar, Platform, } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import WebView from 'react-native-webview';

// Constants----------------------------------------------------------------
import AppHeader from '../../../Constants/Header';

// Utils----------------------------------------------------------------
import { Colors } from '../../../Utils';
import { Icons } from '../../../Assets';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { AuthContext } from '../../../Context';

export default function PNP({ navigation }) {
    const userDetails = useSelector(state => state.UserReducer);
    const apiToken =userDetails.api_token;
    const { trackData } = useContext(AuthContext);
useFocusEffect(()=>{
    if (!!apiToken) trackData(apiToken,'Page Viewed', 'Privacy Policy');
})
    return (
        <>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />
            <View style={styles.container}>
                <AppHeader onPressed={() => navigation.goBack()} leftIcon={Icons.backarrow} text="PRIVACY POLICY" />
                <WebView
                    source={{ uri: 'https://getgftd.io/privacy-policy' }}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },
});