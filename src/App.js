import React, { useContext, useEffect, useState } from 'react';
import { Alert, AppState, Image, Linking, LogBox, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppContent from './Navigation/Routes';
import { Provider as PaperProvider } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import { notificationControllerAndroid, notificationControllerIos, notificationListener, } from './Helper/NotificationService';
import { useDispatch, useSelector } from 'react-redux';
import { addmyfriendlistdata } from './Redux/MyFriendlistReducer';
import { Service } from './Config/Services';
import { addbankaccounts } from './Redux/MyBankAccountsReducer';
import { addnotificationsdata } from './Redux/NotificationsReducer';
import { addwishlistdata } from './Redux/WishlistReducer';
import { AuthContext } from './Context';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import deviceInfoModule from 'react-native-device-info';
import { Adjust, AdjustEvent, AdjustConfig } from 'react-native-adjust';
import OneSignal from 'react-native-onesignal';
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { Colors } from './Utils';
import { Icons } from './Assets';
import Modal from 'react-native-modal';

import AsyncStorage from '@react-native-async-storage/async-storage';

const adjustConfig = new AdjustConfig("dgz8ox7ivg1s", AdjustConfig.EnvironmentProduction);
adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose);
Adjust.create(adjustConfig);
OneSignal.setAppId("6fc05008-7e9c-45b7-8d37-a329dd88f637");
OneSignal.promptForPushNotificationsWithUserResponse();
OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
    // console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
    let notification = notificationReceivedEvent.getNotification();
    // console.log("notification: ", notification);
    // const data = notification.additionalData
    // console.log("additionalData: ", data);
    // Complete with null means don't show a notification.
    notificationReceivedEvent.complete(notification);
});

OneSignal.setNotificationOpenedHandler(notification => {
    console.log("OneSignal: notification opened:", notification);
});

const toastConfig = {
    tomatoToast: ({ text1, text2, props }) => {
        if (text1 === 'Success') {
            return (

                <LinearGradient
                    // colors={['#FFDA3D', '#FDB833']}
                    colors={['#70E000', '#38B000']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.infoBox}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View>
                            <Image source={Icons.smily} style={{ width: 30, height: 30, resizeMode: "contain", tintColor: 'white', marginEnd: 10 }} />
                        </View>
                        <View>
                            <Text style={{
                                color: "white",
                                fontFamily: 'Poppins-SemiBold',
                                fontSize: heightPercentageToDP(1.5)
                            }}>{text1 + '!'}</Text>
                            <Text style={{
                                color: 'white',
                                fontFamily: 'Poppins-SemiBold',
                                fontSize: heightPercentageToDP(1.2)
                            }}>{text2}</Text>
                        </View>
                    </View>
                </LinearGradient>

            )
        }
        if (text1 === 'Attention') {
            return (
                <LinearGradient
                    colors={['tomato', Colors.Red]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.infoBox}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View>
                            <Image source={Icons.sad} style={{ width: 30, height: 30, resizeMode: "contain", tintColor: 'white', marginEnd: 10 }} />
                        </View>
                        <View style={{ paddingRight: 10, }}>

                            <Text style={{
                                color: "white",
                                fontFamily: 'Poppins-SemiBold',
                                fontSize: heightPercentageToDP(1.5)
                            }}>{text1 == 'Attention' ? 'Oops!' : 'Oops!'}</Text>
                            <Text style={{
                                width:"90%",
                                color: 'white',
                                fontFamily: 'Poppins-SemiBold',
                                fontSize: heightPercentageToDP(1.2)
                            }}>{text2}</Text>
                        </View>
                    </View>

                </LinearGradient >
            )
        }
        if (text1 === 'Something went wrong!') {
            return (
                <LinearGradient
                    colors={['#FFDA3D', '#FDB833']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.infoBox}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View>
                            <Image source={Icons.tired} style={{ width: 30, height: 30, resizeMode: "contain", tintColor: 'white', marginEnd: 10 }} />
                        </View>
                        <View>

                            <Text style={{
                                color: "white",
                                fontFamily: 'Poppins-SemiBold',
                                fontSize: heightPercentageToDP(1.5)
                            }}>{text1}</Text>
                            <Text style={{
                                color: 'white',
                                fontFamily: 'Poppins-SemiBold',
                                fontSize: heightPercentageToDP(1.2)
                            }}>{text2}</Text>
                        </View>
                    </View>

                </LinearGradient >
            )
        }
    }
};

