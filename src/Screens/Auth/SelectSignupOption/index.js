import React, { useContext, useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, } from 'react-native';
import { Icons } from '../../../Assets';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import analytics from '@react-native-firebase/analytics';

// Constants----------------------------------------------------------------
import { Colors } from '../../../Utils';

// Services----------------------------------------------------------------
import { AuthContext } from '../../../Context';
import { adduserdata } from '../../../Redux/UserReducer';
import { useIsFocused } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import CustomButton from '../../../Constants/CustomButton';
import messaging from '@react-native-firebase/messaging';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { addsignupdata } from '../../../Redux/SignupReducer';
import auth from '@react-native-firebase/auth';
import {
    GraphRequest,
    AccessToken,
    GraphRequestManager,
    LoginManager,
} from 'react-native-fbsdk-next';
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';
import jwt_decode from 'jwt-decode';

export default function SelectSignupOption({ navigation }) {
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const adduserData = (data) => dispatch(adduserdata(data));
    const { signIn } = useContext(AuthContext);
    const [deviceToken, setDeviceToken] = useState('');
    const [loading, setloading] = useState(false);


    useEffect(() => {
        AsyncStorage.getItem('@fcmToken').then(response => setDeviceToken(response));
        auth().signOut();
    }, [isFocused]);


    const {
        control,
        handleSubmit: handleValidate,
        formState: { isValid },
    } = useForm();

    const handleGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            await GoogleSignin.signIn()
                .then(userInfo => {
                    const socialInfo = {
                        full_name: userInfo.user.givenName,
                        email: userInfo.user.email,
                        username: userInfo.user.name.split(" ").join(''),
                        mobile: "",
                        password: userInfo.user.id,
                        device_token: "",
                        social_access_token: userInfo.user.id,
                    }
                    // console.log('GoogleSignin Response===>',socialInfo)
                    dispatch(addsignupdata({ ...socialInfo, type: 'social' }));
                    navigation.navigate('SignUp');
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
    const handleApple = (state) => {
        appleAuth
            .performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
            }).then(async appleAuthRequestResponse => {
                let { identityToken, email, fullName } = appleAuthRequestResponse;
                console.log('=================================');
                console.log('apple login data  email==>', email);
                console.log('=================================');
                console.log('=================================');
                console.log('apple login data  fullname==>', fullName);
                console.log('=================================');
                let decoded_token = jwt_decode(identityToken);
                let nonce = decoded_token.sub;
                // await AsyncStorage.setItem("appleEmail", email);
                const socialInfo = {
                    full_name: `${fullName.givenName} ${fullName.familyName}`,
                    email: email,
                    username: `${fullName.givenName}${fullName.familyName}`,
                    mobile: "",
                    password: nonce,
                    social_access_token: nonce,
                    device_token: "",
                }
                dispatch(addsignupdata({ ...socialInfo, type: 'social' }));
                navigation.navigate('SignUp');
            }).catch(error => console.log("error in login with apple", error))

    }



    // export const FacebookSignin = setModalVisible => {
    //     return async dispatch => {
    //       LoginManager.logInWithPermissions([
    //         'public_profile',
    //         'email',
    //         'user_friends',
    //       ]).then(
    //         result => {
    //           console.log('====================================');
    //           console.log(`Login manager result ${result}`);
    //           console.log('====================================');
    //           if (result.isCancelled) {
    //             console.log('Login cancel from facebook');
    //           } else {
    //             console.log('fb login success');
    //           }

    //           AccessToken.getCurrentAccessToken().then(data => {
    //             console.log('====================================');
    //             console.log(`access token :  ${data}`);
    //             console.log('====================================');
    //             let accessToken = data.accessToken;
    //             // setToken(accessToken);

    //             const responseInfoCallback = (error, result) => {
    //               if (error) {
    //                 console.log('Error fetching data: ' + error.toString());
    //               } else {
    //                 const obj = {
    //                   email: result.email ? result.email : '',
    //                   firstName: result.first_name,
    //                   lastName: result.last_name,
    //                   picUrl: result.picture.data.url,
    //                   uid: result.id,
    //                 };
    //                 dispatch(SocialLogin(obj, setModalVisible));
    //                 console.log('ressss', result.id);
    //               }
    //             };
    //             const infoRequest = new GraphRequest(
    //               '/me',
    //               {
    //                 accessToken: accessToken,
    //                 parameters: {
    //                   fields: {
    //                     string: 'email,name,first_name,middle_name,last_name,picture',
    //                   },
    //                 },
    //               },
    //               responseInfoCallback,
    //             );
    //             new GraphRequestManager().addRequest(infoRequest).start();
    //           });
    //         },
    //         function (error) {
    //           console.log('==> Facebook Login fail with error: ' + error);
    //         },
    //       );
    //     };
    //   };

    const handleFacebook = async () => {
        LoginManager.logInWithPermissions([
            'public_profile',
            'email',
        ]).then(result => {
            console.log('====================================');
            console.log(result);
            console.log('====================================');
            if (result.isCancelled) {
                console.log('Login cancel from facebook');
            } else {
                console.log('fb login success');
            }
            AccessToken.getCurrentAccessToken().then(data => {
                console.log('====================================');
                console.log(`access token :  ${data}`);
                console.log('====================================');
                let accessToken = data.accessToken;
                // setToken(accessToken);

                const responseInfoCallback = (error, userInfo) => {
                    if (error) {
                        console.log('Error fetching data: ' + error.toString());
                    } else {

                        const socialInfo = {
                            full_name: `${userInfo.first_name} ${userInfo.last_name}`,
                            email: userInfo.email,
                            username: userInfo.first_name + userInfo.last_name,
                            mobile: "",
                            password: userInfo.id,
                            social_access_token: userInfo.id,
                            device_token: "",
                        }
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

    const onFormSubmit = useCallback(async (data) => {
        const device_token = await messaging().getToken();
        if (device_token !== null && device_token !== undefined) {
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
                <ScrollView contentContainerStyle={{ flex: 1 }} >
                    <View style={styles.box1}>
                        <View style={styles.section1}>
                            <Image source={Icons.logoIcon} style={{ width: 75, height: 75, resizeMode: 'contain' }} />
                            <Text style={styles.logoText}>Sign Up</Text>
                        </View>
                        <View style={styles.section3}>
                            <CustomButton
                                title={'Continue with Phone'}
                                backgroundColor={Colors.ThemeColor}
                                color={Colors.White}
                                onPress={() => navigation.navigate('SignUp')}
                                loading={loading}
                            />
                            <View style={styles.lineBreakView}>
                                <View style={styles.lineBreak} />
                                <Text style={styles.or}>OR</Text>
                                <View style={styles.lineBreak} />

                            </View>
                            <CustomButton
                                title={'Continue with Google'}
                                backgroundColor={Colors.Blue}
                                color={Colors.White}
                                onPress={handleGoogle}
                                icon={Icons.google}
                                loading={loading}
                            />
                            <CustomButton
                                title={'Continue with Facebook'}
                                backgroundColor={Colors.Blue}
                                color={Colors.White}
                                onPress={handleFacebook}
                                icon={Icons.facebook}
                                loading={loading}
                            />
                            {Platform.OS == "ios" && <AppleButton
                                buttonStyle={AppleButton.Style.BLACK}
                                buttonType={AppleButton.Type.CONTINUE}
                                style={{
                                    width: "100%", // You must specify a width
                                    height: hp('5.5'),
                                    marginVertical: 10,// You must specify a height
                                }}
                                onPress={() => handleApple()}
                            />}
                        </View>
                    </View>
                    <View style={styles.box2}>
                        <View style={styles.section5}>
                            <Text style={styles.textStyle}>Already have an account?</Text>
                            <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.linkStyle}>Sign In</Text>
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
    section3: {
        justifyContent: "space-around",
        alignItems: 'center',
        flexDirection: 'column',
    },
    section5: {
        flex: .6,
        justifyContent: "space-around",
        alignItems: 'center',
        flexDirection: 'column',
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
    logoText: {
        color: Colors.LightestBlue,
        fontSize: hp(2.8),
        fontFamily: 'Poppins-Medium',
    },
    lineBreakView: {
        width: wp(88),
        marginVertical: hp(1),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    lineBreak: {
        height: 1,
        width: wp(40),
        backgroundColor: Colors.LightestGrey
    },
    or: {
        fontFamily: "Poppins-SemiBold",
        color: Colors.Grey,
        fontSize: hp(2)
    },
});