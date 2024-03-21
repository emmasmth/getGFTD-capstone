import React, { useState, useEffect, useContext, useRef } from 'react'
import { View, Text, Image, StyleSheet, StatusBar, Platform, TouchableOpacity, PermissionsAndroid, ActivityIndicator, TextInput, Animated, Easing } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { colors, Icon } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import Modal from "react-native-modal";
import { scale, verticalScale } from "react-native-size-matters"


// Constants----------------------------------------------------------------
import Dropdown from '../../../Constants/Dropdown';

// Utils----------------------------------------------------------------
import { Service } from '../../../Config/Services';
import { Icons, Images } from '../../../Assets';
import { Colors } from '../../../Utils';

// Stats----------------------------------------------------------------
import { addmyfriendlistdata } from '../../../Redux/MyFriendlistReducer';
import { adduserlistdata } from '../../../Redux/UserlistReducer';
import { adduserdata } from '../../../Redux/UserReducer';
import { AuthContext } from '../../../Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import AppTextInput from '../../../Constants/TextInput';
import Checkbox from '../../../Constants/Checkbox';
import { RadioButton } from 'react-native-paper';
import analytics from '@react-native-firebase/analytics';
import ImageView from 'react-native-image-view';
import { addprofileimage } from '../../../Redux/ProfileReducer';
import { oreintation } from '../../../Helper/NotificationService';
import { Keyboard } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import UserAgent from 'react-native-user-agent';
import { update_signup_status } from '../../../Redux/SignupStatusReducer';
import CreateWishModal from '../../../Constants/Modals/CreateWishModal';
import { transform } from '@babel/core';