export default function App(props) {
    LogBox.ignoreLogs([
        'V: Calling `getNode()`',
        'Animated: `useNativeDriver`',
        'FlatList: Calling `getNode()`',
        'source.uri should not be an empty string',
        "EventEmitter.removeListener('change', ...): Method has been deprecated. Please instead use `remove()` on the subscription returned by `EventEmitter.addListener`.",
        "Authentication could not start because Touch ID has no enrolled fingers."
    ]);
    const dispatch = useDispatch();
    
    const addFriends = state => dispatch(addmyfriendlistdata(state));
    const setNotifications = (data) => dispatch(addnotificationsdata(data));
    const setBankAccounts = state => dispatch(addbankaccounts(state));
    const setWishlist = (data) => dispatch(addwishlistdata(data));
    const userDetails = useSelector(state => state.UserReducer);
    const apiToken = userDetails != undefined && userDetails.api_token;

    const [fullData, setFullData] = useState([]);
    const [recvBank, setRevBank] = useState([]);

    const [loading, setloading] = useState(false);
    const [isPermissionAllow, setPermissionAllow] = useState(false);


    async function checkUserPermission() {
        const authStatus = await messaging().hasPermission();
        if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
            getFcmToken();
            setPermissionAllow(false)
        }
        else {
            setPermissionAllow(true)
        }
    };

    async function requestUserPermission() {
        const authorizationStatus = await messaging().requestPermission();
        if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
            getFcmToken();
            setPermissionAllow(false);
        }
        else {
            setPermissionAllow(false);
        }
    };

    async function getFcmToken() {
        let checkToken = await AsyncStorage.getItem('@fcmToken');
        if (!checkToken) {
            try {
                const fcmToken = await messaging().getToken()
                if (!!fcmToken) {
                    await AsyncStorage.setItem('@fcmToken', fcmToken)
                }
            }
            catch (err) {
                if (err) {
                    Alert.alert(
                        'Attention',
                        'Please allow notifications permission or close and restart your app.',
                        [
                            {
                                text: "OK",
                                onPress: () => console.log('alert')
                            }
                        ]
                    )
                }
            }
        }
    };


    useEffect(() => {
        crashlytics().log('App mounted.');
        checkUserPermission();
        notificationListener();

        Platform.OS === 'android' ? notificationControllerAndroid() : notificationControllerIos();

    }, []);

    const GetFriendlist = async () => {
        if (!!apiToken) await Service.GetFriendlist(apiToken, addFriends, setFullData, setloading);
    };

    const GetAllNotifications = async () => {
        if (!!apiToken) await Service.GetAllNotifications(apiToken, setNotifications, setloading);
    };

    const SessionExpired = async () => {
        await Service.CheckToken(userDetails.api_token, signOut);
    };

    useEffect(() => {
        analytics().logAppOpen();
        if (userDetails != undefined && userDetails.api_token) {
            if (!!userDetails.api_token) {
                GetFriendlist()
                GetAllNotifications();
            }
        }
        if (userDetails == undefined) {
            SessionExpired();
        }
    }, [userDetails]);

    return (
        <PaperProvider>
            <AppContent />
            <Toast config={toastConfig} />
            <NotificationPermissionModal isPermissionAllow={isPermissionAllow} onPress={requestUserPermission} />
        </PaperProvider>
    );
};

const NotificationPermissionModal = ({ isPermissionAllow, onPress }) => {
    return (
        <Modal
            animationType="slide"
            isVisible={isPermissionAllow}
            onRequestClose={() => {
                console.log('Success')
            }}
            backdropColor='transparent'
        >
            <View style={{
                top: hp(0),
                padding: 20,
                width: wp('80%'),
                height: 'auto',
                alignSelf: 'center',
                backgroundColor: Colors.White,
                elevation: 10,
                shadowOffset: { width: 0, height: 8 },
                shadowColor: Colors.Grey,
                shadowRadius: 10,
                shadowOpacity: 0.3,
                borderRadius: 18,
                borderWidth:1,
                borderColor:Colors.LightestBlue,
            }}>
                <Text style={{ color: Colors.LightestBlue, fontFamily: 'Poppins-SemiBold', fontSize: hp(2.2), textAlign: 'center' }}>Please Allow Notifications Permission For:</Text>

                <View style={{ marginTop: 10, padding: 0, flexDirection: "row", alignItems: "center", }}>
                    <Text style={styles.bulletPoint}>• </Text>
                    <Text style={{ color: Colors.LightestBlue, fontFamily: 'Poppins-Regular', fontSize: hp(1.6), textAlign: 'left', }}>Be notified when your friend sends you a GFT.</Text>
                </View>
                <View style={{ padding: 0, flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.bulletPoint}>• </Text>
                    <Text style={{ color: Colors.LightestBlue, fontFamily: 'Poppins-Regular', fontSize: hp(1.6), textAlign: 'left' }}>When you have a new friend.</Text>
                </View>
                <View style={{ marginBottom: 10,padding: 0, flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.bulletPoint}>• </Text>
                    <Text style={{ color: Colors.LightestBlue, fontFamily: 'Poppins-Regular', fontSize: hp(1.6), textAlign: 'left' }}>When there is exciting news for you.</Text>
                </View>
                <TouchableOpacity onPress={onPress} style={{ backgroundColor: Colors.LightestBlue, width: wp(50), height: hp(5.5), alignSelf: "center", borderRadius: 10, alignItems: "center", justifyContent: "center" }} >
                    <Text style={{ color: Colors.White, fontFamily: "Poppins-SemiBold", fontSize: hp(1.8) }}>Continue</Text>
                </TouchableOpacity>
            </View>

        </Modal>
    )
}

const styles = StyleSheet.create({
    gradientText: {
        color: 'white',
        fontFamily: 'Poppins-Bold',
        fontSize: heightPercentageToDP(2),
    },
    infoBox: {
        width: widthPercentageToDP(90),
        height: heightPercentageToDP(10),
        borderRadius: 18,
        alignItems: 'flex-start',
        paddingLeft: 20,
        justifyContent: 'center',
    },
    bulletPoint: {
        fontSize: hp(3),
        color:Colors.LightestBlue
    },
})