import React, { useState, useEffect, useContext, useCallback } from 'react'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Linking, TouchableOpacity, StatusBar, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Alert } from 'react-native';
import { Icons } from '../../../Assets';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import CheckBox from 'react-native-check-box'
import CountryPicker from 'react-native-country-picker-modal'
import messaging, { firebase } from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import { Checkbox } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { addsignupdata } from '../../../Redux/SignupReducer';
// import { Service } from '../../../Config/Services';

// Constants----------------------------------------------------------------
import AppButton from '../../../Constants/Button';
import AppHeader from '../../../Constants/Header';
import AppTextInput from '../../../Constants/TextInput';
import { Colors } from '../../../Utils';
import { AuthContext } from '../../../Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Service } from '../../../Config/Services';
import { useDispatch, useSelector } from 'react-redux';
import { updatesignupdata } from '../../../Redux/SignupReducer';
import { useFocusEffect } from '@react-navigation/native';
import CustomTextInput from '../../../Constants/CustomTextInput';
import { useForm } from 'react-hook-form';
import { scale } from 'react-native-size-matters';

const theme = {
    roundness: 2,
    colors: {
        primary: Colors.ThemeColor,
        accent: Colors.ThemeColor,
    },
};





export default function SignUp({ navigation }) {
    const preSignupData = useSelector(state => state.SignupReducer);
    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        mode: 'all', defaultValues: {
            email: preSignupData.email
        }
    });

    const { signUp, CheckPhone } = useContext(AuthContext);
    const [phone, setPhone] = useState('');
    const [loading, setloading] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');
    const [isSelected, setSelection] = useState(false);
    const [countryCode, setCountryCode] = useState('US')
    const [country, setCountry] = useState(null)
    const [withCallingCode, setWithCallingCode] = useState(true)
    const [dialingCode, setDialingCode] = useState('+1');
    const [confirm, setConfirm] = useState(null);
    const [token, setToken] = useState('');
    const [alreadyExist, setAlreadyExist] = useState(false);


    // console.log("get auth method",getAuth().getUserByPhoneNumber('+923131226248'));
    const dispatch = useDispatch();
    // const preSignupData = useSelector(state => state.SignupReducer);
    // console.log('preSignupData====>', preSignupData);


    async function getToken() {
        let token = await AsyncStorage.getItem('@fcmToken');
        // console.log('token',token)
        setToken(token);
    };
    useEffect(() => {
        // weekTimer();
        getToken();

    }, []);

    const onSelect = (country) => {
        const plus = '+';
        setCountryCode(country.cca2);
        setCountry(country);
        setDialingCode(plus.concat(country.callingCode));
    };


    const handleNewSignup = async (data) => {
        console.log("handleNewSignup", data);
        // get firebase messaging token
        const fcmToken = await firebase.messaging().getToken();
        setloading(true);
        //check if the phone number is invalid 
        if (phone.length < 10) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: `Please Add a valid Phone Number.`,
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
                onHide: () => setloading(false),
            });
        }
        else if (data.password != data.confirmPassword) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: `Password does not Match`,
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
                onHide: () => setloading(false),
            });
        }
        else {
            // combine number with country code
            const CombineNum = dialingCode.concat(phone);
            console.log("Combined Number ==>", CombineNum);
            // add  CombineNum phone for release build
            //already registered number +12402447523 +923343800991


            // hit api to check if the phone number exists in database
            CheckPhone({ mobile: CombineNum, email: data.email }, setloading)
                .then(async (resp) => {

                    if (resp) {
                        console.log("Phone Number", resp);
                        const signupData = {
                            mobile: CombineNum,
                            email: data.email,
                            password: data.password,
                            full_name: data.fullname,
                            device_token: fcmToken,
                        };
                        if (preSignupData.type == "social") {
                            dispatch(updatesignupdata({ ...preSignupData, mobile: CombineNum, device_token: fcmToken }))
                            navigation.navigate('OTP');
                        } else {
                            dispatch(updatesignupdata({ ...signupData }))
                            navigation.navigate('OTP');
                            // await signUp(data, result, navigation);
                        }
                    }
                }
                )
        }


    }  

    // old firebae method
    const handleSignUp = async () => {
        // get firebase token from device
        const fcmToken = await firebase.messaging().getToken();
        setloading(true);
        //check if the phone number is invalid 
        // if (phone.length < 10) {
        //     Toast.show({
        //         type: 'tomatoToast',
        //         text1: "Attention",
        //         text2: `Please Add a valid Phone Number.`,
        //         autoHide: true,
        //         position: 'top',
        //         visibilityTime: 2000,
        //         onHide: () => setloading(false),
        //     });
        // }
        // else {
        // combine number with country code
        const CombineNum = dialingCode.concat(phone);
        // add  CombineNum phone for release build
        //already registered number +12402447523 +923343800991

        CheckPhone({ mobile: CombineNum }, setloading)
            .then(async (resp) => {
                if (resp) {
                    await auth().signInWithPhoneNumber(CombineNum, true)
                        .then(async (result) => {
                            setConfirm(result);
                            if (!!result) {
                                const data = {
                                    mobile: CombineNum,
                                    device_token: fcmToken,
                                };
                                if (preSignupData.type == "social") {
                                    dispatch(updatesignupdata({ ...preSignupData, mobile: CombineNum, device_token: fcmToken }))
                                    navigation.navigate('OTP', { confirm: result, });
                                } else {
                                    await signUp(data, result, navigation);
                                }
                            };

                        })
                        .catch(async err => {
                            console.log(err.message);
                            const params = {
                                screen: 'Sign up', error: `${err.message}`, target: 'Request OTP'
                            }
                            await Service.ErrorHandler(params);
                            if (err.code === 'auth/too-many-requests') {
                                setAlreadyExist(true);
                                Toast.show({
                                    type: 'tomatoToast',
                                    text1: "Attention",
                                    text2: `Too many attempts. Please try again 4 hours later.`,
                                    autoHide: true,
                                    position: 'top',
                                    visibilityTime: 2000,
                                    onHide: () => navigation.goBack(),
                                });
                                return false;
                            }
                            if (err.code === 'auth/invalid-phone-number') {
                                Toast.show({
                                    type: 'tomatoToast',
                                    text1: "Attention",
                                    text2: `The phone number provided is incorrect.`,
                                    autoHide: true,
                                    position: 'top',
                                    visibilityTime: 2000,
                                    onHide: () => navigation.goBack(),
                                });
                                return false

                            }
                            Toast.show({
                                type: 'tomatoToast',
                                text1: "Attention",
                                text2: `${err.code}`,
                                autoHide: true,
                                position: 'top',
                                visibilityTime: 2000,
                                onHide: () => navigation.goBack(),
                            });
                        })
                        .finally(() => {
                            setSelection(false)
                            setloading(false)
                        })

                }
            }
            )
        // }

    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                backgroundColor={Colors.White}
                translucent
                barStyle={'dark-content'} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView contentContainerStyle={[{ paddingHorizontal: scale(20) }, preSignupData.type == "social" && { height: "100%", alignItems: "center", justifyContent: "center" }]}>
                    <View style={{ height: scale(75), width: scale(75), alignSelf: "center", marginVertical: scale(25) }}>
                        <Image source={Icons.logoIcon} style={{ width: "100%", height: "100%", resizeMode: 'cover', }} />
                    </View>
                    <Text style={styles.titleText}>Sign Up</Text>

                    <>
                        {preSignupData.type != "social" && <CustomTextInput
                            placeholder={"Enter Your Full Name"}
                            control={control}
                            name={"fullname"}
                            rules={{
                                required: 'Full Name is Required',
                                message: 'Full Name is Required',
                            }}
                        />}
                        {preSignupData.type != "social" && <CustomTextInput
                            placeholder={"Enter Your Email"}
                            control={control}
                            name={"email"}
                            rules={{
                                required: "Email is Required",
                                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                pattern: {
                                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                    message: "Invalid Email",
                                },
                            }}
                        />}
                    </>
                    <AppTextInput maxLength={10} numeric dialingCode={dialingCode} withCallingCode={withCallingCode} countryCode={countryCode} country={country} onSelect={onSelect} left xmedium placeholder="Enter Your Phone Number" value={phone} validation onChangedText={setPhone} validationText={validationMessage} />

                    {preSignupData.type != "social" &&
                        <>
                            <CustomTextInput
                                secureTextEntry={true}
                                placeholder={"Enter Your Password"}
                                control={control}
                                name={"password"}
                                rules={{
                                    required: "Password is Required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be of at least 8 characters",
                                    },
                                    maxLength: {
                                        value: 16,
                                        message: "Password must be of at most 16 characters",
                                    },
                                }}
                            />
                            <CustomTextInput
                                secureTextEntry={true}
                                placeholder={"Confirm Your Password"}
                                control={control}
                                name={"confirmPassword"}
                                rules={{
                                    required: "Password is Required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be of at least 8 characters",
                                    },
                                    maxLength: {
                                        value: 16,
                                        message: "Password must be of at most 16 characters",
                                    },
                                }}
                            />
                        </>
                    }
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <AppButton loading={loading} disabled={alreadyExist == true ? true : false} mmedium text={"Continue"} isSelected={!isSelected} onPressed={isSelected ? handleSubmit(handleNewSignup) :
                            // alreadyExist == true ? () => navigation.goBack() :
                            () => Alert.alert('Please read and agree to Terms & Conditions and Privacy and Policy.')} />
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: scale(10) }}>
                            <Checkbox.Android
                                uncheckedColor={Colors.ThemeColor}
                                theme={theme}
                                status={isSelected ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setSelection(!isSelected);
                                }}
                            />
                            <View style={{ width: "85%", height: 'auto', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: scale(13), fontFamily: 'Helvetica', color: Colors.Charcol, fontFamily: 'Poppins-Regular' }}>I have read and agree to the <Text style={{ color: Colors.LightestBlue }} onPress={() => Linking.openURL('https://getgftd.io/privacy-policy')}>Privacy policy</Text>, as well as Stripe's <Text style={{ color: Colors.LightestBlue }} onPress={() => Linking.openURL('https://getgftd.io/terms-condition')}>Terms of Service</Text> and <Text style={{ color: Colors.LightestBlue }} onPress={() => Linking.openURL('https://getgftd.io/privacy-policy')}>Privacy Policy</Text>.</Text>
                            </View>
                        </View>
                        <TouchableWithoutFeedback onPress={() => { navigation.goBack(); dispatch(addsignupdata({})) }}>
                            <Text style={styles.backText}>Go Back</Text>
                        </TouchableWithoutFeedback>
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
    titleText: {
        color: Colors.LightestBlue,
        fontSize: scale(25),
        textAlign: 'center',
        paddingBottom: scale(10),
        fontFamily: 'Poppins-Medium',
    },
    backText: {
        color: Colors.ThemeColor,
        fontSize: scale(15),
        fontFamily: 'Poppins-Medium',
    },
    error: {
        color: Colors.Red,
        alignSelf: 'stretch',
        fontFamily: 'Poppins-Regular',
        fontSize: hp(1.2)
        // marginTop:10,
    },
    lableText: {
        textAlign: "center",
        color: Colors.Grey,
        fontSize: scale(16),
        fontFamily: 'Poppins-Regular',
    },
})

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: Colors.White,
//     },
//     content: {
//         flex: 1,
//     },
//     box1: {
//         flex: 1.5,
//         justifyContent: "space-between",
//     },
//     box2: {
//         flex: .5,
//         justifyContent: "center",
//     },
//     section1: {
//         flex: 1.2,
//         alignItems: 'center',
//         justifyContent: "flex-start",
//         flexDirection: 'column',
//     },
//     section2: {
//         flex: .5,
//         justifyContent: "space-evenly",
//         alignItems: 'center',
//         flexDirection: 'column',
//     },
//     section3: {
//         flex: .29,
//         justifyContent: "center",
//         alignItems: 'center',
//     },
//     section4: {
//         flex: .9,
//         justifyContent: "center",
//         alignItems: 'center',
//         flexDirection: 'column',
//     },
//     section5: {
//         flex: 1,
//         justifyContent: "space-around",
//         alignItems: 'center',
//         flexDirection: 'column',
//     },
//     link: {
//         marginRight: -15,
//         paddingVertical: hp(.5),
//         alignSelf: 'flex-end',
//     },
//     fotgotTextStyle: {
//         fontSize: hp(1.5),
//         color: Colors.Grey,
//         fontFamily: 'Poppins-Regular',
//     },
//     linkStyle: {
//         color: Colors.ThemeColor,
//         fontSize: hp(2.2),
//         fontFamily: 'Poppins-Medium',
//     },
//     textStyle: {
//         color: Colors.Grey,
//         fontSize: hp(1.5),
//         fontFamily: 'Lato-Regular'
//     },
//     logoText: {
//         color: Colors.LightestBlue,
//         fontSize: hp(2.8),
//         textAlign: 'center',
//         paddingBottom: hp(2),
//         fontFamily: 'Poppins-Medium',
//     },
//     lableText: {
//         color: Colors.Grey,
//         fontSize: hp(2.2),
//         fontFamily: 'Poppins-Regular',
//     },
//     tnc: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "center",
//     },
// })

