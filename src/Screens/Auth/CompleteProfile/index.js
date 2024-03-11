import React, { useState, useContext, useEffect, useCallback } from 'react'
import { NativeModules, View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar, Image, KeyboardAvoidingView, TouchableWithoutFeedback, TouchableOpacity, Platform, Linking, TextInput, Pressable, ActivityIndicator, Keyboard, } from 'react-native';
import { Icons, Images } from '../../../Assets';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import messaging, { firebase } from '@react-native-firebase/messaging';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import {
    LoginManager,
    Profile,
} from 'react-native-fbsdk-next';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import Modal from 'react-native-modal';

// Stats----------------------------------------------------------------
import { adduserdata } from '../../../Redux/UserReducer';
import { AuthContext } from '../../../Context';

// Constants----------------------------------------------------------------
import CustomTextInput from '../../../Constants/CustomTextInput';
import CustomDropdown from '../../../Constants/CustomDropDownPicker';
import CustomDatePicker from '../../../Constants/CustomDatePicker';
import CustomButton from '../../../Constants/CustomButton';

// Utils----------------------------------------------------------------
import { Colors, EMAIL_REGEX, US_STATES } from '../../../Utils';
import { Icon } from 'react-native-elements';
import { oreintation } from '../../../Helper/NotificationService';
import auth from '@react-native-firebase/auth';
import UserAgent from 'react-native-user-agent';
import { useNetInfo } from '@react-native-community/netinfo';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { initStripe } from '@stripe/stripe-react-native';
import {
    useStripe,
} from '@stripe/stripe-react-native';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import CustomSSNTextInput from '../../../Constants/CustomSSNTextInput';
import moment from 'moment';

const { RNUserAgent } = NativeModules;
GoogleSignin.configure();

const formSchema = yup
    .object({
        f_name: yup.string().required('First name is required'),
        l_name: yup.string().required('Last name is required'),
        address: yup.string().required('Address is required'),
        state: yup.string().required('State is required'),
        city: yup.string().required('City is required'),
        postal_code: yup.string().required('Postal code is required'),
        dob: yup.string().required('Date of birth is required'),
        ssn: yup.string().required('SSN is required'),
        username: yup.string()
            .required('Username is required'),
        email: yup.string().required('Email is required').email("Please enter valid email address")
            .matches(EMAIL_REGEX, "Invalid email"),
        password: yup.string()
            .min(8, "Password should be greater than 8 characters.")
            .required('Password is required.'),
        cpassword: yup.string()
            .min(8, "Password should be greater than 8 characters.")
            .oneOf([yup.ref('password')], 'Passwords do not match.')
            .required('Confirm password is required.'),
    })

