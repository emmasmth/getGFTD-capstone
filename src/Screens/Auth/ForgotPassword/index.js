import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Alert } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CheckBox from 'react-native-check-box'
import CountryPicker from 'react-native-country-picker-modal'
import messaging, { firebase } from '@react-native-firebase/messaging';
import { AuthContext } from '../../../Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Utils----------------------------------------------------------------
import { Icons } from '../../../Assets';
import { Colors } from '../../../Utils';

// Constants----------------------------------------------------------------
import AppButton from '../../../Constants/Button';
import AppTextInput from '../../../Constants/TextInput';
import analytics from '@react-native-firebase/analytics';
import { scale } from 'react-native-size-matters';

export default function ForgotPassword({ navigation }) {
    const { forgotPassword } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [loading, setloading] = useState('');
    const [validationMessage, setValidationMessage] = useState('');
    const [countryCode, setCountryCode] = useState('US')
    const [country, setCountry] = useState(null)
    const [dialingCode, setDialingCode] = useState('+1');
    const [token, setToken] = useState('');
    const [valideEmail, setValideEmail] = useState(null);

    const emailValidator = async (text) => {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        // console.log(reg.test(text))
        setValideEmail(reg.test(text))
        setEmail(text)
    }

    useEffect(() => {
        async function getToken() {
            let token = await AsyncStorage.getItem('@fcmToken');
            setToken(token);
        };
        getToken();
    }, []);

    const onSelect = (country) => {
        const plus = '+';
        setCountryCode(country.cca2)
        setCountry(country)
        setDialingCode(plus.concat(country.callingCode))
    };
    const handleRequest = async () => {
        if (valideEmail != true) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Invalid email format.',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        }
        if (email == '') {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Email cannot be empty',
                autoHide: true,
                position: 'top',
                visibilityTime: 1000,
            });
            return false;
        }
        let data = {
            email: email
        }
        await analytics().logEvent('forgot_password', {
            email: email
        });

        let params = JSON.stringify(data)
        await forgotPassword(params, setloading);
    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                backgroundColor={Colors.White}
                translucent
                barStyle={'dark-content'} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.content}
            >
                <ScrollView  >

                    <View style={styles.box1}>
                        {/* <Image source={Icons.backarrow} style={{ width: 25, height: 25, resizeMode: 'contain', tintColor:Colors.ThemeColor, position:"absolute", top:hp(12), left:wp(5) }} /> */}

                        <View style={styles.section1}>
                            {/* <Image source={Icons.signupIcon} style={{ width: 120, height: 120, resizeMode: 'cover', marginTop: wp(20) }} /> */}
                            <Image source={Icons.logoIcon} style={{ width: scale(75), height: scale(75), resizeMode: 'contain', marginTop: wp(25) }} />
                        </View>
                        <Text style={styles.logoText}>{'Forgot Password'}</Text>
                        <View style={styles.section2}>
                            <Text style={styles.lableText}>Enter Your Email</Text>
                            <AppTextInput lefimg xmedium placeholder="Please enter your email" value={email} validation onChangedText={emailValidator} validationText={validationMessage} />
                        </View>
                        <View style={styles.section3}>
                            <AppButton loading={loading} mmedium text="Continue" onPressed={handleRequest} />
                        </View>
                    </View>
                    <View style={styles.box2}>
                        <View style={styles.section5}>
                            <View style={styles.tnc}>
                            </View>
                            <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.linkStyle}>Login</Text>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        marginBottom: hp(2),
        // flex: 1,
        justifyContent: "center",
    },
    section1: {
        marginBottom: scale(80),
        alignItems: 'center',
        justifyContent: "flex-start",
        flexDirection: 'column',
    },
    section2: {
        marginBottom: scale(20),
        justifyContent: "space-evenly",
        alignItems: 'center',
        flexDirection: 'column',
    },
    section3: {
        marginBottom: scale(100),
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
        flex: 1,
        justifyContent: "space-around",
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
    },
    linkStyle: {
        color: Colors.LightestBlue,
        fontSize: hp(2.2),
        fontFamily: 'Poppins-Medium',
        // letterSpacing:1,

    },
    textStyle: {
        color: Colors.Grey,
        fontSize: hp(1.5),
        fontFamily: 'Poppins-Regular',

    },
    logoText: {
        color: Colors.LightestBlue,
        fontSize: hp(2.5),
        textAlign: 'center',
        paddingBottom: hp(2),
        fontFamily: 'Poppins-Medium',

    },
    lableText: {
        color: Colors.Grey,
        fontSize: hp(2),
        fontFamily: 'Poppins-Regular',

    },
    tnc: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
})