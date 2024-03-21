import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, Image, StatusBar, TouchableWithoutFeedback, Alert } from 'react-native'

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToggleSwitch from 'toggle-switch-react-native';
import { Icon } from 'react-native-elements';
import { useSelector } from 'react-redux';

// Constants----------------------------------------------------------------
import AppHeader from '../../../Constants/Header';

// Utils----------------------------------------------------------------
import { Service } from '../../../Config/Services';
import { Colors } from '../../../Utils';
import { AuthContext } from '../../../Context';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useFocusEffect } from '@react-navigation/native';
import SignupStatus from '../../../Config/SignupStatus';

export default Settings = ({ navigation }) => {
    const userDetails = useSelector(state => state.UserReducer);
    const signupStatus = useSelector(state => state.SignupStatusReducer);
    const apiToken = userDetails?.api_token;
    const [loading, setloading] = useState(false);
    const [switchBioMetric, setSwitchBioMetric] = useState(false);
    const [giftRecieving, setGiftRecieving] = useState(true);
    const [thanksRecieving, setThanksRecieving] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const { deleteAccount, signOut, trackData } = useContext(AuthContext);

    useEffect(() => {
        biometricSetter();
        giftNSetter();
        thanksNSetter();
    }, []);

    const biometricSetter = async () => {
        const value = await AsyncStorage.getItem('@biometric');
        if (value !== null) setSwitchBioMetric(true);
    };
    const giftNSetter = async () => {
        const gift_value = await AsyncStorage.getItem('@giftnotification');
        if (gift_value !== null) setGiftRecieving(true);
    };

    const thanksNSetter = async () => {
        const thanks_value = await AsyncStorage.getItem('@thanksnotification');
        if (thanks_value !== null) setThanksRecieving(true);
    };

    const handleDeleteAcc = async () => {
        Alert.alert(
            "Delete Account",
            "Do you want to delete your account?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => deleteAccount(apiToken) }
            ]
        );
    };

    useFocusEffect(()=>{
        if(!!apiToken) trackData(apiToken, 'Page Viewed', 'Settings');
    });

    return (
        <>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />
            <AppHeader onPressed={() => navigation.goBack()} leftIcon={Icons.backarrow} text="MY ACCOUNT" />
            <View style={styles.container}>
                <View style={styles.accountSettingsStyle}>
                    <Text style={{ fontSize: hp(2.2), marginBottom: 10, fontFamily: 'Poppins-SemiBold', color:Colors.Charcol}}>Account</Text>
                    <View style={styles.ItemStyle}>
                        <Text style={{ fontSize: hp(1.8), color: Colors.Grey, fontFamily: 'Poppins-Regular' }}>Edit Profile</Text>
                        <Icon name="edit" type="ionicons" size={hp(2.7)} onPress={() => navigation.navigate('EditProfile')} />
                    </View>
                </View>
                <View style={styles.accountSettingsStyle}>
                    <Text style={{ fontSize: hp(2.2), marginBottom: 10, fontFamily: 'Poppins-SemiBold', color:Colors.Charcol }}>Privacy &amp; Security</Text>
                    <View style={styles.ItemStyle}>
                        <Text style={{ fontSize: hp(1.8), color: Colors.Grey, fontFamily: 'Poppins-Regular' }}>Biometric</Text>
                        <ToggleSwitch
                            isOn={switchBioMetric}
                            onColor="#5ed34b"
                            offColor="lightgrey"
                            size="medium"
                            onToggle={isOn => {
                                setSwitchBioMetric(isOn)
                                if (isOn == false) AsyncStorage.removeItem('@biometric');
                                if (isOn == true && switchBioMetric == false) setShowAlert(true)
                            }}
                            animationSpeed={200}
                        />
                    </View>
                    <View style={styles.ItemStyle}>
                        <Text style={{ fontSize: hp(1.8), color: Colors.Grey, fontFamily: 'Poppins-Regular' }}>Delete Account</Text>
                        <Icon name="delete" type="ionicons" size={hp(2.7)} onPress={handleDeleteAcc} />
                    </View>
                </View>
                <View style={styles.accountSettingsStyle}>
                    <Text style={{ fontSize: hp(2.2), marginBottom: 10, fontFamily: 'Poppins-SemiBold', color:Colors.Charcol }}>Push Notifications</Text>
                    <View style={styles.PNStyle}>
                        <View style={styles.PNItemStyle}>
                            <Text style={{ fontSize: hp(1.8), color: Colors.Grey, fontFamily: 'Poppins-Regular' }}>Receive gft notifications</Text>
                            <ToggleSwitch
                                isOn={giftRecieving}
                                onColor="#5ed34b"
                                offColor="lightgrey"
                                size="medium"
                                onToggle={async isOn => {
                                    setGiftRecieving(isOn);
                                    if (isOn === true) {
                                        AsyncStorage.setItem('@giftnotification', 'giftIsOn');
                                    }
                                    if (isOn == false) {
                                        AsyncStorage.removeItem('@giftnotification');
                                    };

                                    const rowData = {
                                        gift_notification: isOn == false ? 0 : 1,
                                        // whishlist_privacy: 1
                                    };
                                    const data = JSON.stringify(rowData);
                                    await Service.UserSetting(data, apiToken, setloading);
                                }}
                                animationSpeed={200}
                            />
                        </View>
                        <View style={styles.PNItemStyle}>
                            <Text style={{ fontSize: hp(1.8), color: Colors.Grey, fontFamily: 'Poppins-Regular',}}>Receive thank you notifications</Text>
                            <ToggleSwitch
                                isOn={thanksRecieving}
                                onColor="#5ed34b"
                                offColor="lightgrey"
                                size="medium"
                                onToggle={async isOn => {
                                    setThanksRecieving(isOn);
                                    if (isOn === true) {
                                        AsyncStorage.setItem('@thanksnotification', 'thanksIsOn');
                                    }
                                    if (isOn === false) {
                                        AsyncStorage.removeItem('@thanksnotification');
                                    };
                                    const rowData = {
                                        thankyou_message_notification: isOn == false ? 0 : 1,
                                        // whishlist_privacy: 1
                                    };
                                    const data = JSON.stringify(rowData);
                                    await Service.UserSetting(data, apiToken, setloading);
                                }}
                                animationSpeed={200}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.accountSettingsStyle}>
                    <View style={styles.PNStyle}>
                        <TouchableWithoutFeedback onPress={() => navigation.navigate('TNC')}>
                            <View style={styles.PNItemStyle}>
                                <Text style={{ fontSize: hp(2.2), color: Colors.Grey, fontFamily: 'Poppins-SemiBold' }}>Terms and Conditions</Text>
                                <Icon type="material" name="arrow-forward-ios" size={hp(2.7)} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
            <View>
            </View>
            <SignupStatus bool={signupStatus?.isSignup} />
            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title={'Attention'}
                message={'You need to logout to activate biometric feature.'}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                confirmButtonStyle={{
                    width: 80,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                cancelButtonStyle={{
                    width: 80,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                showConfirmButton={true}
                showCancelButton={true}
                cancelText="Cancel"
                cancelButtonTextStyle={{color:Colors.White, fontSize: hp(1.8), fontFamily: 'Lato-Regular',}}
                confirmText="Logout"
                confirmButtonTextStyle={{color:Colors.White, fontSize: hp(1.8), fontFamily: 'Lato-Regular',}}
                confirmButtonColor={Colors.LightestBlue}
                onCancelPressed={() => {
                    setShowAlert(!showAlert);
                    setSwitchBioMetric(false);
                }}
                titleStyle={{color: Colors.Charcol, fontSize:hp(2.5), fontFamily: 'Lato-Bold'}}
                messageStyle={{color: Colors.Grey, fontSize:hp(2), fontFamily: 'Lato-Regular'}}
                onConfirmPressed={() => {
                    setShowAlert(!showAlert);
                    signOut();

                }}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
        padding: 20,
    },
    accountSettingsStyle: {
        flexDirection: "column",
        marginVertical: 10
    },
    ItemStyle: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 5,

    },
    PNStyle: {
        flexDirection: "column",
        justifyContent: "space-between",
        // alignItems: "center",
    },
    PNItemStyle: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 5,
    },
});