export default function SignupInfo({ navigation }) {
    const dispatch = useDispatch();
    const adduserData = (data) => dispatch(adduserdata(data));
    const { completeProfile } = useContext(AuthContext)
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [ssn, setSsn] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [dob, setDob] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [loading, setloading] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');
    const signupDetails = useSelector(state => state.SignupReducer);
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(false);
    const [isSSNVisible, setIsSSNVisible] = useState(false);
    const [valideEmail, setValideEmail] = useState(false);
    const [stateOpen, setStateOpen] = useState(false);
    const [onStateOpen, setOnStateOpen] = useState(false);
    const [userAgentName, setUserAgentName] = useState("");
    const [info, setInfoMessage] = useState('');
    const [vSecret, setVSecret] = useState("");
    const [vid, setVid] = useState("")
    const stripe = useStripe();
    const netInfo = useNetInfo();
    const apiToken = signupDetails?.api_token;



    useEffect(() => {
        initStripe({
            publishableKey: 'pk_live_51HmqcVKfK9bEtGKX4KsbImeZ4A3jzf7yGTs51vKDRtTjc6QGIfQ0Lp7ZbJjJhiKhbbGqcqLhiPoVhipYzU8v3T7L00AFpVIIia',
            merchantIdentifier: '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',
            //urlScheme: "your-url-scheme",
        });
    }, [])

    const emailValidator = async (text) => {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        setValideEmail(reg.test(text))
        setEmail(text)

    }


    const handleContinue = async () => {
        setIsSSNVisible(true)
    };

    const {
        control,
        handleSubmit: handleValidate,
        formState: { isValid },
        setValue,
    } = useForm({
        defaultValues: {
            f_name: '',
            l_name: '',
            address: '',
            state: '',
            city: '',
            postal_code: '',
            dob: '',
            username: '',
            email: '',
            password: '',
            cpassword: '',
            ssn: '',
            referral_code: '',
        },
        resolver: yupResolver(formSchema),
        mode: "onSubmit"
    });

    const handleSignin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            setValue('f_name', userInfo.user.givenName)
            setValue('l_name', userInfo.user.familyName)
            setValue('username', userInfo.user.name.split(" ").join(''))
            setValue('email', userInfo.user.email);
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

    async function onFacebookButtonPress() {
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

        if (result.isCancelled) {
            throw 'User cancelled the login process';
        }

        await Profile.getCurrentProfile()
            .then(user => {
                setValue('f_name', user.firstName)
                setValue('l_name', user.lastName)
                setValue('username', user.name.split(" ").join(''))
                Platform.OS == 'ios' && setValue('email', user.email);
            })
            .catch(err => console.log('FB Login Error ===> ', err))
    }

    const onAppleButtonPress = async () => {
        // performs login request
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            // Note: it appears putting FULL_NAME first is important, see issue #293
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

        const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

        if (credentialState === appleAuth.State.AUTHORIZED) {
            if (appleAuthRequestResponse.email !== null) {

                const data = appleAuthRequestResponse;
                await AsyncStorage.setItem('@appleUserCreds', JSON.stringify(data));
                setValue('email', appleAuthRequestResponse.email);
                setValue('f_name', appleAuthRequestResponse.fullName.givenName)
                setValue('l_name', appleAuthRequestResponse.fullName.familyName)
                setValue('username', appleAuthRequestResponse.fullName.givenName.split(" ").join('').toLowerCase() + appleAuthRequestResponse.fullName.familyName.split(" ").join('').toLowerCase());
            }
            if (appleAuthRequestResponse.email === null) {
                await AsyncStorage.getItem('@appleUserCreds')
                    .then(value => {
                        const items = JSON.parse(value);
                        // console.log('@appleUserCreds ===>', items)
                        setValue('email', items.email);
                        setValue('f_name', items.fullName.givenName)
                        setValue('l_name', items.fullName.familyName)
                        setValue('username', items.fullName.givenName.split(" ").join('').toLowerCase() + items.fullName.familyName.split(" ").join('').toLowerCase());
                    })
            }
        }
    }

    const onFormSubmit = useCallback(async (data) => {
        // console.log(data)
        const device_token = await firebase.messaging().getToken();
        const formData = {
            profile_type: '1',
            f_name: data.f_name.trim(),
            l_name: data.l_name.trim(),
            username: data.username.trim(),
            address: data.address,
            postal_code: data.postal_code,
            city: data.city,
            country: "US",
            state: data.state,
            ssn: data.ssn,
            user_agent: UserAgent.getUserAgent(),
            ip: await netInfo.details.ipAddress,
            dob: data.dob,
            referral_code: data.referral_code.trim(),
            email: data.email.toLowerCase().trim(),
            password: data.password,
        };
        await completeProfile(formData, device_token, apiToken, navigation, setloading, adduserData, setIsSSNVisible);
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
                <ScrollView style={{ flex: 1, backgroundColor: Colors.White }} >
                    <View style={{ padding: 20, }}>
                        <View style={{
                            height: 220,
                            alignItems: 'center',
                            justifyContent: "space-around",
                            padding: 10,
                            margin: 10,
                        }}>
                            <Image source={Icons.logoIcon} style={{ width: 70, height: 70, resizeMode: 'contain', }} />
                            <Text style={[styles.logoText, {}]}>{'COMPLETE YOUR PROFILE'}</Text>
                            <View style={{
                                flexDirection: 'row',
                                width: 160,
                                alignItems: 'center',
                                justifyContent: 'space-around',
                            }}>
                                <TouchableOpacity onPress={handleSignin}>
                                    <Image source={Icons.google} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={onFacebookButtonPress}>
                                    <Image source={Icons.facebook} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
                                </TouchableOpacity>
                                {Platform.OS == 'ios' ? <TouchableOpacity onPress={onAppleButtonPress}>
                                    <Image source={Icons.apple} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
                                </TouchableOpacity> : null}
                            </View>
                        </View>

                        <View style={{
                            flexDirection: 'column',
                            borderWidth: 1.5,
                            borderColor: Colors.LightestBlue,
                            borderRadius: 10,
                            paddingHorizontal: 5,
                        }}>
                            <View style={{ marginTop: -23, paddingStart: 10, flexDirection: 'row', }}>
                                <Text
                                    style={{
                                        padding: 10,
                                        backgroundColor: Colors.White,
                                        paddingHorizontal: 5,
                                        fontFamily: "Poppins-Medium",
                                        fontSize: hp(1.8),
                                        color: Colors.LightestBlue,

                                    }}>
                                    Legal information
                                </Text>
                                <View style={{ backgroundColor: "white", alignSelf: "center", }}>
                                    <Icon style={{}} name="info" color={Colors.LightestBlue} onPress={() => {
                                        setIsVisible(!isVisible)
                                        setInfoMessage("Please Provide data as per your US ID ")
                                    }} />
                                </View>
                            </View>
                            <View style={{ padding: 10, }}>
                                <CustomTextInput
                                    control={control}
                                    name={'f_name'}
                                    placeholder={'Enter First Name'}
                                    leftIcon={'person'}
                                    iconType="ionicon"
                                />
                                <CustomTextInput
                                    control={control}
                                    name={'l_name'}
                                    placeholder={'Enter Last Name'}
                                    leftIcon={'person'}
                                    iconType="ionicon"
                                />
                                <CustomTextInput
                                    control={control}
                                    name={'address'}
                                    placeholder={'Enter Address'}
                                    leftIcon={'location'}
                                    iconType="ionicon"
                                />

                                <CustomDropdown
                                    control={control}
                                    zIndex={2000}
                                    name='state'
                                    title={'Select State'}
                                    items={US_STATES}
                                    onSelect={(text) => console.log('country', text)}
                                    leftIcon={'map'}
                                    iconType="ionicon"
                                />

                                <CustomTextInput
                                    control={control}
                                    name={'city'}
                                    placeholder={'Enter City'}
                                    leftIcon={'home-city'}
                                    iconType="material-community"
                                />
                                <CustomTextInput
                                    control={control}
                                    name={'postal_code'}
                                    placeholder={'Enter Postal Code'}
                                    leftIcon={'address'}
                                    iconType="entypo"
                                />
                                <CustomDatePicker
                                    control={control}
                                    name={'dob'}
                                />
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'column',
                            borderWidth: 1.5,
                            borderColor: Colors.LightestBlue,
                            borderRadius: 10,
                            paddingHorizontal: 5,
                            marginVertical: 20,
                            marginTop: 30
                        }}>
                            <View style={{ marginTop: -12, paddingStart: 10, width: 170, alignItems: "center" }}>
                                <Text
                                    style={{
                                        backgroundColor: 'white',
                                        paddingHorizontal: 5,
                                        fontFamily: "Poppins-Medium",
                                        fontSize: 15,
                                        color: Colors.LightestBlue,
                                    }}>
                                    Other information
                                </Text>
                            </View>
                            <View style={{ padding: 10, }}>
                                <CustomTextInput
                                    control={control}
                                    name={'username'}
                                    placeholder={'Enter Username'}
                                    leftIcon={'person'}
                                    iconType="ionicon"
                                />
                                <CustomTextInput
                                    control={control}
                                    name={'email'}
                                    placeholder={'Enter Your Email'}
                                    leftIcon={'mail'}
                                    iconType="ionicon"
                                />
                                <CustomSSNTextInput
                                    name={'ssn'}
                                    control={control}
                                    leftIcon={'security'}
                                    iconType="material-icon"
                                    onPress={handleContinue}
                                />
                                <CustomTextInput
                                    control={control}
                                    name={'referral_code'}
                                    placeholder={'Enter Referral Code'}
                                    leftIcon={'user-friends'}
                                    iconType="font-awesome-5"
                                />

                                <CustomTextInput
                                    control={control}
                                    name={'password'}
                                    placeholder={'Enter Your Password'}
                                    leftIcon={'lock'}
                                    iconType="material-community"
                                    secureTextEntry={true}
                                />
                                <CustomTextInput
                                    control={control}
                                    name={'cpassword'}
                                    placeholder={'Enter Your Confirm Password'}
                                    leftIcon={'lock'}
                                    iconType="material-community"
                                    secureTextEntry={true}
                                />
                            </View>
                        </View>
                        <CustomButton
                            title={'Continue'}
                            backgroundColor={isValid ? Colors.ThemeColor : Colors.LightestGrey}
                            color={isValid ? Colors.White : Colors.ThemeColor}
                            onPress={handleValidate(onFormSubmit)}
                            loading={loading}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <Modal
                isVisible={isVisible}
                onBackdropPress={() => {
                    setIsVisible(!isVisible);
                }}>
                <View style={{
                    justifyContent: 'space-between',
                    padding: wp(5),
                    borderRadius: 20,
                    width: wp('85%'),
                    height: hp(45),
                    alignSelf: 'center',
                    backgroundColor: 'white',
                    elevation: 10,
                    shadowOffset: { width: 0, height: 8 },
                    shadowColor: Colors.Grey,
                    shadowRadius: 10,
                    shadowOpacity: 0.3,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }} >
                        <Text style={{
                            fontSize: hp(2.5),
                            color: Colors.LightestBlue,
                            fontFamily: 'Poppins-SemiBold'
                        }}>Info</Text>
                        <Icon type="material" name="close" color={Colors.LightestBlue} onPress={() => setIsVisible(!isVisible)} />

                    </View>
                    <View style={{ flex: 1, marginVertical: 20, alignItems: "center" }}>
                        <Text style={{ color: Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(2) }}>
                            {info}
                        </Text>
                        <Image source={Images.SsnLogo} style={{ top: 30, height: 180, width: 280, resizeMode: "stretch", borderRadius: 8, }} />
                    </View>
                </View>
            </Modal>
            <Modal
                backdropColor='rgba(0,0,0,0.3)'
                isVisible={isSSNVisible}
                onRequestClose={() => {
                    setIsSSNVisible(!isSSNVisible);
                }}>
                <Pressable onPress={() => Keyboard.dismiss()}>
                    <View style={{
                        justifyContent: 'space-between',
                        top: -hp(3),
                        padding: wp(5),
                        borderRadius: 20,
                        width: wp('85%'),
                        height: hp(65),
                        alignSelf: 'center',
                        backgroundColor: Colors.White,
                        elevation: 10,
                        shadowOffset: { width: 0, height: 8 },
                        shadowColor: Colors.Grey,
                        shadowRadius: 10,
                        shadowOpacity: 0.3,
                    }}>
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}>
                            <Text style={{ color: Colors.Black, fontFamily: 'Poppins-Medium', fontSize: hp(2), textAlign: "center", }}>
                                <Text style={{ color: Colors.LightestBlue, fontFamily: 'Poppins-SemiBold', fontSize: hp(2), }}>GetGFTD</Text> process payments via <Text style={{ color: '#6057f7', fontSize: hp(2.3), fontWeight: 'bold' }}>stripe </Text>
                                which requires last 4 digits of your SSN. Your information is encrypted & protected under <Text onPress={() => { Linking.openURL('https://getgftd.io/privacy-policy'), setIsSSNVisible(false) }} style={{ color: Colors.LightestBlue, fontFamily: 'Poppins-SemiBold', fontSize: hp(2), }}>GetGFTD</Text> privacy policy.
                            </Text>
                            <Image source={Icons.shield} style={{ height: 100, width: 100, resizeMode: "stretch", borderRadius: 8, }} />
                            <View style={{ flexDirection: "column", alignItems: "center" }}>
                                <Text style={{ fontSize: hp(2), color: Colors.Grey, fontFamily: "Poppins-SemiBold" }}>Last 4 digits of SSN</Text>
                                <Controller
                                    control={control}
                                    name={'ssn'}
                                    // rules={{ required: 'SSN is required' }}
                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
                                        return (
                                            <>
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        backgroundColor: "white",
                                                        alignItems: "center",
                                                        width: wp(70),
                                                        height: hp(6),
                                                        justifyContent: "center",
                                                        borderColor:
                                                            error ? Colors.Red : Colors.Grey,
                                                        borderWidth: 1,
                                                        borderRadius: 8
                                                    }}>
                                                    <Text style={{ fontSize: hp(2.2), fontFamily: "Poppins-SemiBold", color: Colors.Grey }}>XXX-XX-</Text>
                                                    <TextInput maxLength={4}
                                                        style={{
                                                            fontSize: hp(2.2),
                                                            fontFamily: "Poppins-SemiBold",
                                                            color: Colors.Grey,
                                                            width: 70,
                                                            // height: hp(6), 
                                                        }}
                                                        placeholder='____'
                                                        placeholderTextColor={Colors.Grey}
                                                        onBlur={onBlur}
                                                        onChangeText={(text) => { setSsn(text), onChange(text) }}
                                                        value={value}
                                                        keyboardType="number-pad"
                                                    />
                                                </View>
                                                {error && (
                                                    <Text style={styles.error}>{error.message || 'Error'}</Text>
                                                )}
                                            </>
                                        )
                                    }}
                                />
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setIsSSNVisible(false)} style={{ backgroundColor: Colors.LightestBlue, width: wp(60), height: hp(6), alignItems: "center", justifyContent: "center", borderRadius: 8 }}>
                                    {loading == true ? <ActivityIndicator color={Colors.White} size={'small'} /> : <Text style={{ fontFamily: "Poppins-Medium", fontSize: hp(2), color: Colors.White }}>Confirm</Text>}
                                </TouchableOpacity>
                                <Pressable onPress={() => setIsSSNVisible(false)} style={{ width: wp(60), height: hp(5), alignItems: "center", justifyContent: "center", }}>
                                    <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: hp(2), color: Colors.Grey }}>Back</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView >
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
        flex: 1,
        justifyContent: "center",
    },
    box2: {
        justifyContent: "center",
    },
    section1: {
        alignItems: 'center',
        justifyContent: "space-around",
        flexDirection: 'column',
    },
    section2: {
        padding: 10,
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
    },
    section3: {
        flex: .2,
        justifyContent: "flex-end",
        alignItems: 'center',
        marginBottom: 20,
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
        color: Colors.Blue,
        fontSize: hp(2),
        fontFamily: 'Poppins-Regular',
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
    datePickerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        height: hp(5.5),
        width: oreintation == 'LANDSCAPE' ? wp('95%') : wp('90%'),
        backgroundColor: Colors.White,
        justifyContent: 'flex-start',
        borderRadius: 6,
        borderWidth: .5,
        borderColor: Colors.LightestGrey,
        marginVertical: 10,
        shadowOffset: { width: 0, height: 8 },
        shadowColor: Colors.Grey,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    error: {
        color: Colors.Red,
        alignSelf: 'stretch',
        fontFamily: 'Poppins-Regular',
        fontSize: hp(1.2)
    },
});