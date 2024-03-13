import { FlatList, Image, ImageBackground, StyleSheet, Text, Animated, TouchableOpacity, View, ActivityIndicator, StatusBar, Keyboard, Linking, Pressable, } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Icons, Images } from '../../Assets';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../Utils';
import { Platform } from 'react-native';
import { Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../../Context';
import { Service } from '../../Config/Services';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import DeviceInfo from 'react-native-device-info';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import deviceInfoModule from 'react-native-device-info';
import { oreintation } from '../../Helper/NotificationService';
import AwesomeAlert from 'react-native-awesome-alerts';
import Modal from "react-native-modal";
import { TextInput } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { PermissionsAndroid } from 'react-native';
import UserAgent from 'react-native-user-agent';
import { adduserdata } from '../../Redux/UserReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { update_signup_status } from '../../Redux/SignupStatusReducer';
import SignupStatus from '../../Config/SignupStatus';
import LinearGradient from 'react-native-linear-gradient';
import ImageSlider from '../../Constants/ImageSlider';
import moment from 'moment/moment';
import Swiper from 'react-native-swiper';
import { scale, verticalScale } from 'react-native-size-matters';
import CustomButton from '../../Constants/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Animated from 'react-native-reanimated';
import Contacts from 'react-native-contacts';
import Share from 'react-native-share';


// this is new users viral loop modal
function ShareModal() {


    return (
        <Modal
            isVisible={true}
            backdropOpacity={.5}
        // style={{ alignItems: "center", justifyContent: "center", }}
        >
            <View
                style={styles.modalView}
            >

                <TouchableOpacity style={{ backgroundColor: Colors.LightestGrey, height: scale(20), width: scale(20), borderRadius: scale(30), alignSelf: "flex-end", alignItems: "center", justifyContent: "center" }}>
                    <Ionicons
                        size={scale(15)}
                        name={"close"}
                    />
                </TouchableOpacity>
                {/* <View>
                    <Image

                    />
                </View> */}
                <View style={{ marginVertical: scale(20), marginHorizontal: scale(5) }}>
                    <Text style={{ fontFamily: "Poppins-Medium", fontSize: scale(15), textAlign: "center" }} >GFTing is more fun with friends 🥳 share with friends 🎉</Text>
                </View>

                <CustomButton
                    title={'Share Now'}
                    backgroundColor={Colors.ThemeColor}
                    color={Colors.White}
                    onPress={() => console.log("hehhe")}
                // loading={loading && loaderState == "default"}
                />


            </View>


        </Modal>
    )
}



function SkeletonCard({ isLoading }) {
    return (
        <View style={styles.skeletonContainer} >
            <SkeletonContent
                containerStyle={{ flexDirection: "column", width: '100%', }}
                isLoading={isLoading}
                animationType="shiver"
                duration={1500}
                animationDirection='horizontalRight'
                layout={[
                    {
                        flex: 2, flexDirection: "row", key: 'someId0', width: '100%', height: hp(12), alignItems: "center", justifyContent: "center",
                        children: [
                            { key: 'someId1', width: 55, height: 55, borderRadius: 100, marginStart: -20 },

                            {
                                key: "someId2",
                                flexDirection: 'column',
                                marginLeft: 10,
                                children: [
                                    {
                                        width: 80,
                                        height: 12,
                                        marginBottom: 5,
                                    },
                                    {
                                        width: 60,
                                        height: 12,
                                        marginBottom: 5,

                                    },
                                    {
                                        width: 40,
                                        height: 12,

                                    },
                                ]
                            },]
                    },
                    {
                        flex: 1, key: 'someId3', width: '100%', height: hp(12),
                        alignItems: "flex-start",
                        justifyContent: "center",
                        children: [
                            { marginStart: 8, marginTop: 5, key: 'someId4', width: 80, height: 27, borderRadius: 8, }
                        ]
                    },
                ]}
            >
            </SkeletonContent>
        </View>
    )
};

const Dashboard = ({ navigation }) => {
    const { trackData, signOut } = useContext(AuthContext);
    const [tutorialModal, setTutorialModal] = useState(false);
    const [tutoriaCount, setTutorialCount] = useState(0);
    // state of share modal
    const [shareModal, setShareModal] = useState(false);
    const [contactModal, setContactModal] = useState(false);
    // contact list state
    const [contacts, setContacts] = useState([]);
    const [referralLink, setReferralLink] = useState("");

    const [loading, setloading] = useState(false)
    const [imageLoading, setImageLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [storeList, setStoreList] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [events, setEvents] = useState([]);
    const [status, setStatus] = useState(false);
    const [checkDetailsRes, setCheckDetailsRes] = useState({});
    const [accStat, setAccStat] = useState("")
    const [accMsg, setAccMsg] = useState("")
    const [isVisible, setIsVisible] = useState(false);
    const netInfo = useNetInfo()
    const [forceUpdate, setForceUpdate] = useState(false)
    const [walletAmount, setwalletAmount] = useState({});
    const [balanceCheckModal, setbalanceCheckModal] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [SSNVisible, setSSNVisible] = useState(false);
    const [verfiedVisible, setVerifiedVisible] = useState(false);
    const [loadingGif, setLoadingGif] = useState(false);
    const [SSN, setSSN] = useState('');
    const [hide, setHide] = useState(true);
    const [isUploadSuccessfull, setisUploadSuccessfull] = useState(false);
    const [isUploadSuccessfull2, setisUploadSuccessfull2] = useState(false);
    const [myFriends, setMyFriends] = useState([]);
    const [myWishlist, setMyWishlist] = useState([]);
    const [fullData, setFullData] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [filePath, setFilePath] = useState('');
    const [filePath2, setFilePath2] = useState('');
    const [docType, setDocType] = useState('');
    const [count, setCount] = useState(13);
    const { container } = styles;

    const [banners, setBanners] = useState([]);

    const userDetails = useSelector(state => state.UserReducer);
    const signupStatus = useSelector(state => state.SignupStatusReducer);
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const setUserData = (data) => dispatch(adduserdata(data));
    const updateSignupStatus = (data) => dispatch(update_signup_status(data));

    const NotificationsReducer = useSelector(state => state.NotificationsReducer);
    const apiToken = userDetails?.api_token;

    const GetStoreList = async () => {
        if (!!apiToken) await Service.GetStoreList(apiToken, setStoreList, setFilteredData, setRefresh);
    };
    const GetEvents = async () => {
        if (!!apiToken) await Service.GetEvents(apiToken, setEvents, setloading);
    };
    const SessionExpired = async () => {
        await Service.CheckToken(signOut);
    };
    const getWallet = async () => {
        if (!!apiToken) await Service.GetWallet(apiToken, setwalletAmount, setloading);
    };
    const GetBankAccounts = async () => {
        if (!!apiToken) await Service.ShowbankDetails(apiToken, setBankAccounts, setloading);
    };
    const GetMyFriendsList = async () => {
        if (!!apiToken) await Service.GetFriendlist(apiToken, setMyFriends, setFullData, setloading);
    };
    const GetMyWishlists = async () => {
        if (!!apiToken) await Service.GetWishlistsByUserIdWishId(userDetails.id, '0', apiToken, setMyWishlist, setloading, setRefresh);
    };
    const GetBanners = async () => {
        if (!!apiToken) await Service.GetBanners(setBanners);
    };

    const findAppVersion = async () => {
        const data = {
            "platform": Platform.OS,
            "app_version": deviceInfoModule.getVersion()
        }
        await Service.GetAppVersion(data, setForceUpdate)
    };

    useEffect(() => {
        findAppVersion();
     
    }, []);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60).toString().padStart(2, '0');
        const seconds = (time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };


    const [rewardsPoint, setRewardsPoints] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [myReferrals, setMyReferrals] = useState([]);
    const [isLoading, setLoading] = useState(false);


    const fetchReferralData = async () => {
        await Service.GetMyReferrals(apiToken, setReferralCode, setRewardsPoints, setMyReferrals, setLoading);
    };

    const checkDetails = async () => {
        if (!!apiToken) await Service.CheckProfileDetail(apiToken, setAccStat, setAccMsg, setCheckDetailsRes)
    };

    useEffect(() => {
        // updateSignupStatus(true);
        if (!!apiToken) {
            setTimeout(() => {
                checkDetails();
            }, 12000);
        }
    }, [userDetails]);

    useEffect(() => {
        if (!!apiToken) {
            if (!!apiToken) trackData(apiToken, 'Page View', 'Home');
            setTimeout(() => {
                GetStoreList();
                fetchReferralData();
                GetBanners();
                getWallet();
                GetBankAccounts();
                GetMyFriendsList();
                GetMyWishlists();
                GetEvents();
            }, 1000);
        }
    }, [userDetails]);

    useEffect(() => {
        if (!!apiToken || userDetails == undefined) {
            SessionExpired();
        };
    }, [isFocused]);

    const handlePayout = async () => {
        if (!!walletAmount.wallet_available_amount !== 0 && bankAccounts.length !== 0) {
            setbalanceCheckModal(true)
        }
        else {
            setIsVisible(true)
        }
    };

    const handleContinue = () => {
        setIsVisible(false)
        navigation.navigate('MyAccounts', { initialRouteName: 'Recieve Account' })
    };

    const handleTransferContinue = async () => {
        const data = {
            amount: walletAmount.wallet_available_amount
        };
        await Service.BalancePayout(apiToken, data, setBtnLoading, setbalanceCheckModal);
    };

    const CheckProfileData = () => {
        setAccStat("")
        updateSignupStatus(false);
        Alert.alert('Your Profile is pending verification', ' Please complete your profile ',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        navigation.navigate('Profile', {
                            screen: 'EditProfile',
                        });
                    }

                },
            ],
            { cancelable: false }
        );
    }
    const checkPending = () => {
        setAccStat("")
        updateSignupStatus(false);
        setSSNVisible(true);
        
    }

    const checkVerified = async () => {
        setAccStat("")
        updateSignupStatus(false)
        if (myWishlist.length > 0 && myFriends.length > 0 && bankAccounts.length > 0) {
            setVerifiedVisible(false);
            // console.log('Wishlist, friendlist & bank account has data')
        }
        else if (myWishlist.length === 0 && myFriends.length === 0 && bankAccounts.length === 0) {
            setVerifiedVisible(true);
            // console.log('Wishlist, friendlist & bank account has no data')
        }
        else {
            // console.log('Wishlist, friendlist & bank account has one of them missing data')
            setVerifiedVisible(false);
        }
    }


    const chooseFile = (type) => {
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
            if (type === 'front') {
                setFilePath(source);
                const data = {
                    document: source,
                    document_type: 'front',
                    user_agent: UserAgent.getUserAgent(),
                    ip: await netInfo.details.ipAddress,
                };
                await Service.UpdateDoc(apiToken, data, setImageLoading, setisUploadSuccessfull);
            }
            if (type === 'back') {
                setFilePath2(source)
                const data = {
                    document: source,
                    document_type: 'back',
                    user_agent: UserAgent.getUserAgent(),
                    ip: await netInfo.details.ipAddress,
                };
                await Service.UpdateDoc(apiToken, data, setImageLoading, setisUploadSuccessfull2);
            }
        });
    };

    const [docLoading, setDocLoading] = useState(false);
    const [SSNLaoding, setSSNLaoding] = useState(false);

    const handleDOC = () => {
        setDocLoading(true);

        setTimeout(() => {
            setDocLoading(false);
            setSSNVisible(false);
            setFilePath('');
            setFilePath2('');
            setDocType('')
            updateSignupStatus(true);
        }, 1000);

        if (!!filePath && !!filePath2) {
            setTimeout(async () => {
                await Service.GetStripStatus(apiToken, updateSignupStatus);
            }, 10000)
        };

    };

    const handleSSN = async () => {
        const data = {
            ssn: SSN,
            user_agent: UserAgent.getUserAgent(),
            ip: await netInfo.details.ipAddress,
        }
        setTimeout(() => {
            setSSN('');
        }, 1500)
        await Service.UpdateSSN(apiToken, data, setSSNLaoding, setSSNVisible, updateSignupStatus);

        if (!!apiToken) {
            setTimeout(() => {
                checkDetails();
            }, 15000);
        }
    };


    function CharityTutorial({ tutorialModal, setTutorialModal, tutoriaCount, setTutorialCount }) {
        return (
            <View>
                <Modal isVisible={tutorialModal}>
                    <View style={{ flex: 1 }}>
                        {tutoriaCount == 0 &&
                            <TouchableOpacity
                                onPress={async () => {
                                    setTutorialModal(!tutorialModal)
                                    setTutorialCount(0);
                                    await AsyncStorage.setItem('@tutorial_charity', 'asd')
                                    checkNewUser();

                                }}
                                style={{
                                    position: 'absolute',
                                    bottom: Platform.OS === 'android' ? -18 : oreintation == "LANDSCAPE" ? -35 : -5,
                                    right: oreintation == "LANDSCAPE" ? 185 : -15,
                                    height: 250, width: 200,
                                    justifyContent: 'space-between'

                                }}>
                                <Text style={{ fontSize: hp(2.3), fontFamily: 'Lato-Regular', color: Colors.White }}>Tap here to create charitable profile, add &amp; manage charitable wishlist</Text>
                                <Icon name="arrowdown" type="antdesign" style={{ marginLeft: -25 }} size={40} color={Colors.White} />
                                <View style={{ width: 70, height: 70, borderRadius: 100 / 2, borderColor: Colors.White, borderWidth: 3, marginLeft: 52, alignItems: "center", justifyContent: 'center', }}>
                                    <View style={{ backgroundColor: 'white', width: 55, height: 55, borderRadius: 100, alignItems: 'center', justifyContent: "center" }}>
                                        <Image source={Icons.charity} style={{ height: 35, width: 35, resizeMode: 'contain', tintColor: Colors.LightestBlue }} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        }
                    </View>
                </Modal>
            </View>
        );
    }


  

   
    return (
        <>
            <StatusBar barStyle={"light-content"} backgroundColor={Colors.ThemeColor} />
            <ImageBackground source={Images.app_bg3} style={container} resizeMode={'cover'} resizeMethod="resize" >
                <View style={styles.spacing}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", top: Platform.OS == 'android' ? scale(25) : scale(40), alignItems: "center", }}>
                            <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ width: scale(25), height: scale(25), alignItems: "flex-start", justifyContent: "center", marginRight: scale(10) }}>
                                <Image source={Icons.humburger} style={{ width: "100%", height: "100%", resizeMode: 'contain', tintColor: 'white' }} />
                            </TouchableOpacity>
                            <View style={{
                                flexDirection: "column", flex: 1, justifyContent: "space-evenly", alignItems: "flex-start", paddingLeft: 0
                            }}>
                                <Text adjustsFontSizeToFit={true} style={{ fontSize: scale(17.5), fontFamily: "Poppins-Medium", color: Colors.White }}>Hello,</Text>
                                <Text adjustsFontSizeToFit={true} style={{ fontSize: scale(20), fontFamily: "Poppins-SemiBold", marginTop: -5, color: Colors.White, }}>{userDetails?.f_name || 'Welcome back'}</Text>
                            </View>
                            <View style={{
                                flexDirection: "row", flex: .35, justifyContent: "space-between", alignItems: "center"
                            }}>
                                <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={{ shadowColor: "black", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 }}>
                                    <Image source={Icons.bellIcon} style={{ width: scale(25), height: scale(25), resizeMode: 'contain' }} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={{ width: scale(44), height: scale(44), borderColor: Colors.White, borderWidth: scale(2), borderRadius: 100, alignItems: "center", justifyContent: "center", shadowColor: "black", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 10, }}>
                                    <Image source={userDetails?.image != '' ? { uri: `${userDetails?.image}` } : Images.userProfile} style={{ width: scale(40), height: scale(40), resizeMode: "cover", borderRadius: 100, }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "center", ...Platform.select({ ios: { marginTop: scale(30) }, android: { marginTop: scale(20) } }) }}>
                            <ImageBackground
                                source={Images.wallet_bg}
                                resizeMode="contain"
                                style={{
                                    width: wp('89%'),
                                    height: hp(20),
                                    alignItems: "center",
                                    flexDirection: "row",
                                }}>
                                <View
                                    style={{
                                        width: scale(100), height: scale(130),
                                        flex: 1,
                                        zIndex: 2,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        top: scale(-20)
                                    }}>
                                    <Image source={Icons.platypus} style={{ width: "100%", height: "100%", resizeMode: "contain" }} />
                                </View>
                                <View style={{
                                    flex: 1.4,
                                    zIndex: 2,
                                    alignItems: "center", justifyContent: "space-evenly",

                                }}>
                                    <Text adjustsFontSizeToFit={true} style={{ fontSize: Platform.OS == 'android' ? hp(1.8) : hp(1.8), fontFamily: "Poppins-SemiBold", color: Colors.White, }}>{'Current Balance'}</Text>
                                    <Text adjustsFontSizeToFit={true} style={{ fontSize: Platform.OS == 'android' ? hp(2) : hp(1.8), fontFamily: "Poppins-SemiBold", color: Colors.White }}>{!!walletAmount && walletAmount.walletbalance != undefined ? `$${walletAmount?.walletbalance}` : '$0'}</Text>
                                </View>
                                <View style={{
                                    flex: 1,
                                    zIndex: 2,
                                    alignItems: "center", justifyContent: "space-evenly",
                                    borderRadius: 18,
                                }}>
                                </View>
                            </ImageBackground>
                        </View>

                        {/* Image Slider */}
                        <View style={{ top: -10 }}>
                            <ImageSlider images={banners} />
                        </View>
                        <View
                            style={{
                                marginTop: -20,
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: "space-evenly",
                                alignItems: "center",
                            }}
                        >
                            <Image source={NotificationsReducer[0]?.profileimage !== (null || undefined) ? { uri: NotificationsReducer[0]?.profileimage } : Images.user_noti}
                                style={{ width: scale(55), height: scale(55), borderRadius: scale(200), }}
                                resizeMode='cover'
                            />
                            <ImageBackground source={Images.notification_ban} resizeMode="contain"
                                style={{ width: scale(260), alignSelf: "center", height: scale(76), flexDirection: "row", justifyContent: "center", marginTop: scale(7), }}>
                                <View style={{ flex: 3, alignItems: "flex-start", justifyContent: "center", marginStart: scale(20), marginBottom: scale(10) }} >
                                    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{ marginStart: scale(10), fontFamily: 'Poppins-Medium', fontSize: hp(1.9), color: Colors.ThemeColor, marginLeft: 5, }}>{NotificationsReducer.length > 0 ? NotificationsReducer[0].message.substring(0, 28) + '...' : 'No Notifications Yet'}</Text>
                                    {NotificationsReducer.length > 0 ? <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{ marginStart: 10, fontFamily: 'Poppins-Medium', fontSize: hp(1.1), color: Colors.Grey, marginLeft: 5 }}>{`${moment(NotificationsReducer[0]?.created_at).format('ll')}`}</Text> : null}
                                </View>
                                <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "flex-end", paddingHorizontal: scale(10) }}>
                                    {NotificationsReducer.length > 0 ? <TouchableOpacity style={{ marginBottom: scale(15) }} onPress={() => navigation.navigate('Notifications')} >
                                        <Image source={Icons.say_thanks} style={{ width: scale(90), height: scale(30), resizeMode: 'contain', }} />
                                    </TouchableOpacity> : null}
                                </View>
                            </ImageBackground>
                        </View>
                        <View>
                            <Text adjustsFontSizeToFit={true} style={{ fontSize: scale(13.6), fontFamily: "Poppins-SemiBold", color: Colors.ThemeColor, marginLeft: scale(9) }} >Upcoming Events</Text>
                            {loading
                                ?
                                <View style={{ justifyContent: 'center', alignItems: "center", width: '100%' }}>
                                    <FlatList
                                        showsHorizontalScrollIndicator={false}
                                        horizontal={true}
                                        data={[{}, {}, {}, {}]}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) => <SkeletonCard key={item} isLoading={loading} />}
                                    />
                                </View>
                                :
                                events.length > 0
                                    ?
                                    <FlatList
                                        keyExtractor={item => item.id}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        data={events}
                                        renderItem={({ item, index }) => {
                                            // console.log(index)
                                            return (
                                                <View
                                                    key={item?.id}
                                                    style={{
                                                        backgroundColor: Colors.White,
                                                        marginVertical: scale(5),
                                                        flexDirection: "column",
                                                        height: scale(125),
                                                        width: Platform.OS == 'android' ? wp('50%') : wp('50%'),
                                                        borderRadius: scale(12),
                                                        overflow: "hidden",
                                                        marginRight: 10,
                                                    }}>
                                                    <View style={{ flexDirection: "row", flex: 2, backgroundColor: Colors.White, borderTopRightRadius: 12, borderTopLeftRadius: 12, alignItems: "center", justifyContent: "space-around" }}>
                                                        <View style={{ flex: 1, alignItems: "flex-end" }}>
                                                            <ImageBackground source={Icons.avatar} resizeMode="contain" style={{ alignItems: "center", justifyContent: "center", width: scale(57), height: scale(57), }}>
                                                                <Image source={item?.profile_img ? { uri: item.profile_img } : Images.userProfile} style={{ width: scale(50), height: scale(50), resizeMode: "contain", borderRadius: scale(100) }} />
                                                            </ImageBackground>
                                                        </View>
                                                        <View style={{ flex: 1.6, marginStart: scale(10) }}>
                                                            <Text adjustsFontSizeToFit={true} style={{ width: scale(100), fontSize: hp(1.6), fontFamily: "Poppins-SemiBold", color: Colors.ThemeColor, }} numberOfLines={2} >{`${item?.friendname}'s`}</Text>
                                                            <Text adjustsFontSizeToFit={true} style={{ fontSize: hp(1.1), fontFamily: "Poppins-SemiBold", color: Colors.Grey, }} >{`${item?.description}`}</Text>
                                                        </View>
                                                    </View>
                                                    <LinearGradient colors={['rgba(0, 40, 85, 1)', 'rgba(13, 88, 172, 1)',]}
                                                        start={{ x: 0, y: 1 }}
                                                        end={{ x: 1, y: 1 }}
                                                        style={{ flex: 1, justifyContent: "center", paddingStart: scale(10), borderBottomRightRadius: scale(12), borderBottomLeftRadius: scale(12), }}
                                                    >
                                                        <TouchableOpacity onPress={() => navigation.navigate('SendGift', { recipientId: item?.user_id })} style={{ width: wp(22), height: scale(26), backgroundColor: Colors.White, borderRadius: scale(8), alignItems: "center", justifyContent: "center" }}>
                                                            <Text style={{ color: Colors.ThemeColor, fontFamily: "Poppins-SemiBold", fontSize: hp(1.5) }}>Send GFT</Text>
                                                        </TouchableOpacity>
                                                    </LinearGradient>
                                                    <Image source={Icons.popper} style={{ width: scale(65), height: scale(65), position: "absolute", bottom: -9, right: -14 }} />
                                                </View>
                                            )
                                        }}
                                    />
                                    :
                                    <View style={{
                                        // hp(16)
                                        width: scale(310),
                                        backgroundColor: Colors.White,
                                        marginTop: scale(10),
                                        flexDirection: "column",
                                        height: scale(120),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        alignSelf: "center",
                                        borderRadius: scale(15),
                                        marginBottom: scale(5),
                                    }}>
                                        <Text adjustsFontSizeToFit={true} style={{ fontSize: hp(2.3), fontFamily: 'Poppins-Regular', color: Colors.Grey }}>No Upcoming Events Yet</Text>
                                    </View>
                            }
                            <ImageBackground source={Images.referral_banner} resizeMode='contain' style={{ width: wp(90), height: hp(15), alignSelf: "center", alignItems: "center", justifyContent: "space-between", flexDirection: "row", paddingHorizontal: scale(20) }}>
                                <Text style={{ color: Colors.White, fontSize: hp(2.2), fontFamily: "Poppins-SemiBold" }}>{`Referrals \n& Rewards`}</Text>
                                <Text style={{ color: Colors.White, fontSize: hp(4.5), fontFamily: "Poppins-SemiBold" }}>{rewardsPoint ? rewardsPoint : 0}</Text>
                                <TouchableOpacity style={{ width: wp(25), height: hp(3.5), backgroundColor: Colors.White, borderRadius: 8, alignItems: "center", justifyContent: "center" }}
                                    onPress={() => navigation.navigate('Referral')}
                                >
                                    <Text style={{ color: Colors.ThemeColor, fontSize: hp(1.6), fontFamily: "Poppins-SemiBold" }}>Get Now</Text>
                                </TouchableOpacity>
                            </ImageBackground>
                            {/* {accStat == "in_complete" || accStat == "pending" ? CheckProfileData() : accStat == "unverified" ? checkPending() : accStat == "verified" ? checkVerified() : null} */}

                            <View style={{ height: Platform.OS == 'android' ? hp(1) : hp(2) }} />
                        </View>
                    </ScrollView>
                </View>
                <Modal
                    backdropColor='rgba(0,0,0,0.3)'
                    isVisible={SSNVisible}
                    onRequestClose={() => {
                        setSSNVisible(!SSNVisible);
                    }}>
                    <Pressable onPress={() => Keyboard.dismiss()}>
                        <View style={{
                            justifyContent: 'space-between',
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
                            top: -hp(3),
                        }}>
                            <View style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}>
                                <Text
                                    style={{
                                        color: Colors.Black,
                                        fontFamily: 'Poppins-Medium', fontSize: hp(2), textAlign: "center",
                                    }}>
                                    To verify your identity, <Text style={{ color: '#6057f7', fontSize: hp(2.3), fontWeight: 'bold' }}>stripe </Text>
                                    needs to activate your wallet and to enable financial features. Your information is encrypted & protected
                                    under <Text onPress={() => { Linking.openURL('https://getgftd.io/privacy-policy'), setSSNVisible(false) }} style={{ color: Colors.LightestBlue, fontFamily: 'Poppins-SemiBold', fontSize: hp(2), }}>GetGFTD</Text> privacy policy.
                                </Text>
                                <Image source={Icons.shield} style={{ height: 100, width: 100, resizeMode: "stretch", borderRadius: 8, }} />
                                {checkDetailsRes?.dueto == '1' ?
                                    <View
                                        style={{
                                            flexDirection: "column",
                                            alignItems: "center"
                                        }}>
                                        <Text style={{ fontSize: hp(2), color: Colors.Charcol, fontFamily: "Poppins-SemiBold" }}>Social Security Number</Text>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                backgroundColor: "white",
                                                alignItems: "center",
                                                width: wp(70),
                                                height: hp(6),
                                                justifyContent: "center",
                                                borderColor: Colors.LightestGrey,
                                                borderWidth: 1,
                                                borderRadius: 8,
                                            }}>
                                            <TextInput
                                                maxLength={9}
                                                style={{
                                                    fontSize: hp(2.2),
                                                    fontFamily: "Poppins-SemiBold",
                                                    color: Colors.Grey,
                                                    width: wp(40),
                                                    alignSelf: "center",
                                                    textAlign: "center"
                                                }}
                                                placeholder='___-__-____'
                                                placeholderTextColor={Colors.Grey}
                                                onChangeText={setSSN}
                                                value={SSN}
                                                keyboardType="number-pad"
                                                secureTextEntry={hide}
                                            />
                                            <Pressable onPress={() => setHide(!hide)} style={{ position: "absolute", right: 15 }}>
                                                <Image source={hide ? Icons.hidden : Icons.show} style={{ width: 22, height: 22, resizeMode: 'contain', tintColor: "grey" }} />
                                            </Pressable>
                                        </View>
                                    </View> :
                                    <View style={{ flexDirection: 'row', width: wp(80), alignItems: "center", justifyContent: "space-between" }} >
                                        <View style={{ alignItems: "center", }}>
                                            <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: hp(2), color: Colors.Charcol }}>ID Card Front</Text>
                                            <TouchableOpacity onPress={() => { chooseFile('front'), setDocType('front') }} style={{ width: wp(38), backgroundColor: 'rgba(244,244,244,0.5)', height: hp(14), borderWidth: 1, borderColor: Colors.Grey, borderRadius: 8, borderStyle: "dashed", padding: 3, alignItems: "center", justifyContent: "center" }}>
                                                {filePath !== '' ?
                                                    <View style={{ alignItems: "center" }}>
                                                        <Image source={{ uri: filePath }} style={{ width: wp(36), height: hp(13), borderRadius: 5 }} />
                                                        {filePath !== ''
                                                            ? <View style={{ position: "absolute", width: wp(36), backgroundColor: 'rgba(244,244,244,0.5)', height: hp(14), alignItems: "center", justifyContent: "center" }}>
                                                                {
                                                                    imageLoading && docType == 'front'
                                                                        ?
                                                                        <ActivityIndicator size={"large"} color={Colors.LightestBlue} />
                                                                        : imageLoading == false && filePath && isUploadSuccessfull == true ?
                                                                            <Icon name={"cloud-done"} type={'material-icons'} size={30} color={'green'} />
                                                                            : imageLoading == false && filePath && isUploadSuccessfull == false &&
                                                                            <Icon name={"error"} type={'material-icons'} size={30} color={'darkred'} />
                                                                }
                                                            </View>
                                                            : null}
                                                    </View>
                                                    :
                                                    <Text style={{ fontFamily: "Poppins-Medium", fontSize: hp(1.8), color: Colors.Charcol }}>
                                                        Upload ID Front
                                                    </Text>}
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ alignItems: "center", }}>
                                            <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: hp(2), color: Colors.Charcol }}>ID Card Back</Text>
                                            <TouchableOpacity onPress={() => { chooseFile('back'), setDocType('back') }} style={{ width: wp(38), backgroundColor: 'rgba(244,244,244,0.5)', height: hp(14), borderWidth: 1, borderColor: Colors.Grey, borderRadius: 8, borderStyle: "dashed", padding: 3, alignItems: "center", justifyContent: "center" }}>
                                                {filePath2 !== '' ?
                                                    <View style={{ alignItems: "center" }}>
                                                        <Image source={{ uri: filePath2 }} style={{ width: wp(36), height: hp(13), borderRadius: 5 }} />
                                                        {filePath2 !== ''
                                                            ? <View style={{ position: "absolute", width: wp(36), backgroundColor: 'rgba(244,244,244,0.5)', height: hp(13), alignItems: "center", justifyContent: "center" }}>
                                                                {
                                                                    imageLoading && docType == 'back'
                                                                        ?
                                                                        <ActivityIndicator size={"large"} color={Colors.LightestBlue} />
                                                                        : imageLoading == false && filePath2 && isUploadSuccessfull2 == true ?
                                                                            <Icon name={"cloud-done"} type={'material-icons'} size={30} color={'green'} />
                                                                            : imageLoading == false && filePath2 && isUploadSuccessfull2 == false &&
                                                                            <Icon name={"error"} type={'material-icons'} size={30} color={'darkred'} />
                                                                }
                                                            </View>
                                                            : null}
                                                    </View>
                                                    :
                                                    <Text style={{ fontFamily: "Poppins-Medium", fontSize: hp(1.8), color: Colors.Charcol }}>
                                                        Upload ID Back
                                                    </Text>}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                }
                                <View>
                                    {checkDetailsRes?.dueto == '1' ?
                                        <TouchableOpacity onPress={handleSSN} disabled={SSNLaoding == true ? true : SSN == '' ? true : false} style={{ backgroundColor: SSN == '' ? Colors.LightestGrey : Colors.LightestBlue, width: wp(60), height: hp(6), alignItems: "center", justifyContent: "center", borderRadius: 8 }}>
                                            {SSNLaoding == true ? <ActivityIndicator color={Colors.White} size={'small'} /> : <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: hp(2), color: SSN == '' ? Colors.Charcol : Colors.White }}>Confirm</Text>}
                                        </TouchableOpacity>
                                        : <TouchableOpacity onPress={handleDOC} disabled={filePath == '' && filePath2 == '' ? true : false} style={{ backgroundColor: filePath == '' && filePath2 == '' ? Colors.LightestGrey : Colors.LightestBlue, width: wp(60), height: hp(6), alignItems: "center", justifyContent: "center", borderRadius: 8 }}>
                                            {docLoading == true ? <ActivityIndicator color={Colors.White} size={'small'} /> : <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: hp(2), color: filePath !== '' && filePath2 !== '' ? Colors.White : Colors.Charcol }}>OK</Text>}
                                        </TouchableOpacity>}
                                    <Pressable onPress={() => setSSNVisible(false)} style={{ width: wp(60), height: hp(5), alignItems: "center", justifyContent: "center", }}>
                                        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: hp(2), color: Colors.Grey }}>Back</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Pressable>
                </Modal>
                <Modal
                    animationIn={'zoomIn'}
                    animationOut={"zoomOut"}
                    backdropColor='rgba(0,0,0,0.3)'
                    isVisible={verfiedVisible}
                    onRequestClose={() => {
                        setVerifiedVisible(!verfiedVisible);
                    }}>
                    <View style={{
                        top: -40,
                        justifyContent: 'space-between',
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
                            <Image source={Images.verified} style={{ height: 150, width: 150, resizeMode: "stretch", borderRadius: 8, }} />
                            <View>
                                <Text style={{ color: Colors.Charcol, fontFamily: 'Poppins-SemiBold', fontSize: hp(3.5), textAlign: "center", }}>
                                    CONGRATULATIONS
                                </Text>
                                <Text style={{ color: Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(2.5), textAlign: "center", }}>
                                    YOUR PROFILE IS VERFIED
                                </Text>
                            </View>
                            <View style={{ flex: .8, justifyContent: "space-evenly", }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setVerifiedVisible(false);
                                        navigation.navigate('AddWish')
                                    }}
                                    style={{
                                        backgroundColor: Colors.LightestBlue,
                                        width: wp(70),
                                        height: hp(6),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: 8
                                    }}
                                >
                                    <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: hp(2), color: Colors.White }}>ADD WISH</Text>
                                </TouchableOpacity>
                                <TouchableOpacity disabled={true} style={{ backgroundColor: Colors.LightestGrey, width: wp(70), height: hp(6), alignItems: "center", justifyContent: "center", borderRadius: 8 }}>
                                    <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: hp(2), color: Colors.Charcol }}>ADD FRIEND</Text>
                                </TouchableOpacity>
                                <TouchableOpacity disabled={true} style={{ backgroundColor: Colors.LightestGrey, width: wp(70), height: hp(6), alignItems: "center", justifyContent: "center", borderRadius: 8 }}>
                                    <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: hp(2), color: Colors.Charcol }}>CONNECT A BANK ACCOUNT</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal animationType="slide"
                    isVisible={isVisible}
                    onRequestClose={() => {
                        setIsVisible(!isVisible);
                    }}>
                    <TouchableOpacity style={{
                        justifyContent: 'space-between',
                        top: hp(0),
                        padding: wp(5),
                        width: wp('80%'),
                        height: hp(32),
                        alignSelf: 'center',
                        backgroundColor: 'white',
                        elevation: 10,
                        shadowOffset: { width: 0, height: 8 },
                        shadowColor: Colors.Grey,
                        shadowRadius: 10,
                        shadowOpacity: 0.3,
                        borderRadius: 8,
                    }}
                        onPress={() => Keyboard.dismiss()}
                        activeOpacity={1}
                    >
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            ...oreintation == 'LANDSCAPE' ? { marginTop: -20 } : null
                        }}
                        >
                            <Text style={{
                                fontSize: hp(2.5),
                                color: Colors.LightBlue,
                                fontFamily: 'Poppins-SemiBold'
                            }}>ATTENTION!</Text>
                        </View>
                        <View style={{ marginVertical: 30 }}>
                            <View style={{ flexDirection: 'column', marginVertical: 5 }}>
                                <Text style={{ color: Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(2), textAlign: "center" }}>
                                    Please, connect your Bank Account
                                </Text>
                            </View>
                        </View>
                        <FilterButtons title="Connect Now" loading={btnLoading} resetFilter={() => { setIsVisible(!isVisible) }} applyFilter={handleContinue} />
                    </TouchableOpacity>
                </Modal>
                <Modal
                    animationType="slide"
                    isVisible={balanceCheckModal}
                    onRequestClose={() => {
                        setbalanceCheckModal(!balanceCheckModal);
                    }}
                    backdropColor='lightgrey'
                >
                    <TouchableOpacity style={{
                        justifyContent: 'space-between',
                        top: hp(0),
                        padding: 10,
                        width: wp('80%'),
                        height: hp(35),
                        alignSelf: 'center',
                        backgroundColor: 'white',
                        elevation: 10,
                        shadowOffset: { width: 0, height: 8 },
                        shadowColor: Colors.Grey,
                        shadowRadius: 10,
                        shadowOpacity: 0.3,
                        borderRadius: 8,
                    }}
                        onPress={() => Keyboard.dismiss()}
                        activeOpacity={1}
                    >
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            ...oreintation == 'LANDSCAPE' ? { marginTop: -20 } : null
                        }}
                        >
                            <Text style={{
                                fontSize: hp(2.5),
                                color: Colors.LightBlue,
                                fontFamily: 'Poppins-SemiBold'
                            }}>ATTENTION!</Text>
                        </View>
                        <View style={{ marginVertical: 30 }}>
                            <View style={{ flexDirection: 'column', marginVertical: 0 }}>
                                <Text style={{ color: Colors.Grey, fontFamily: 'Poppins-SemiBold', fontSize: hp(2), textAlign: "center" }}>
                                    {`Available to transfer: $${walletAmount?.wallet_available_amount} USD\n Available soon: $${walletAmount?.wallet_pending_amount} USD`}
                                </Text>
                                <Text style={{ textAlign: "center", color: Colors.Red, fontFamily: 'Poppins-Regular', fontSize: hp(1.6), }}>{"\nYou can only tranfer available amount!"}</Text>
                            </View>
                        </View>
                        <View style={styles.section3} >
                            <TouchableOpacity onPress={() => setbalanceCheckModal(!balanceCheckModal)}>
                                <View style={[styles.buttonStyle, { backgroundColor: Colors.LightestGrey, shadowColor: Colors.LightestGrey, }]}>
                                    <Text style={[styles.buttonTextStyle, { color: Colors.Grey }]}>
                                        Cancel
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleTransferContinue}
                                disabled={walletAmount.wallet_available_amount > 0 ? false : true}
                            >
                                <View style={[styles.buttonStyle,
                                { backgroundColor: walletAmount.wallet_available_amount > 0 ? Colors.LightestBlue : Colors.Grey }
                                ]}>
                                    {!loading
                                        ? <Text style={styles.buttonTextStyle}>
                                            {'Transfer'}
                                        </Text>
                                        :
                                        <ActivityIndicator size="small" color="white" />
                                    }
                                </View>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
                <SignupStatus bool={signupStatus?.isSignup} />
                <AwesomeAlert
                    show={showAlert}
                    showProgress={false}
                    title={'Confirm Transfer'}
                    message={'Transfer fee: 25¢'}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={false}
                    confirmButtonStyle={{
                        width: 60,
                        height: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    showConfirmButton={true}
                    cancelText="No"
                    confirmText="Ok"
                    confirmButtonColor={Colors.LightestBlue}
                    onCancelPressed={() => {
                        setShowAlert(!showAlert);
                    }}
                    onConfirmPressed={async () => {

                    }}
                    titleStyle={{ color: Colors.LightestBlue, fontFamily: 'Poppins-SemiBold', fonSize: hp(2.2) }}
                    messageStyle={{ color: Colors.Grey, fontFamily: 'Poppins-Medium', fontSize: hp(1.7) }}
                />
            </ImageBackground>
            <CharityTutorial setTutorialCount={setTutorialCount} setTutorialModal={setTutorialModal} tutorialModal={tutorialModal} tutoriaCount={tutoriaCount} />
            <ShareModal />
            <ContactListBottomSheet />
        </>
    )
}
export default Dashboard;

