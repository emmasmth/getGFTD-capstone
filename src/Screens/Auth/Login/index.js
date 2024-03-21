import React, { useContext, useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Alert, Platform, TouchableOpacity, Linking, } from 'react-native';
import { Icons } from '../../../Assets';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ToggleSwitch from 'toggle-switch-react-native'
import TouchID from 'react-native-touch-id';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { useDispatch } from 'react-redux';
import analytics from '@react-native-firebase/analytics';
// import Orientation from 'react-native-orientation';
import {
    GraphRequest,
    AccessToken,
    GraphRequestManager,
    LoginManager,
} from 'react-native-fbsdk-next';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Constants----------------------------------------------------------------
import AppButton from '../../../Constants/Button';
import AppTextInput from '../../../Constants/TextInput';
import { Colors } from '../../../Utils';

// Services----------------------------------------------------------------
import { AuthContext } from '../../../Context';
import { adduserdata } from '../../../Redux/UserReducer';
import { useIsFocused } from '@react-navigation/native';
import OTPInputField from '../../../Constants/OTPInputField';
import CustomTextInput from '../../../Constants/CustomTextInput';
import { useForm } from 'react-hook-form';
import CustomButton from '../../../Constants/CustomButton';
import messaging, { firebase } from '@react-native-firebase/messaging';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
import jwt_decode from 'jwt-decode';
import { scale } from 'react-native-size-matters';


// GoogleSignin.configure();
// const initial = Orientation.getInitialOrientation();

