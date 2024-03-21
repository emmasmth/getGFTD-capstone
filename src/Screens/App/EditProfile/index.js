
import React, { useState, useEffect } from 'react'
import { Modal, View, Text, StyleSheet, StatusBar, Image, Platform, PermissionsAndroid, ScrollView, TouchableWithoutFeedback, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Pressable, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';


// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AppButton from '../../../Constants/Button';
import AppTextInput from '../../../Constants/TextInput';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from 'react-native-elements';
import { useContext } from 'react';
import { adduserdata } from '../../../Redux/UserReducer';
import { Alert } from 'react-native';
// import DatePicker from 'react-native-date-picker'


// Constants----------------------------------------------------------------
import AppHeader from '../../../Constants/Header';
import { AuthContext } from '../../../Context';

// Utils----------------------------------------------------------------
import { Icons, Images } from '../../../Assets';
import { Colors, US_STATES } from '../../../Utils';
import moment from 'moment';
import { Service } from '../../../Config/Services';
import analytics from '@react-native-firebase/analytics';
import { addprofileimage } from '../../../Redux/ProfileReducer';
import { oreintation } from '../../../Helper/NotificationService';
import { useFocusEffect } from '@react-navigation/native';
import UserAgent from 'react-native-user-agent';
import { useNetInfo } from '@react-native-community/netinfo';
import { FlatList } from 'react-native';
import filter from 'lodash.filter';
import DropDownPicker from 'react-native-dropdown-picker';
import { update_signup_status } from '../../../Redux/SignupStatusReducer';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function EditProfile({ navigation, route }) {
    const dispatch = useDispatch();
    const adduserData = (data) => dispatch(adduserdata(data));
    const updateProfileImage = data => dispatch(addprofileimage(data));
    const updateSigninStatus = data => dispatch(update_signup_status(data));
    const { trackData } = useContext(AuthContext);


    const { updateProfile } = useContext(AuthContext);
    const userDetails = useSelector(state => state.UserReducer);
    const [filePath, setFilePath] = useState('');
    const [imagePath, setImagePath] = useState('');
    const [displayName, setDisplayName] = useState(userDetails != null ? userDetails.name : '');
    const [username, setUserName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [loading, setloading] = useState(false);
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [ssn, setSsn] = useState('');
    const [validationMessage, setValidationMessage] = useState('');
    const [postalCode, setPostalCode] = useState('');
    //const [status, setStatus] = useState(Boolean);
    const [accStat, setAccStat] = useState("")
    const [isVisible, setIsVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isStateSelected, setIsStateSelected] = useState('');
    const [info, setInfoMessage] = useState('');
    const apiToken = userDetails?.api_token;
    const [userData, setUserData] = useState({})





    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const netInfo = useNetInfo();



    const checkDetails = async () => {
        if (!!apiToken) await Service.ProfileInfo(apiToken, setloading, setUserData)
    }

    useEffect(() => {
        // testing console console.log('effect userData===>', userData)
        setFirstName(userData != null ? userData.f_name : '')
        setLastName(userData != null ? userData.l_name : '')
        setUserName(userData != null ? userData.username : '')
        setEmail(userData != null ? userData.email : '')
        setCity(userData != null ? userData.city : '')
        setCountry(userData != null ? userData.country : '')
        setState(userData != null ? userData.state : '')
        setIsStateSelected(userData != null ? userData.state : '')
        setLastName(userData != null ? userData.l_name : '')
        setDateOfBirth(userData.dob != null ? moment(userData.dob).format('YYYY-MM-DD') : '')
        setPostalCode(userData != null ? userData.postal_code : '')
        setAddress(userData != null ? userData.address : '')
        setSsn(userData != null && !!userData.ssn ? userData.ssn.toString().replace(/.(?=.{4,}$)/g, '*') : '')
    }, [userData])
    const getProfileImage = async () => {
        await Service.GetProfileImage(apiToken, setFilePath, updateProfileImage, setloading);
    };

    const callAfterTenSeconds = async () => {
        setTimeout(function () {
            Service.GetStripStatus(apiToken, updateSigninStatus)
        }, 10000);
    }

    useEffect(() => {
        getProfileImage();
        checkDetails()
        return () => {
            setImagePath('');
            setFilePath('');
        }
    }, []);

    useFocusEffect(() => {
        if (!!apiToken) trackData(apiToken, 'Page Viewed', 'Edit profile');
    });



    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );
                // If CAMERA Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.log('requestCameraPermission error', err);
                return false;
            }
        } else return true;
    };

    const requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs write permission',
                    },
                );
                // If WRITE_EXTERNAL_STORAGE Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.log('requestExternalWritePermission error', err);
                alert('Write permission err', err);
            }
            return false;
        } else return true;
    };

    const captureImage = async (type) => {
        let options = {
            //   mediaType: type,
            maxWidth: 300,
            maxHeight: 550,
            quality: 0.8,
            includeBase64: true,
        };
        let isCameraPermitted = await requestCameraPermission();
        let isStoragePermitted = await requestExternalWritePermission();
        if (isCameraPermitted && isStoragePermitted) {
            launchCamera(options, (response) => {
                // console.log('Response = ', response);

                if (response.didCancel) {
                    // alert('User cancelled camera picker');
                    return;
                } else if (response.errorCode == 'camera_unavailable') {
                    // alert('Camera not available on device');
                    return;
                } else if (response.errorCode == 'permission') {
                    alert('Permission not satisfied');
                    return;
                } else if (response.errorCode == 'others') {
                    alert(response.errorMessage);
                    return;
                }
                const source = `data:image/jpeg;base64,` + response.assets[0].base64;
                setFilePath(source);
                setImagePath(source);

            });
        };
    };
    const chooseFile = (type) => {
        let options = {
            maxWidth: 300,
            maxHeight: 550,
            quality: 0.8,
            includeBase64: true,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                return;
            } else if (response.errorCode == 'permission') {
                return;
            } else if (response.errorCode == 'others') {
                alert(response.errorMessage);
                return;
            };
            const source = `data:image/jpeg;base64,` + response.assets[0].base64;
            setFilePath(source);
            setImagePath(source);
        });
    };

    const handleupdate = async () => {
        if (password && password.length < 8) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Password must be greater than 8 characters',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        }
        if (confirmPassword && confirmPassword.length < 8) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'confirm Password must be greater than 8 characters',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        }
        if (address == "" || address == null) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Address can not be empty',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        }

        if (country == "") {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Country can not be empty',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        }
        if (city == "" || city == null) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'City can not be empty',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        }

        if (postalCode == "" || postalCode == null) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Postal code can not be empty',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        }

        if (ssn == "" || ssn == null) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'SSN can not be empty',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        }

        if (state == "" || state == null) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'State can not be empty',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        }


        if (password !== confirmPassword) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Password do not match!',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        };
        const data = {
            profile_type: '2',
            username: username,
            email: email.toLowerCase(),
            f_name: firstName,
            l_name: lastName,
            email: email.toLowerCase(),
            dob: moment(dateOfBirth).format('YYYY-MM-DD'),
            address: address,
            postal_code: postalCode,
            city: city,
            country: "US",
            state: state,
            ssn: ssn,
            user_agent: UserAgent.getUserAgent(),
            ip: await netInfo.details.ipAddress,
        };
        await analytics().logEvent('profile_update', {
            profile_type: '2',
        })
        if (password != '') Object.assign(data, { password: password, });
        if (imagePath != '') Object.assign(data, { image: filePath, });
        console.log("dataa edit", data)
        await updateProfile(data, apiToken, navigation, adduserData, setloading, getProfileImage, callAfterTenSeconds,);
    };


    const [query, setQuery] = useState('');
    const [found, setFound] = useState('');
    const [onStateOpen, setOnStateOpen] = useState('');
    const [stateOpen, setStateOpen] = useState('');
    const [stateList, setStateList] = useState(US_STATES);

    const handleSearch = text => {
        const formattedQuery = text.toLowerCase();

        const filteredData = filter(US_STATES, user => {
            return contains(user, formattedQuery);
        });

        setStateList(filteredData);

        setQuery(text);

        setFound(!!filteredData && `Not found ${text}`);
    };

    const contains = (user, query) => {
        const { name } = user;

        if (name.toLowerCase().includes(query)) {
            return true;
        }
        return false;
    };



    return (
        <>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />
            <AppHeader onPressed={() => navigation.goBack()} leftIcon={Icons.backarrow} text="EDIT PROFILE" rightColor />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View style={styles.container}>
                    <ScrollView>
                        <View style={{ flex: .5, backgroundColor: Colors.White, justifyContent: 'center' }}>
                            {filePath == '' ?
                                <>
                                    <TouchableWithoutFeedback onPress={captureImage}>
                                        <View style={{ margin: 20, alignSelf: 'center', flexDirection: 'column', backgroundColor: Colors.White, alignItems: 'center', width: 140, height: 140, justifyContent: 'center', shadowRadius: 10, shadowColor: Colors.Grey, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 8 }, borderRadius: 100, elevation: 10 }}>
                                            <Text style={{ color: Colors.Charcol, fontSize: hp(1.8), fontFamily: 'Poppins-Regular' }}>Upload Image</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 5 }}>
                                        <TouchableOpacity onPress={captureImage} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', }}>
                                            <Icon type="material" name="camera" color={Colors.LightestBlue} size={22} />
                                            <Text style={{ color: Colors.Charcol, fontSize: hp(1.8), fontFamily: 'Poppins-Regular' }}>Camera</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={chooseFile} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', }}>
                                            <Icon type="material" name="image" color={Colors.LightestBlue} size={22} />
                                            <Text style={{ color: Colors.Charcol, fontSize: hp(1.8), fontFamily: 'Poppins-Regular' }}>Gallery</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                                :
                                <>
                                    <TouchableWithoutFeedback onPress={captureImage}>
                                        <View style={{ margin: 20, alignSelf: 'center', flexDirection: 'column', backgroundColor: Colors.White, alignItems: 'center', width: 140, height: 140, justifyContent: 'center', shadowRadius: 10, shadowColor: Colors.Grey, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 8 }, borderRadius: 100, elevation: 10 }}>
                                            {loading ? <ActivityIndicator size="small" color={Colors.LightestBlue} /> : <Image source={filePath != '' ? { uri: filePath } : Images.userProfile} style={{ width: 140, height: 140, resizeMode: 'cover', borderRadius: 100 }} />}
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 5 }}>
                                        <TouchableOpacity onPress={captureImage} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', }}>
                                            <Icon type="material" name="camera" color={Colors.LightestBlue} size={22} />
                                            <Text style={{ color: Colors.Charcol, fontSize: hp(1.8), fontFamily: 'Lato-Regular' }}>Camera</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={chooseFile} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', }}>
                                            <Icon type="material" name="image" color={Colors.LightestBlue} size={22} />
                                            <Text style={{ color: Colors.Charcol, fontSize: hp(1.8), fontFamily: 'Lato-Regular' }}>Gallery</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            }

                        </View>
                        <View style={{ flex: 1, }}>
                            <View style={{ alignSelf: "center", marginHorizontal: 25, marginVertical: 10 }}>
                                <TouchableOpacity onPress={() => navigation.navigate('ChangeNumber')} style={{ width: oreintation == "LANDSCAPE" ? wp(20) : wp(35), height: oreintation == "LANDSCAPE" ? hp(5) : hp(4.5), backgroundColor: Colors.LightestBlue, alignItems: 'center', justifyContent: "center", borderRadius: 100 / 2, elevation: 10, shadowColor: Colors.Grey, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 8 }, shadowRadius: 10 }}>
                                    <Text style={{ fontSize: hp(1.6), fontFamily: 'Poppins-Regular', color: Colors.White }}>Change Number</Text>
                                </TouchableOpacity>
                                {/* <AppTextInput value={displayName} onChangedText={setDisplayName} placeholder="Display Name" /> */}
                            </View>

                            <View style={{ left: 10, paddingTop: 5 }}>
                                <View style={{ zIndex: 100, padding: 10 }}>
                                    <Text
                                        style={{
                                            position: 'absolute',
                                            left: 10,
                                            padding: 10,
                                            backgroundColor: 'white',
                                            paddingHorizontal: 5,
                                            fontFamily: "Poppins-Medium",
                                            fontSize: hp(1.7),
                                            color: Colors.LightBlue,
                                            // fontWeight: "600"

                                        }}>
                                        Profile Information
                                    </Text>
                                </View>
                                <View
                                    style={{

                                        borderWidth: 1.5,
                                        borderColor: Colors.LightBlue,
                                        flexDirection: "column",
                                        borderRadius: 10,
                                        paddingHorizontal: 5,
                                        // paddingTop: 5,
                                        //height:hp(30),
                                        width: wp(95),
                                        paddingBottom: 30

                                    }}>
                                    <View style={{ top: 20 }}>
                                        <View style={{ alignSelf: 'center' }}>
                                            <AppTextInput value={username} onChangedText={setUserName} placeholder="User Name" />
                                        </View>
                                        <View style={{ alignSelf: 'center' }}>
                                            <AppTextInput value={email} onChangedText={setEmail} placeholder="Email" />
                                        </View>
                                        <View style={{ alignSelf: 'center' }}>
                                            <AppTextInput secureEntry value={password} icon onChangedText={setPassword} placeholder="Password" />
                                        </View>
                                        <View style={{ alignSelf: 'center' }}>
                                            <AppTextInput secureEntry value={confirmPassword} icon onChangedText={setConfirmPassword} placeholder="Confirm Password" />
                                        </View>
                                    </View>
                                </View>


                                <View style={{ right: 10, alignSelf: 'center' }}>
                                    <AppButton onPressed={handleupdate} loading={loading} text="Update" xlarge />
                                </View>
                            </View>
                        </View>
                        <View style={{ flex: 1, height: 50 }} />
                    </ScrollView>
                </View >
                <DateTimePickerModal
                    isVisible={open}
                    mode="date"
                    onConfirm={(date) => {
                        setOpen(false)
                        setDate(date)
                        setDateOfBirth(date)
                    }}
                    onCancel={() => {
                        setOpen(false)
                    }}
                />
                {/* <DatePicker
                    modal
                    mode="date"
                    open={open}
                    date={date}
                    onConfirm={(date) => {
                        setOpen(false)
                        setDate(date)
                        setDateOfBirth(date)
                    }}
                    onCancel={() => {
                        setOpen(false)
                    }}
                /> */}

            </KeyboardAvoidingView >
            <Modal animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={() => {
                    setIsVisible(!isVisible);
                }}>
                <View style={{
                    justifyContent: 'space-between',
                    top: hp(20),
                    padding: wp(5),
                    borderRadius: 20,
                    width: wp('85%'),
                    height: hp(40),
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
                            color: Colors.Grey,
                            fontFamily: 'Poppins-SemiBold'
                        }}>Info</Text>
                        <Icon type="material" name="close" color={Colors.Grey} onPress={() => setIsVisible(!isVisible)} />

                    </View>
                    <View style={{ flex: 1, marginVertical: 20 }}>
                        <Text style={{ color: Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(1.8) }}>
                            {info}
                        </Text>
                        <Image source={Images.SsnLogo} style={{ top: 20, height: 180, width: 280, resizeMode: "stretch", borderRadius: 8, }} />
                    </View>
                </View>
            </Modal>
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    datePickerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        height: hp(5.5),
        width: oreintation == "LANDSCAPE" ? wp('95%') : wp('90%'),
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
    }
})