// {/* <ScrollView contentContainerStyle={{ flex: 1 }} >
// <View style={styles.box1}>
//     <View style={styles.section1}>
//         {/* <Image source={Icons.signupIcon} style={{ width: 120, height: 120, resizeMode: 'cover', marginTop: wp(20) }} /> */}
//         <Image source={Icons.logoIcon} style={{ width: scale( 75), height: scale(75), resizeMode: 'cover', marginTop: hp(13) }} />
//         {/* <Image source={Icons.signupIcon} style={{ width: 120, height: 120, resizeMode: 'cover', marginTop: wp(20) }} /> */}
//     </View>
//     <Text style={styles.logoText}>Sign Up</Text>
//     <View style={styles.section2}>
//         <Text style={styles.lableText}>Enter Your Phone Number</Text>
//         <AppTextInput maxLength={10} numeric dialingCode={dialingCode} withCallingCode={withCallingCode} countryCode={countryCode} country={country} onSelect={onSelect} left xmedium placeholder="" value={phone} validation onChangedText={setPhone} validationText={validationMessage} />
//     </View>
//     <View style={styles.section3}>
//         <AppButton loading={loading} disabled={alreadyExist == true ? true : false} mmedium text={"Continue"} isSelected={!isSelected} onPressed={isSelected ? handleSignUp :
//             // alreadyExist == true ? () => navigation.goBack() : 
//             () => Alert.alert('Please read and agree to Terms & Conditions and Privacy and Policy.')} />
//         {alreadyExist == true ? <View>
//             <Text style={{ fontFamily: 'Poppins-SemiBold', color: 'red', fontSize: hp(1.6) }}>Too many attempts. please try again after 4 hours.</Text>
//         </View> : null}
//     </View>
// </View>
// <View style={styles.box2}>
//     <View style={styles.section5}>
//         <View style={styles.tnc}>
//             <Checkbox.Android
//                 uncheckedColor={Colors.ThemeColor}
//                 theme={theme}
//                 status={isSelected ? 'checked' : 'unchecked'}
//                 onPress={() => {
//                     setSelection(!isSelected);
//                 }}
//             />
//             <View style={{ width: wp('76%'), height: 'auto', alignItems: 'center', justifyContent: 'center' }}>
//                 <Text style={{ fontSize: hp(1.8), fontFamily: 'Helvetica', color: Colors.Charcol, fontFamily: 'Poppins-Regular' }}>I have read and agree to the <Text style={{ color: Colors.LightestBlue }} onPress={() => Linking.openURL('https://getgftd.io/privacy-policy')}>Privacy policy</Text>, as well as Stripe's <Text style={{ color: Colors.LightestBlue }} onPress={() => Linking.openURL('https://getgftd.io/terms-condition')}>Terms of Service</Text> and <Text style={{ color: Colors.LightestBlue }} onPress={() => Linking.openURL('https://getgftd.io/privacy-policy')}>Privacy Policy</Text>.</Text>
//             </View>
//         </View>
//         <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
//             <Text style={styles.linkStyle}>Go Back</Text>
//         </TouchableWithoutFeedback>
//     </View>

// </View>
// </ScrollView> */}