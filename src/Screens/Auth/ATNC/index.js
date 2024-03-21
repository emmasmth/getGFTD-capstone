
import React from 'react'
import { View, StyleSheet, StatusBar, Platform, } from 'react-native';


// Contants----------------------------------------------------------------
import AppHeader from '../../../Constants/Header';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import WebView from 'react-native-webview';

// Utils----------------------------------------------------------------
import { Colors } from '../../../Utils';
import { Icons } from '../../../Assets';



export default function ATNC({ navigation }) {

    return (
        <>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightBlue} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightBlue }} />
            <View style={styles.container}>
                <AppHeader onPressed={() => navigation.pop()} leftIcon={Icons.backarrow} text="TERMS AND CONDITIONS" />
                <WebView
                    style={{ flex: 1 }}
                    source={{ uri: 'https://getgftd.io/terms-condition' }}
                />
            </View>
            <View>

            </View>
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    filterView: {
        width: "92%",
        alignSelf: "center",
        alignItems: "flex-end",
    },
    filterContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        width: wp(22),
    },
    filterIconStyle: {
        width: 18,
        height: 18,
        resizeMode: 'contain'
    },
    filterTextStyle: {
        color: Colors.Grey,
        fontSize: 18,
    },
})