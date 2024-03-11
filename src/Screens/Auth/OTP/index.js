import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Image, TouchableWithoutFeedback, Alert, Platform } from 'react-native';
import { Icons } from '../../../Assets';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import auth from '@react-native-firebase/auth';

// Constants----------------------------------------------------------------
import AppButton from '../../../Constants/Button';
import AppHeader from '../../../Constants/Header';
import AppTextInput from '../../../Constants/TextInput';
import { Colors } from '../../../Utils';
import { AuthContext } from '../../../Context';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';

import { updatesignupdata } from '../../../Redux/SignupReducer';
import { adduserdata } from '../../../Redux/UserReducer';
import axios from 'axios';
import { APIS, Headers } from '../../../Config/api';
import { Service } from '../../../Config/Services';


export default function OTP({ navigation, route }) {
    const dispatch = useDispatch()
    const updateSignupData = (data) => dispatch(updatesignupdata(data));
    const { socialSignup, signIn, signUp, NewSignup } = useContext(AuthContext);
    const [otp, setOTP] = useState('');
    const [loading, setLoading] = useState('');
    const [validationMessage, setValidationMessage] = useState('');
    const [isSelected, setSelection] = useState(false);
    const adduserData = (data) => dispatch(adduserdata(data));
    const preSignupData = useSelector(state => state.SignupReducer);

    // Handle user state changes

    function onAuthStateChanged(user) {
        if (user) auth().signOut();
        // if (user && preSignupData && preSignupData.type === "social") {
        //     const DATA = {
        //         email: preSignupData.email,
        //         password: preSignupData.password,
        //         device_token: preSignupData.device_token,
        //     };
        //     const params = JSON.stringify(DATA);
        //     signIn(
        //         params,
        //         setLoading,
        //         adduserData,
        //         navigation
        //     )
        // }
        // else {
        //     navigation.navigate('SignupInfo');
        // }
        // auth().sign
    }

    const subscriber = async () => {
        auth().onAuthStateChanged(onAuthStateChanged);
        // console.log(auth().currentUser)
    };

    useEffect(() => {
        subscriber()
        return () => subscriber();
    }, []);

    const handleOTPSubmit = async () => {
        setLoading(true)
        try {
            console.log("preSignupData.type === 'social'", preSignupData.type === "social", preSignupData.mobile);
            // if (preSignupData.type === "social") {
            const data = {
                full_name: preSignupData.full_name,
                email: preSignupData.email,
                otp: otp,
                mobile: preSignupData.mobile,
                password: preSignupData.password,
                social_access_token: preSignupData.type == "social" ? preSignupData.social_access_token : null,
                device_token: preSignupData.device_token,
            }
            console.log("SOCILA LOGIN DATA", data);
            // await socialSignup(data, setLoading, adduserData);
            await NewSignup(data, setLoading, adduserData);

            // } 

            // else {
            //     // navigation.navigate('SignupInfo');
            //     // await signUp(preSignupData, () => { }, navigation);
            // }
        }
        catch (err) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: `${err}`,
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            Alert.alert(
                "Error Occured",
                `${err}`,
                [
                    { text: "Ok", onPress: () => { } }
                ]
            );
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                backgroundColor={Colors.White}
                translucent
                barStyle={'dark-content'} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : 0, backgroundColor: Colors.White }} />
            <View style={styles.content}  >
                <View style={styles.box1}>
                    <View style={styles.section1}>
                        <TouchableWithoutFeedback onPress={() => navigation.pop()}>
                            <Image source={Icons.backarrow} style={{ width: wp(15), height: hp(3), resizeMode: 'contain', alignSelf: "flex-start", tintColor: Colors.Grey, marginTop: wp(5) }} />
                        </TouchableWithoutFeedback>

                        <Image source={Icons.logoIcon} style={{ width: 75, height: 74, resizeMode: 'contain', }} />
                        {/* <Image source={Icons.verificationIcon} style={{ width: 120, height: 120, resizeMode: 'cover', }} /> */}
                        <Text style={styles.logoText}>{'OTP VERFICATION'}</Text>
                    </View>
                    <View style={styles.section2}>
                        <Text style={styles.lableText}>Enter OTP</Text>
                        <OTPInputView
                            placeholderTextColor={Colors.Charcol}
                            codeInputHighlightStyle={{ borderColor: Colors.Blue, }}
                            codeInputFieldStyle={{ borderWidth: 2, borderColor: Colors.ThemeColor, color: Colors.ThemeColor, fontSize: hp(2.3), fontFamily: 'Poppins-SemiBold' }}
                            style={{ width: '80%', height: 80, alignSelf: 'center', color: Colors.Grey }}
                            autoFocusOnLoad
                            pinCount={6}
                            onCodeFilled={(code => {
                                setOTP(code)
                            })}
                        />
                    </View>
                    <View style={styles.section3}>
                        <AppButton loading={loading} mmedium text="Submit" onPressed={handleOTPSubmit} />
                    </View>
                </View>
                <View style={styles.box2}>
                    <View style={styles.section5}>
                        <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.linkStyle}>Login</Text>
                        </TouchableWithoutFeedback>
                    </View>

                </View>
            </View>
        </SafeAreaView >
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    content: {
        flex: 1,
    },
    box1: {
        flex: 1.5,
        justifyContent: "space-between",
    },
    box2: {
        flex: .5,
        justifyContent: "center",
    },
    section1: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "space-between",
        flexDirection: 'column',
    },
    section2: {
        flex: .4,
        justifyContent: "space-evenly",
        alignItems: 'center',
        flexDirection: 'column',
    },
    section3: {
        flex: .2,
        justifyContent: "center",
        alignItems: 'center',
    },
    section4: {
        flex: .9,
        justifyContent: "center",
        alignItems: 'center',
        flexDirection: 'column',
    },
    section5: {
        flex: .8,
        justifyContent: "flex-end",
        alignItems: 'center',
        flexDirection: 'column',
    },
    link: {
        marginRight: -15,
        paddingVertical: hp(.5),
        alignSelf: 'flex-end',
    },
    fotgotTextStyle: {
        fontSize: hp(1.5),
        color: Colors.Grey,
        fontFamily: 'Poppins-Regular',
    },
    linkStyle: {
        color: Colors.LightestBlue,
        fontSize: hp(2.3),
        fontFamily: 'Poppins-Medium',
    },
    textStyle: {
        color: Colors.Grey,
        fontSize: hp(1.5),
        fontFamily: 'Poppins-Regular',
    },
    logoText: {
        color: Colors.LightestBlue,
        fontSize: hp(2.8),
        textAlign: 'center',
        paddingBottom: hp(2),
        fontFamily: 'Poppins-Medium',
    },
    lableText: {
        color: Colors.Grey,
        fontSize: hp(2.2),
        fontFamily: 'Poppins-Regular',
    },
    tnc: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
})