export default function Login({ navigation }) {
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const adduserData = (data) => dispatch(adduserdata(data));
    const { signIn } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [deviceToken, setDeviceToken] = useState('');
    const [loading, setloading] = useState(false);
    const [loaderState, setLoaderState] = useState("");
    const [validationMessage, setValidationMessage] = useState('');
    const [biometryType, setBiometryType] = useState('');
    const [switchBioMetric, setSwitchBioMetric] = useState(false);
    const [isBiometric, setIsBiometric] = useState(false);



    const handleAppple = async (state) => {
        setLoaderState(state)
        try {
            const appleAuthRequestResponse = await appleAuth
                .performRequest({
                    requestedOperation: appleAuth.Operation.LOGIN,
                    requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
                })
            let { identityToken, email, fullName } = appleAuthRequestResponse;
            console.log('=================================');
            console.log('apple login data  email==>', email);
            console.log('=================================');
            console.log('=================================');
            console.log('apple login data  fullname==>', fullName);
            console.log('=================================');
            let decoded_token = jwt_decode(identityToken);
            let nonce = decoded_token.sub;
            const appleEmail = await AsyncStorage.getItem("appleEmail")
            console.log("APPLE EMAIL: " + appleEmail);
            const device_token = await messaging().getToken();
            Keychain.setGenericPassword(email == null ? appleEmail : email, nonce);
            const socialLoginInfo = JSON.stringify({
                // full_name: userInfo.user.givenName,
                email: email == null ? appleEmail : email,
                // username: userInfo.user.name.split(" ").join(''),
                // mobile: "",
                password: nonce,
                // social_access_token: userInfo.user.id,
                device_token: device_token,
            })
            // console.log('GoogleSignin Response===>',socialInfo)
            // dispatch(addsignupdata({ ...socialInfo, type: 'social' }));
            // navigation.navigate('SignUp');
            await signIn(
                socialLoginInfo,
                setloading,
                adduserData,
                navigation,
            );
        } catch (error) {
            console.log("error in login with apple", error);
        }
    }
    const handleGoogle = async (state) => {
        setLoaderState(state);
        try {
            await GoogleSignin.hasPlayServices();
            await GoogleSignin.signIn()
                .then(async userInfo => {
                    const device_token = await messaging().getToken();
                    Keychain.setGenericPassword(userInfo.user.email, userInfo.user.id);
                    const socialLoginInfo = JSON.stringify({
                        // full_name: userInfo.user.givenName,
                        email: userInfo.user.email,
                        // username: userInfo.user.name.split(" ").join(''),
                        // mobile: "",
                        password: userInfo.user.id,
                        // social_access_token: userInfo.user.id,
                        device_token: device_token,
                    })
                    // console.log('GoogleSignin Response===>',socialInfo)
                    // dispatch(addsignupdata({ ...socialInfo, type: 'social' }));
                    // navigation.navigate('SignUp');
                    await signIn(
                        socialLoginInfo,
                        setloading,
                        adduserData,
                        navigation,
                    );
                })
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    };


    const handleFacebook = async (state) => {
        setLoaderState("faceboook");
        LoginManager.logInWithPermissions([
            'public_profile',
            'email',
        ]).then(result => {

            AccessToken.getCurrentAccessToken().then(data => {
                console.log('====================================');
                console.log(`access token :  ${data}`);
                console.log('====================================');
                let accessToken = data.accessToken;
                // setToken(accessToken);

                const responseInfoCallback = async (error, userInfo) => {
                    if (error) {
                        console.log('Error fetching data: ' + error.toString());
                    } else {
                        const device_token = await messaging().getToken();
                        Keychain.setGenericPassword(userInfo.email, userInfo.id);
                        const socialLoginInfo = JSON.stringify({
                            // full_name: `${userInfo.first_name} ${userInfo.last_name}`,
                            email: userInfo.email,
                            // username: userInfo.first_name+userInfo.last_name,
                            // mobile: "",
                            password: userInfo.id,
                            // social_access_token: userInfo.id,
                            device_token: device_token,
                        })
                        await signIn(
                            socialLoginInfo,
                            setloading,
                            adduserData,
                            navigation,
                        );
                        // const obj = {
                        //   email: result.email ? result.email : '',
                        //   firstName: result.first_name,
                        //   lastName: result.last_name,
                        //   picUrl: result.picture.data.url,
                        //   uid: result.id,
                        // };
                        // dispatch(SocialLogin(obj, setModalVisible));
                        dispatch(addsignupdata({ ...socialInfo, type: 'social' }));
                        navigation.navigate('SignUp');
                        console.log('ressss', userInfo.id);
                    }
                };
                const infoRequest = new GraphRequest(
                    '/me',
                    {
                        accessToken: accessToken,
                        parameters: {
                            fields: {
                                string: 'email,name,first_name,middle_name,last_name,picture',
                            },
                        },
                    },
                    responseInfoCallback,
                );
                new GraphRequestManager().addRequest(infoRequest).start();
            });
        })

    }

    async function biometricSetter() {
        const value = await AsyncStorage.getItem('@biometric');
        if (value !== null) setIsBiometric(true);
    };

    const checkBiometricSupportednEnrolled = async (props) => {
        const optionalConfigObject = {
            unifiedErrors: false, // use unified error messages (default false)
            passcodeFallback: false // if true is passed, it will allow isSupported to return an error if the device is not enrolled in touch id/face id etc. Otherwise, it will just tell you what method is supported, even if the user is not enrolled.  (default false)
        };
        return new Promise((resolve, reject) => {
            TouchID.isSupported(optionalConfigObject)
                .then(biometryType => {
                    setBiometryType(biometryType);
                    resolve(true);
                })
                .catch(error => {
                    return false;
                    reject(Platform.OS == "ios" ? error.message : error.message);
                });
        });
    };

    useEffect(() => {
        AsyncStorage.getItem('@fcmToken')
            .then(response => setDeviceToken(response));
        biometricSetter();
        checkBiometricSupportednEnrolled();
    }, [isFocused]);

    const {
        control,
        handleSubmit: handleValidate,
        formState: { isValid },
    } = useForm();

    const onFormSubmit = useCallback(async (data) => {
        setLoaderState("default")
        const device_token = await messaging().getToken();
        if (device_token !== null && device_token !== undefined) {
            Keychain.setGenericPassword(data.username, data.password);
            const DATA = {
                email: data.username.toLowerCase().trim(),
                password: data.password,
                device_token: device_token,
            };
            const params = JSON.stringify(DATA);
            await analytics().logLogin({ method: "email" })
            try {
                await signIn(
                    params,
                    setloading,
                    adduserData,
                    navigation,
                );
            } catch (e) {
                console.log(JSON.parse(e));
            };
        }

    }, [handleValidate]);

    const handleBioMetric = () => {
        setLoaderState("default")
        Keychain.getGenericPassword()
            .then(credentials => {
                const { username, password } = credentials;
                if (!!credentials) {
                    TouchID.authenticate(`to login with username "${username}"`)
                        .then(async () => {
                            const data = {
                                email: username.toLowerCase(),
                                password: password,
                            }
                            Object.assign(data, { device_token: deviceToken });
                            const params = JSON.stringify(data);
                            try {
                                await signIn(
                                    params,
                                    setloading,
                                    adduserData,
                                    navigation,
                                );
                            } catch (e) {
                                Alert.alert(
                                    "Alert",
                                    "Please login manually first",
                                    [
                                        { text: "OK", onPress: () => console.log("OK Pressed") }
                                    ]
                                );
                                Keychain.resetGenericPassword();
                            }
                        })
                        .catch(error => {
                            Alert.alert(
                                "Alert",
                                "Please login manually first",
                                [
                                    { text: "OK", onPress: () => console.log("OK Pressed") }
                                ]
                            );
                            if (error === 'INVALID_CREDENTIALS') {
                                Keychain.resetGenericPassword();
                            }
                        })
                }
                else {
                    Alert.alert(
                        "Attention",
                        "Please login manually first!",
                        [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ]
                    );
                }
            });
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
                        <View style={styles.section1}>
                            <View style={{ width: scale(75), height: scale(75), alignSelf: "center", marginVertical: scale(25) }}>
                                <Image source={Icons.logoIcon} style={{ width: "100%", height: "100%", resizeMode: 'contain' }} />
                            </View>
                            <Text style={styles.titleText}>Login</Text>
                        </View>
                        <View style={styles.section2}>
                            <CustomTextInput
                                rules={{ required: 'Username or email is required.', }}
                                control={control}
                                name={'username'}
                                placeholder={'Username or Email'}
                                leftIcon={'person'}
                                iconType={'ionicon'}
                            />
                            <CustomTextInput
                                rules={{ required: 'Password is required.' }}
                                control={control}
                                name={'password'}
                                placeholder={'Enter your password'}
                                leftIcon={'lock-closed'}
                                iconType={'ionicon'}
                                secureTextEntry={true}
                            />
                            <View style={styles.link}>
                                {
                                    !isBiometric && biometryType ?
                                        <View style={{ flexDirection: 'row', alignSelf: "flex-start", alignItems: 'center', }}>
                                            <ToggleSwitch
                                                isOn={switchBioMetric}
                                                onColor="#5ed34b"
                                                offColor="lightgrey"
                                                size="small"
                                                onToggle={isOn => {
                                                    setSwitchBioMetric(isOn);
                                                    if (isOn == true) AsyncStorage.setItem('@biometric', 'true');
                                                }}
                                                animationSpeed={200}
                                            />
                                            <Text style={{ color: Colors.Charcol, fontSize: hp(1.5), marginStart: 5 }}>{`Use Biometric`}</Text>
                                        </View>
                                        : <View></View>
                                }
                                <TouchableWithoutFeedback onPress={() => navigation.navigate('ForgotPassword')}>
                                    <Text style={styles.fotgotTextStyle}>Forgot Password</Text>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <View style={styles.section3}>
                            <CustomButton
                                title={'Login'}
                                backgroundColor={isValid ? Colors.ThemeColor : Colors.LightestGrey}
                                color={isValid ? Colors.White : Colors.ThemeColor}
                                onPress={handleValidate(onFormSubmit)}
                                loading={loading && loaderState == "default"}
                            />
                            <CustomButton
                                title={'Continue with Google'}
                                backgroundColor={Colors.ThemeColor}
                                color={Colors.White}
                                onPress={() => handleGoogle("google")}
                                icon={Icons.google}
                                loading={loading && loaderState == "google"}
                            />
                            <CustomButton
                                title={'Continue with Facebook'}
                                backgroundColor={Colors.ThemeColor}
                                color={Colors.White}
                                onPress={() => handleFacebook("facebook")}
                                icon={Icons.facebook}
                                loading={loading && loaderState == "facebook"}
                            />
                            {Platform.OS == "ios" && <AppleButton
                                buttonStyle={AppleButton.Style.BLACK}
                                buttonType={AppleButton.Type.CONTINUE}
                                style={{
                                    width: "100%", // You must specify a width
                                    height: hp('5.5'),
                                    marginVertical: 10,// You must specify a height
                                }}
                                onPress={() => handleAppple()}
                            />}
                            {isBiometric && biometryType ?
                                <TouchableOpacity style={{ flexDirection: 'row', width: '55%', alignItems: 'center', justifyContent: "space-evenly", }} onPress={handleBioMetric}>
                                    <Text style={{ fontSize: hp(2), color: Colors.Charcol, fontFamily: 'Poppins-Regular' }}>
                                        Login with {biometryType !== 'FaceID' ? Platform.OS != 'ios' ? 'Finger Print' : 'Touch ID' : "Face ID"}
                                    </Text>
                                    {biometryType !== 'FaceID' ?
                                        <Icon type="material" name="fingerprint" color={Colors.Charcol} size={25} onPress={handleBioMetric} />
                                        :
                                        <Image source={Icons.faceId} style={{ width: 25, height: 25, tintColor: Colors.Charcol }} />
                                    }
                                </TouchableOpacity> :
                                null}
                        </View>
                    </View>
                    <View style={styles.box2}>

                        <View style={styles.section5}>

                            <Text style={styles.textStyle}>Don't have an account?</Text>
                            <TouchableWithoutFeedback onPress={() => navigation.navigate('SelectSignupOption')}>
                                <Text style={styles.linkStyle}>Sign Up</Text>
                            </TouchableWithoutFeedback>
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
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
        flex: 3,
        padding: wp(5),
        justifyContent: "center",
    },
    box2: {
        flex: .5,
        justifyContent: "center",
    },
    section1: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "space-evenly",
        flexDirection: 'column',
    },
    section2: {
        flex: 1,
        justifyContent: "center",
        // alignItems: 'center',
        flexDirection: 'column',
    },
    section3: {
        justifyContent: "space-around",
        alignItems: 'center',
        flexDirection: 'column',
        marginVertical:scale(10)
    },
    section4: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        flexDirection: 'column',
    },
    section5: {
        flex: .6,
        justifyContent: "space-around",
        alignItems: 'center',
        flexDirection: 'column',
    },
    link: {
        paddingVertical: hp(.5),
        flexDirection: "row",
        width: wp("90%"),
        justifyContent: "space-between"
    },
    fotgotTextStyle: {
        fontSize: hp(1.5),
        color: Colors.Grey,
        fontFamily: 'Poppins-Regular',
    },
    linkStyle: {
        color: Colors.LightestBlue,
        fontSize: hp(2),
        fontFamily: 'Poppins-Medium',
    },
    textStyle: {
        color: Colors.Grey,
        fontSize: hp(1.5),
        fontFamily: 'Poppins-Regular',
    },
    titleText: {
        color: Colors.LightestBlue,
        fontSize: scale(25),
        textAlign: 'center',
        paddingBottom: scale(10),
        fontFamily: 'Poppins-Medium',
    },
});