function TutorialFive({ navigation, tutorialModal, setTutorialModal, tutoriaCount, setTutorialCount }) {
    return (
        <View>
            <Modal isVisible={tutorialModal}>
                <View style={{ flex: 1 }}>
                    {tutoriaCount == 0 ?
                        <TouchableOpacity
                            style={{ width: wp('90%'), height: hp(27), justifyContent: 'space-between', padding: 5, position: "absolute", bottom: Platform.OS == 'android' ? hp(9) : oreintation == "LANDSCAPE" ? hp(6.5) : hp(11.2), }}
                            onPress={() => {
                                setTutorialCount(tutoriaCount + 1);
                            }}>
                            <View style={{ width: wp('88%'), height: 65, borderRadius: 14, borderColor: Colors.White, borderWidth: 3, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ width: oreintation == "LANDSCAPE" ? wp('87%') : wp('85%'), height: 55, borderRadius: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                        <View style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: '#D0F4D5', alignItems: "center", justifyContent: "center" }}>
                                            <Icon name="user-friends" type="font-awesome-5" color={'#77C56B'} size={20} />
                                        </View>
                                        <Text style={[styles.text, { marginStart: 10 }]}>{'Find Friends'}</Text>
                                    </View>
                                    <Icon type="material" name="arrow-forward-ios" size={hp(2.7)} color={Colors.LightestBlue} />
                                </View>
                            </View>
                            <View style={{ alignItems: 'flex-start' }}>
                                <Icon name="arrowup" type="antdesign" style={{ marginLeft: 55 }} size={40} color={Colors.White} />
                            </View>
                            <View>
                                <Text style={{ fontSize: hp(2.3), fontFamily: 'Poppins-Regular', color: Colors.White }}>Tap here to find your friends &amp; add them to send GFTs.</Text>
                            </View>
                        </TouchableOpacity>
                        : tutoriaCount == 1 ?
                            <TouchableOpacity
                                style={{ width: wp('90%'), height: hp(30), justifyContent: 'space-between', padding: 5, position: "absolute", top: Platform.OS == 'android' ? hp(37.5) : oreintation == "LANDSCAPE" ? wp(23.3) : hp(38.2), }}
                                onPress={() => {
                                    setTutorialCount(tutoriaCount + 1);
                                }}
                            >
                                <View style={{ width: wp('88%'), height: 65, borderRadius: 14, borderColor: Colors.White, borderWidth: 3, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ width: oreintation == "LANDSCAPE" ? wp('87%') : wp('85%'), height: 55, borderRadius: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                            <View style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: '#D3E9FC', alignItems: "center", justifyContent: "center" }}>
                                                <Icon name="list-ul" type="font-awesome-5" color={'#6AB7F2'} size={20} />
                                            </View>
                                            <Text style={[styles.text, { marginStart: 10 }]}>{'My Wishlists'}</Text>
                                        </View>
                                        <Icon name={'angle-down'} type={'font-awesome-5'} size={hp(2.7)} color={Colors.LightestBlue} />
                                    </View>
                                </View>
                                <View style={{ alignItems: 'flex-start' }}>
                                    <Icon name="arrowup" type="antdesign" style={{ marginLeft: 55 }} size={40} color={Colors.White} />
                                </View>
                                <View>
                                    <Text style={{ fontSize: hp(2.3), fontFamily: 'Poppins-Regular', color: Colors.White }}>Tap here to manage and create new Wishlist.</Text>
                                </View>
                            </TouchableOpacity>
                            : tutoriaCount == 2 &&
                            <TouchableOpacity
                                onPress={async () => {
                                    setTutorialModal(false);
                                    setTutorialCount(0);
                                    await AsyncStorage.setItem('@tutorial_five', 'asd')
                                }}
                                style={{ flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", position: "absolute", top: Platform.OS === 'android' ? 4 : oreintation == "LANDSCAPE" ? -15 : 25, right: oreintation == "LANDSCAPE" ? -30 : -4, width: wp('90%'), height: hp(30), }}>
                                <View style={{ width: 65, height: 65, borderRadius: 14, borderColor: Colors.White, borderWidth: 3, marginLeft: 0, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ width: 45, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.White, }}>
                                        <Icon name="settings" type="ionicon" color={Colors.ThemeColor} />
                                    </View>
                                </View>
                                <Icon name="arrowup" type="antdesign" style={{ marginRight: 5 }} size={40} color={Colors.White} />
                                <Text style={{ top: hp(1), height: hp(10), fontSize: hp(2.3), fontFamily: 'Poppins-Regular', color: Colors.White, marginLeft: 10, }}>Tap here to edit your profile.</Text>
                            </TouchableOpacity>
                    }
                </View>
            </Modal>
        </View>
    );
}

export default function Profile(props) {
    const isFocus = useIsFocused();
    const userDetails = useSelector(state => state.UserReducer);
    console.log("userDetails ===>",userDetails.created_at);
    const slideAnimation = useRef(new Animated.Value(0)).current;
    const dispatch = useDispatch();
    const adduserData = (data) => dispatch(adduserdata(data));
    const addprofile = (data) => dispatch(addprofileimage(data));
    const [options, setOptions] = useState(false);
    const [filePath, setFilePath] = useState('');
    const [loading, setloading] = useState(false);
    const [btnLoading, setBtnloading] = useState(false);
    const [openDD, setOpenDD] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [wishlistsValue, setWishlists] = useState('');
    const apiToken = userDetails?.api_token;
    const [tutorialModal, setTutorialModal] = useState(false);
    const [tutorialCount, setTutorialCount] = useState(false);
    const [highlighted1, setHighlighted1] = useState(false);
    const [highlighted2, setHighlighted2] = useState(false);
    const [checkDetailsRes, setCheckDetailsRes] = useState({});
    const [accStat, setAccStat] = useState("")
    const [accMsg, setAccMsg] = useState("")
    const { navigation } = props;
    const { trackData, SignOut } = useContext(AuthContext);
    const [checked, setChecked] = useState('');

    const toggleDropdown = () => {
        Animated.timing(slideAnimation, {
            toValue: openDD ? 0 : 1, // Adjust the height as needed
            duration: 300,
            // Animation duration
            useNativeDriver: false, // Required for height animation
        }).start();
        setOpenDD(!openDD);
    };

    const getProfileImage = async () => {
        await Service.GetProfileImage(apiToken, setFilePath, addprofile, setloading);
    };

    const checkDetails = async () => {
        if (!!apiToken) await Service.CheckProfileDetail(apiToken, setAccStat, setAccMsg, setCheckDetailsRes)
    }

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
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.log('requestExternalWritePermission error', err);
                alert('Write permission err', err);
            };
            return false;
        } else return true;
    };
    const netInfo = useNetInfo();

    const captureImage = async (type) => {
        setOptions(false);
        let options = {
            maxWidth: 300,
            maxHeight: 550,
            quality: 0.8,
            includeBase64: true,
        };
        let isCameraPermitted = await requestCameraPermission();
        let isStoragePermitted = await requestExternalWritePermission();
        if (isCameraPermitted && isStoragePermitted) {
            launchCamera(options, async (response) => {
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
                setOptions(false);
                const data = {
                    profile_type: '2',
                    f_name: userDetails != null ? userDetails.f_name : '',
                    l_name: userDetails != null ? userDetails.l_name : '',
                    city: userDetails != null ? userDetails.city : '',
                    name: userDetails != null ? userDetails.name : '',
                    username: userDetails != null ? userDetails.username : '',
                    email: userDetails != null ? userDetails.email.toLowerCase() : '',
                    image: source,
                    dob: userDetails != null ? userDetails.dob : '',
                    address: userDetails != null ? userDetails.address : '',
                    postal_code: userDetails != null ? userDetails.postal_code : '',
                    country: "US",
                    state: userDetails != null ? userDetails.state : '',
                    ssn: userDetails != null ? userDetails.ssn : '',
                    user_agent: UserAgent.getUserAgent(),
                    ip: await netInfo.details.ipAddress,
                };
                await Service.updateMainProfile(data, apiToken, adduserData, setloading, getProfileImage);
            });
        };
    };

    const chooseFile = (type) => {
        setOptions(false);
        let options = {
            maxWidth: 300,
            maxHeight: 550,
            quality: 0.8,
            includeBase64: true,
        };
        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                return;
            } else if (response.errorCode == 'permission') {
                return;
            } else if (response.errorCode == 'others') {
                alert(response.errorMessage);
                return;
            }
            const source = `data:image/jpeg;base64,` + response.assets[0].base64;
            setFilePath(source);
            setOptions(false);

            const data = {
                profile_type: '2',
                f_name: userDetails != null ? userDetails.f_name : '',
                l_name: userDetails != null ? userDetails.l_name : '',
                name: userDetails != null ? userDetails.name : '',
                city: userDetails != null ? userDetails.city : '',
                username: userDetails != null ? userDetails.username : '',
                email: userDetails != null ? userDetails.email.toLowerCase() : '',
                image: source,
                dob: userDetails != null ? userDetails.dob : '',
                address: userDetails != null ? userDetails.address : '',
                postal_code: userDetails != null ? userDetails.postal_code : '',
                country: "US",
                state: userDetails != null ? userDetails.state : '',
                ssn: userDetails != null ? userDetails.ssn : '',
                user_agent: UserAgent.getUserAgent(),
                ip: await netInfo.details.ipAddress,
            };
            await Service.updateMainProfile(data, apiToken, adduserData, setloading, getProfileImage);
        });
    };

    const checkTutoralFive = async () => {
        const tutorialFive = await AsyncStorage.getItem('@tutorial_five');
        if (!!tutorialFive) {
            setTutorialModal(false)
        }
        if (tutorialFive == null) {
            setTutorialModal(true)
        }

    };

    useEffect(() => {
        Service.CheckToken(SignOut)
        if (!!userDetails.api_token) {
            checkTutoralFive();
            getProfileImage();
            if (!!apiToken) trackData(apiToken, 'Page Viewed', 'Profile');
        }
        return () => {
            clearState();
        }
    }, [isFocus]);

    useEffect(() => {
        checkDetails();
    }, [isFocus])

    const updateSignupStatus = state => dispatch(update_signup_status(state));
    const CustomHeader = () => {
        return (
            <View style={{ backgroundColor: Colors.LightestBlue, width: wp('100%'), height: hp(30), borderBottomLeftRadius: oreintation == 'LANDSCAPE' ? wp(4) : wp(10), borderBottomRightRadius: oreintation == 'LANDSCAPE' ? wp(4) : wp(10), shadowRadius: 20, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 8 }, shadowColor: Colors.Grey, elevation: 10, borderColor: Colors.LightestBlue, }}>
                <View style={{ flexDirection: 'row', width: wp('100%'), justifyContent: "space-between", padding: 10, top: 15, }}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                        <TouchableOpacity
                            onPress={() => {
                                // setTimeout(() => {
                                    navigation.goBack()
                                // }, 500)
                            }}
                            style={{ width: scale(35), height: scale(35), alignItems: "center", justifyContent: "center", backgroundColor: "white", borderRadius: scale(14) }}>
                            <Icon name="arrow-back" type="material" size={hp(3)} color={Colors.ThemeColor} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: oreintation == 'LANDSCAPE' ? 12 : 4, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: Colors.White, fontFamily: 'Poppins-SemiBold', fontSize: hp(2.2), }}>PROFILE</Text>
                    </View>
                    <View style={{ flex: 1, }} >
                        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ width: scale(35), height: scale(35), alignItems: "center", justifyContent: "center", backgroundColor: "white", borderRadius: scale(14) }}>
                            <Icon name="settings" type="material" size={hp(3)} color={Colors.ThemeColor} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
        );
    };

    const BaseView = () => {
        const [isImageViewVisible, setIsImageViewVisible] = useState(false);
        return (
            <View style={{ backgroundColor: Colors.White, width: wp('90%'), height: oreintation == 'LANDSCAPE' ? hp(65) : hp(63), alignSelf: "center", position: "absolute", top: hp(23.5), borderRadius: oreintation == 'LANDSCAPE' ? wp(2) : wp(5), shadowRadius: 10, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 8 }, shadowColor: Colors.Grey, elevation: 10 }} >
                <View style={{ width: 140, height: 140, backgroundColor: Colors.White, alignSelf: 'center', alignItems: 'center', justifyContent: "center", borderRadius: 200 / 2, borderWidth: 4, borderColor: Colors.LightestBlue, alignItems: 'center', position: 'absolute', top: -80 }}>
                    <TouchableOpacity onPress={() => setIsImageViewVisible(!isImageViewVisible)}>
                        <Image source={filePath != '' ? { uri: filePath } : Images.userProfile} style={{ width: 132, height: 132, resizeMode: 'cover', alignSelf: 'center', borderRadius: 200 / 2, }} />
                    </TouchableOpacity>
                    <ImageView
                        images={[
                            {
                                source: filePath != '' ? { uri: filePath } : Images.userProfile,
                                width: 806,
                                height: 806,
                            },
                        ]}
                        imageIndex={0}
                        isVisible={isImageViewVisible}
                        onClose={() => setIsImageViewVisible(false)}
                    />
                    <TouchableOpacity
                        onPress={() => setOptions(!options)}
                        style={{ width: 25, height: 25, backgroundColor: Colors.LightestBlue, alignItems: 'center', justifyContent: 'center', borderRadius: 100 / 2, position: 'absolute', bottom: 5, right: 10 }}>
                        <Icon type="material" name="edit" size={hp(2)} color={Colors.White} />
                    </TouchableOpacity>
                    {
                        options
                            ? <View style={{ position: 'absolute', zIndex: 2, bottom: -hp(11), right: -wp(24), backgroundColor: Colors.LightestGrey, height: hp(15), width: wp('32%'), justifyContent: 'space-around', padding: 5, borderRadius: 8, alignItems: 'flex-start' }}>
                                <View style={{ zIndex: 1, alignSelf: "flex-end", position: 'absolute', backgroundColor: '#000', borderRadius: 100, width: 20, height: 20, top: -5, right: -5, alignItems: "center" }}>
                                    <Icon name="close" type="material" size={20} color="white" onPress={() => setOptions(false)} />
                                </View>
                                <TouchableOpacity onPress={chooseFile}>
                                    <Text style={{ color: Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(1.8), }}>Upload Photo</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={captureImage}>
                                    <Text style={{ color: Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(1.8), }}>Take Photo</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('EditProfile')
                                    setOptions(false)
                                }}>
                                    <Text style={{ color: Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(1.8), }}>Edit Profile</Text>
                                </TouchableOpacity>
                            </View>
                            : null
                    }
                </View>

                <View style={{ flex: 1, top: 70, zIndex: -1 }}>
                    <Text style={{ color: Colors.LightestBlue, fontSize: hp(2.5), fontFamily: 'Poppins-SemiBold', alignSelf: 'center', marginTop: 15, }}>
                        {userDetails ? userDetails?.name : ''}
                    </Text>
                    <TouchableOpacity onPress={accStat == "unverified" || accStat == "in_complete" || accStat == "pending" ? () => navigation.navigate('Profile', {
                        screen: 'EditProfile',
                    }) : accStat == "verified" ? () => updateSignupStatus(false) : null}>
                        {accStat == "verified" ?
                            <View style={{ height: hp(3), width: wp(30), borderRadius: 15, backgroundColor: "#D7F7C2", alignItems: "center", alignSelf: "center", flexDirection: "row", justifyContent: "center", marginVertical: 5 }}>
                                <Text style={{ color: "#006908", fontFamily: "Poppins-Regular", fontSize: 14, textAlign: "center" }}>Verified</Text>
                                <Icon style={{ alignSelf: "center", }} name={"check"} type={'AntDesign'} size={hp(2.2)} color={"#006908"} />
                            </View> : accStat == "unverified" ?
                                <View style={{ height: hp(3), width: wp(32), borderRadius: 15, backgroundColor: "#FFE7F2", alignItems: "center", alignSelf: "center", flexDirection: "row", justifyContent: "center", marginVertical: 5 }}>
                                    <Text style={{ color: "#B3093C", fontFamily: "Poppins-Regular", fontSize: 14, textAlign: "center" }}>Unverified</Text>
                                    <Icon style={{ alignSelf: "center", }} name={"block"} type={'Entypo'} size={hp(2)} color={"#B3093C"} />
                                </View> : accStat == "in_complete" || accStat == "pending" ?
                                    <View style={{ height: hp(3), width: wp(32), borderRadius: 15, backgroundColor: "#FFEFBF", alignItems: "center", alignSelf: "center", flexDirection: "row", justifyContent: "center", marginVertical: 5 }}>
                                        <Text style={{ color: "#EBAF00", fontFamily: "Poppins-Regular", fontSize: 14, textAlign: "center" }}>Pending</Text>
                                        <Icon style={{ alignSelf: "center", }} name={"warning"} type={'Entypo'} size={hp(2)} color={"#EBAF00"} />
                                    </View> : null}
                    </TouchableOpacity>
                </View>

                <View style={styles.section2}>
                    <TouchableOpacity style={{
                        backgroundColor: 'white',
                        width: wp('90%'),
                        height: hp('9%'),
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        flexDirection: 'column',
                    }} onPress={toggleDropdown} >
                        <View style={{ justifyContent: "space-between", flexDirection: "row", alignItems: 'center', marginBottom: 5, }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <View style={{ width: 45, height: 45, borderRadius: 12, backgroundColor: '#D3E9FC', alignItems: "center", justifyContent: "center" }}>
                                    <Icon name="list-ul" type="font-awesome-5" color={'#6AB7F2'} size={20} />
                                </View>
                                <Text style={[styles.text, { marginStart: 10 }]}>{'My Wishlists'}</Text>
                            </View>
                            <Icon name={!openDD ? 'angle-down' : 'angle-up'} type={'font-awesome-5'} size={hp(2.7)} color={Colors.LightestBlue} />
                        </View>
                    </TouchableOpacity>
                    {openDD
                        ?
                        <Animated.View style={[{
                            flexDirection: "column",
                            height: slideAnimation.interpolate({
                                inputRange: [0, scale(1)],
                                outputRange: [0, scale(100)], // Adjust the height as needed
                            }),
                            width: wp('80%'), marginBottom: scale(20), padding: scale(10), backgroundColor: '#D3E9FC', borderRadius: scale(14), overflow: "hidden",
                            height: hp(10)
                        }]}>
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center" }} onPress={() => setIsVisible(!isVisible)}>
                                <Text style={[styles.text, { fontSize: hp(1.8), color: Colors.ThemeColor, }]}>Create Wishlist</Text>
                                <Icon name="add-to-list" type="entypo" color={Colors.ThemeColor} size={hp(2)} />
                            </TouchableOpacity>
                            <View style={{ height: 1, width: '100%', backgroundColor: Colors.ThemeColor, marginVertical: 10, }} />
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center" }} onPress={() => navigation.navigate('ManageWishlists')}>
                                <Text style={[styles.text, { fontSize: hp(1.8), color: Colors.ThemeColor }]}>Manage Wishlists</Text>
                                <Icon name="circle-edit-outline" type="material-community" color={Colors.ThemeColor} size={hp(2.2)} />
                            </TouchableOpacity>
                        </Animated.View>
                        : null}
                    <TouchableOpacity style={{
                        width: wp('90%'),
                        height: hp('9%'),
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        flexDirection: 'column',
                    }} onPress={() => navigation.navigate('GftdToFriends', { isProfile: true, profileImage: filePath })} >
                        <View style={{ justifyContent: "space-between", flexDirection: "row", alignItems: 'center', marginBottom: 5, }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <View style={{ width: 45, height: 45, borderRadius: 12, backgroundColor: '#C7C5FF', alignItems: "center", justifyContent: "center" }}>
                                    <Icon name="card" type="ionicon" color={'#6248F4'} size={22} />
                                </View>
                                <Text style={[styles.text, { marginStart: 10 }]}>{'GFTD Transactions'}</Text>
                            </View>
                            <Icon type="material" name="arrow-forward-ios" size={hp(2.7)} color={Colors.LightestBlue} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        width: wp('90%'),
                        height: hp('8%'),
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        flexDirection: 'column',
                    }} onPress={() => navigation.navigate('FindFriend', { profileImage: filePath })} >
                        <View style={{ justifyContent: "space-between", flexDirection: "row", alignItems: 'center', }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <View style={{ width: 45, height: 45, borderRadius: 12, backgroundColor: '#D0F4D5', alignItems: "center", justifyContent: "center" }}>
                                    <Icon name="user-friends" type="font-awesome-5" color={'#77C56B'} size={20} />
                                </View>
                                <Text style={[styles.text, { marginStart: 10 }]}>{'Find Friends'}</Text>
                            </View>
                            <Icon type="material" name="arrow-forward-ios" size={hp(2.7)} color={Colors.ThemeColor} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View >
        );
    };
    const [privacy, setPrivacy] = useState(null);

    const clearState = () => {
        setPrivacy(null);
        setWishlists('')
        setChecked('')
    };

    const handleContinue = async () => {
        if (wishlistsValue == '') {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Please Enter Wishlist title',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            setHighlighted1(true)
            return false;
        }
        if (privacy == null) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Please select privacy',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            setHighlighted2(true)

            return false;
        }
        const obj = {
            wishlist_title: wishlistsValue,
            privacy: privacy
        };

        const data = JSON.stringify(obj);

        await analytics().logEvent('create_wishlists', {
            wishlist_title: wishlistsValue,
            privacy: privacy,
        });

        await Service.CreateWishlists(data, apiToken, setBtnloading, setIsVisible, clearState);
    };

    return (
        <View style={{ backgroundColor: 'white', flex: 1, }}>
            <StatusBar translucent={true} barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            <View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />
            <CustomHeader />
            <BaseView />
            <CreateWishModal btnLoading={btnLoading} wishlistsValue={wishlistsValue} isVisible={isVisible} setIsVisible={setIsVisible} setWishlists={setWishlists} highlighted1={highlighted1} setHighlighted1={setHighlighted1} checked={checked} setChecked={setChecked} setPrivacy={setPrivacy} highlighted2={highlighted2} setHighlighted2={setHighlighted2} clearState={clearState} handleContinue={handleContinue} />
            <TutorialFive navigation={navigation} tutorialModal={tutorialModal} setTutorialModal={setTutorialModal} tutoriaCount={tutorialCount} setTutorialCount={setTutorialCount} />
        </View >
    );
};



const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.White,
    },
    section2: {
        flex: 2,
        alignItems: 'center',
    },
    text: {
        color: Colors.LightestBlue,
        fontSize: hp(2.2),
        marginEnd: scale(10),
        fontFamily: 'Poppins-SemiBold'
    },
});