const FilterButtons = ({ title, resetFilter, applyFilter, loading }) => {
    return (
        <View style={styles.section3} >
            <TouchableOpacity onPress={resetFilter}>
                <View style={[styles.buttonStyle, { backgroundColor: Colors.LightestGrey, shadowColor: Colors.LightestGrey, }]}>
                    <Text style={[styles.buttonTextStyle, { color: Colors.Grey }]}>
                        Cancel
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={applyFilter} disabled={loading}>
                <View style={styles.buttonStyle}>
                    {!loading
                        ? <Text style={styles.buttonTextStyle}>
                            {title}
                        </Text>
                        :
                        <ActivityIndicator size="small" color="white" />
                    }
                </View>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    skeletonContainer: {
        backgroundColor: Colors.White,
        marginVertical: 5,
        marginEnd: 15,
        flexDirection: "row",
        height: hp(16),
        width: Platform.OS == 'android' ? wp('50%') : wp('50%'),
        borderRadius: 15,
        padding: 5,
    },
    skeletonContainer2: {
        backgroundColor: Colors.White,
        margin: 5,
        flexDirection: "column",
        height: hp(13),
        width: wp('32%'),
        borderRadius: 8,
        padding: 5,
        justifyContent: "space-between"

    },
    section3: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: oreintation == 'LANDSCAPE' ? "space-between" : 'space-around',
        zIndex: -1
    },
    buttonStyle: {
        backgroundColor: Colors.LightestBlue,
        width: wp(30),
        alignItems: 'center',
        justifyContent: 'center',
        height: hp(5.5),
        borderRadius: 8,
        elevation: 10,
        shadowOffset: { width: 0, height: 8 },
        shadowColor: Colors.Grey,
        shadowRadius: 10,
        shadowOpacity: 0.3,
        zIndex: 1,
    },
    buttonTextStyle: {
        fontSize: hp(1.6),
        color: Colors.White,
        fontFamily: 'Poppins-SemiBold'
    },
    spacing: {
        // paddingHorizontal: 20
    }, modalView: {
        height: "60%",
        backgroundColor: Colors.White,
        borderRadius: scale(20),
        padding: scale(10),
        flexDirection: "column"
    },
    modalButtomText: {
        fontSize: scale(14),
        fontFamily: 'Poppins-Medium',
        color: Colors.White
    },
    modalButton: {
        width: '80%',
        height: scale(40),
        alignItems: 'center',
        alignSelf: "center",
        justifyContent: 'center',
        marginVertical: scale(10),
        borderRadius: scale(20),
        backgroundColor: Colors.ThemeColor

    }
});