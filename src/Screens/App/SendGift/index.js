import React, { useState, useEffect, useContext } from 'react'
import { View, StyleSheet, StatusBar, ScrollView, Platform, KeyboardAvoidingView, Keyboard, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, FlatList, TouchableWithoutFeedback, Button, Linking } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import Slider from '@react-native-community/slider';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Icon } from 'react-native-elements';
import Modal from "react-native-modal";
import filter from 'lodash.filter';
// import Orientation from 'react-native-orientation';
import DeviceInfo from 'react-native-device-info';



// Utils----------------------------------------------------------------
import { Service } from '../../../Config/Services';
import { Colors } from '../../../Utils';
import { Icons } from '../../../Assets';

// Constants----------------------------------------------------------------
import AppTextInput from '../../../Constants/TextInput';
import AppTextArea from '../../../Constants/TextArea';
import AppButton from '../../../Constants/Button';
import AppHeader from '../../../Constants/Header';

// Stats----------------------------------------------------------------
import { addnotificationsdata } from '../../../Redux/NotificationsReducer';
import { addwishlistdata } from '../../../Redux/WishlistReducer';
import { adduserdata } from '../../../Redux/UserReducer';
import { AuthContext } from '../../../Context';
import { addmyfriendlistdata } from '../../../Redux/MyFriendlistReducer';
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { issettingstap } from '../../../Redux/ScreenReducer';
import Chips from '../../../Constants/Chips';
import { oreintation } from '../../../Helper/NotificationService';
import crashlytics from '@react-native-firebase/crashlytics';

const theme = {
    roundness: 2,
    colors: {
        primary: Colors.LightestBlue,
        accent: Colors.LightestBlue,
    },
};

// const initial = Orientation.getInitialOrientation();


function TutorialOne({ tutorialModal, setTutorialModal, tutoriaCount, setTutorialCount }) {
    return (
        <View>
            <Modal isVisible={tutorialModal}>
                <View style={{ flex: 1 }}>
                    {tutoriaCount == 0 &&
                        <TouchableOpacity
                            onPress={async () => {
                                setTutorialModal(!tutorialModal)
                                setTutorialCount(0);
                                await AsyncStorage.setItem('@tutorial_one', 'asd')
                            }}
                            style={{
                                position: 'absolute',
                                bottom: Platform.OS === 'android' ? -18 : oreintation == "LANDSCAPE" ? -35 : -5,
                                right: oreintation == "LANDSCAPE" ? 185 : -15,
                                height: 250, width: 200,
                                justifyContent: 'space-between'

                            }}>
                            <Text style={{ fontSize: hp(2.3), fontFamily: 'Lato-Regular', color: Colors.White }}>Tap here to invite &amp; add friends; edit your profile, or manage &amp; create new Wishlist.</Text>
                            <Icon name="arrowdown" type="antdesign" style={{ marginLeft: -25 }} size={40} color={Colors.White} />
                            <View style={{ width: 70, height: 70, borderRadius: 100 / 2, borderColor: Colors.White, borderWidth: 3, marginLeft: 52, alignItems: "center", justifyContent: 'center', }}>
                                <View style={{ backgroundColor: 'white', width: 55, height: 55, borderRadius: 100, alignItems: 'center', justifyContent: "center" }}>
                                    <Image source={Icons.friendIcon} style={{ height: 35, width: 35, resizeMode: 'contain', tintColor: Colors.LightestBlue }} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                </View>
            </Modal>
        </View>
    );
}
function TutorialTwo({ navigation, setTap, tutorialModal2, setTutorialModal2, tutoriaCount2, setTutorialCount2 }) {
    return (
        <View>
            <Modal isVisible={tutorialModal2}>
                <View style={{ flex: 1 }}>
                    {tutoriaCount2 == 0 ?
                        <TouchableOpacity
                            onPress={() => {
                                navigation.openDrawer();
                                setTutorialCount2(tutoriaCount2 + 1);
                            }}
                            style={{ flexDirection: "column", padding: 10, position: 'absolute', top: Platform.OS === 'android' ? -23 : oreintation == "LANDSCAPE" ? -30 : 9, right: oreintation == "LANDSCAPE" ? -60 : -15, height: hp(19), width: wp('100%'), justifyContent: 'space-between', alignItems: 'flex-start', }}>
                            <View style={{ width: 55, height: 55, borderRadius: 100 / 2, borderColor: Colors.White, borderWidth: 3, marginLeft: 0, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ width: 40, height: 40, borderRadius: 100 / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.LightestBlue, }}>
                                    <Image source={Icons.humburger} style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: Colors.White }} />
                                </View>
                            </View>
                            <Icon name="arrowup" type="antdesign" style={{ marginLeft: 10, }} size={40} color={Colors.White} />
                            <Text style={{ fontSize: hp(2.3), fontFamily: 'Lato-Regular', color: Colors.White, }}>Tap sidebar. Go to Settings.</Text>
                        </TouchableOpacity>
                        : tutoriaCount2 == 1
                        &&
                        <TouchableOpacity
                            onPress={async () => {
                                setTutorialCount2(tutoriaCount2 + 1)
                                await AsyncStorage.setItem('@tutorial_two', 'asd');
                                await AsyncStorage.setItem('@tutorial_three', 'asd');
                                setTutorialModal2(false);
                                // navigation.navigate('MyAccounts')
                                // setOnTrue(false);
                                // AsyncStorage.setItem('@tutorial_three', 'asd')
                            }}
                            style={{ position: 'absolute', bottom: Platform.OS === 'ios' ? oreintation == "LANDSCAPE" ? hp(25) : hp(22) : hp(20), left: oreintation == "LANDSCAPE" ? -42 : -10, height: 200, width: wp('100%'), justifyContent: 'space-between', }}>
                            <View style={{ width: oreintation == "LANDSCAPE" ? wp('24%') : wp('70%'), height: hp(6.5), borderWidth: 3, borderColor: 'white', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ flexDirection: "row", paddingHorizontal: 5, backgroundColor: Colors.LightestBlue, width: oreintation == "LANDSCAPE" ? wp('23%') : wp('66%'), height: hp(5), borderRadius: 5, alignItems: "center", }}>
                                    <Icon name="bank" type="material-community" color="white" />
                                    <View style={{ flexDirection: "row", }}>
                                        <Text style={{
                                            marginLeft: 15,
                                            marginRight: 10,
                                            color: Colors.White,
                                            fontSize: hp(2.2),
                                            fontFamily: 'Lato-Regular'
                                        }}>Connect Bank Account</Text>
                                    </View>
                                </View>
                            </View>
                            <Icon name="arrowup" type="antdesign" style={{ ...oreintation == "LANDSCAPE" ? { left: -200 } : { left: 40 } }} size={40} color={Colors.White} />
                            <Text style={{ alignSelf: 'center', width: 200, top: 15, fontSize: hp(2.3), fontFamily: 'Lato-Regular', color: Colors.White, ...oreintation == "LANDSCAPE" ? { left: -200 } : { left: 60 } }}>Tap Connect Bank Account &amp; add your information.</Text>
                        </TouchableOpacity>
                    }
                </View>
            </Modal>
        </View>
    );
}
function TutorialThree({ navigation, tutorialModal3, setTutorialModal3, tutoriaCount3, setTutorialCount3 }) {
    return (
        <View>
            <Modal isVisible={tutorialModal3}>
                <View style={{ flex: 1 }}>
                    {tutoriaCount3 == 0
                        ? <TouchableOpacity
                            onPress={async () => {
                                setTutorialCount3(tutoriaCount3 + 1)
                            }}
                            style={{ position: 'absolute', top: Platform.OS === 'android' ? 57 : oreintation == "LANDSCAPE" ? 41 : 90, height: 200, width: oreintation == "LANDSCAPE" ? wp('100%') : wp('98%'), justifyContent: 'space-between', alignSelf: 'center' }}>
                            <View style={{ width: wp('95%'), height: 70, borderRadius: 18, borderColor: Colors.White, borderWidth: 3, alignSelf: 'center' }}>
                                <View style={{
                                    alignSelf: 'center',
                                    height: Platform.OS == 'android' ? hp(6) : hp(5.5),
                                    width: wp('95%'),
                                    paddingHorizontal: 10,
                                }}>
                                    <View style={{
                                        marginVertical: 10,
                                        backgroundColor: Colors.White,
                                        flexDirection: 'row',
                                        width: oreintation == "LANDSCAPE" ? wp('93%') : wp('90%'),
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        borderRadius: 6,
                                        borderWidth: .5, borderColor: Colors.LightestGrey,
                                        height: Platform.OS == 'android' ? hp(6.2) : hp(5.5),
                                        shadowColor: Colors.Grey,
                                        shadowOpacity: 0.3,
                                        shadowOffset: { width: 0, height: 8 },
                                        shadowRadius: 10,
                                        elevation: 10,
                                    }}>
                                        <View style={{
                                            backgroundColor: Colors.White,
                                            color: Colors.Grey,
                                            fontFamily: 'Lato-Regular',
                                            fontSize: hp(1.6),
                                            width: wp('90%'),
                                            height: Platform.OS == 'android' ? hp(6) : hp(5),
                                            paddingHorizontal: 10,
                                            borderRadius: 8,
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            flexDirection: "row"
                                        }}>
                                            <Text style={{ color: Colors.Grey, fontFamily: 'Lato-Regular', fontSize: hp(1.6), }}>{'Recipient'}</Text>
                                            <Icon name="chevron-small-down" type="entypo" size={25} color={Colors.Grey} />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <Icon name="arrowdown" type="antdesign" style={{}} size={40} color={Colors.White} />
                            <Text style={{ alignSelf: 'center', width: 200, fontSize: hp(2.3), fontFamily: 'Lato-Regular', color: Colors.White }}>Send customized GFTs to someone special who deserves the best.</Text>
                        </TouchableOpacity>
                        : tutoriaCount3 == 1 &&
                        <TouchableOpacity
                            onPress={async () => {
                                setTutorialModal3(false);
                                setTutorialCount3(0)
                                await AsyncStorage.setItem('@tutorial_four', 'asd')
                            }}
                            style={{ position: 'absolute', bottom: Platform.OS === 'android' ? -18 : oreintation == "LANDSCAPE" ? -35 : -10, left: oreintation == "LANDSCAPE" ? 215 : 15, height: 200, width: 200, justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: hp(2.3), fontFamily: 'Lato-Regular', color: Colors.White }}>Tap here to view your Wishlists.</Text>
                            <Icon name="arrowdown" type="antdesign" style={{ marginLeft: -25 }} size={40} color={Colors.White} />
                            <View style={{ width: 70, height: 70, borderRadius: 100 / 2, borderColor: Colors.White, borderWidth: 3, marginLeft: 52, alignItems: "center", justifyContent: 'center', }}>
                                <View style={{ backgroundColor: 'white', width: 55, height: 55, borderRadius: 100, alignItems: 'center', justifyContent: "center" }}>
                                    <Image source={Icons.wishlistIcon} style={{ height: 30, width: 30, resizeMode: 'contain', tintColor: Colors.LightestBlue }} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                </View>
            </Modal>
        </View>
    );
}

export default function SendGFT({ navigation, route }) {
    // console.log('Routes===>', route.params.recipientId)
    const { signOut, trackData } = useContext(AuthContext);
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const setWishlist = (data) => dispatch(addwishlistdata(data));
    const setNotifications = (data) => dispatch(addnotificationsdata(data));
    const setUserData = (data) => dispatch(adduserdata(data));
    const setMyFriends = (data) => dispatch(addmyfriendlistdata(data));
    const setTap = (data) => dispatch(issettingstap(data));
    const userDetails = useSelector(state => state.UserReducer);
    // console.warn('User Details====>', userDetails)
    const recipientDatas = useSelector(state => state.MyFriendlistReducer);
    // console.log('My friends===>', recipientDatas)
    // const selectUser = recipientDatas.filter((users)=> users.other_user_id === route.params.recipientId)
    // console.log('selectedUser',selectedUser.name)
    
    // const bankAccounts = useSelector(state => state.MyBankAccountsReducer);
    const [selectedWishValue, setSelectedWishValue] = useState('');
    const [buttonLoading, setButtonLoading] = useState(false);
    const [tutorialModal, setTutorialModal] = useState(false);
    const [tutorialModal2, setTutorialModal2] = useState(false);
    const [tutorialModal3, setTutorialModal3] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [tutoriaCount, setTutorialCount] = useState(0);
    const [tutoriaCount2, setTutorialCount2] = useState(0);
    const [tutoriaCount3, setTutorialCount3] = useState(0);
    const [wishlistsData, setWishlistsData] = useState([]);
    const [fullData, setFullData] = useState([]);
    const [totalPrice, setTotalPrice] = useState('');
    const [productId, setProductId] = useState(null);
    const [loading, setloading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [gftPrice, setgftPrice] = useState('');
    const [message, setMessage] = useState("");
    const [checked, setChecked] = useState('');
    const [value1, setValue1] = useState(null);
    const [value3, setValue3] = useState('0');
    const [value4, setValue4] = useState('0');
    const [totalMargin, setTotalMargin] = useState(0);
    const [totalFee, setTotalFee] = useState(0);
    const [privacy, setPrivacy] = useState(0);
    const [itemId, setItemId] = useState('');
    const [itemPicture, setItemPicture] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isRecipientSelected, setIsRecipientSelected] = useState('');
    const [selectMultipleItems, setSelectMultipleItems] = useState([]);
    const [recBankData, setRecBankData] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [accStat, setAccStat] = useState("");
    const [checkDetailsRes, setCheckDetailsRes] = useState({});

    const [accMsg, setAccMsg] = useState("");
    const apiToken = userDetails?.api_token;


    // In this effect it will check for recipient id and then it will set friend name in to auto selected list
    useEffect(() => {
        if (!!route?.params?.recipientId) {
            const selectedUser = recipientDatas.find(user => user.other_user_id == route?.params?.recipientId);
            setIsRecipientSelected(selectedUser.user_info.name)
            setValue1(selectedUser?.other_user_id);
        }
    }, [route?.params?.recipientId]);

    const willUmount = async () => {
        setTotalPrice('');
        setgftPrice('');
        setMessage('');
        setPrivacy(false);
        setValue3(null);
        setValue4(null);
        setSelectedWishValue('')
        setItemId('');
        setChecked('')
        setItemPicture('')
        setSelectMultipleItems([]);
    };

    async function fetchList() {
        if (!!apiToken) await Service.GetMyWishList(apiToken, setWishlist, setloading);
    };

    const getWishlist = async (id) => {
        if (!!id) await Service.GetWishlistsByUserId(id, apiToken, setWishlistsData, setloading);
    };

    const checkDetails = async () => {
        if (!!apiToken) await Service.CheckProfileDetail(apiToken, setAccStat, setAccMsg, setCheckDetailsRes)
    };

    const getFriendlist = async () => {
        if (!!apiToken) await Service.GetFriendlist(apiToken, setMyFriends, setFullData, setloading);
    };

    const getBanks = async () => {
        if (!!apiToken) await Service.ShowbankDetails(apiToken, setBankAccounts, setloading,);
    };


    const handleSubmit = async () => {
        if (value1 == null) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Please select recipient',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        };

        if (productId == null) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Please select wish',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        };

        if (privacy == null) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Please select privacy',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        };

        if (message == "") {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Please enter message',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        };

        if (bankAccounts == [] || bankAccounts.length == 0) {
            setIsVisible(true);
            return false;
        };

        const obj = {
            gifted_user_id: value1,
            type: 1,
            wish_id: selectMultipleItems.map(item => item.product_id),
            product_id: selectMultipleItems.map(item => item.product_id),
            price: selectMultipleItems.map(item => item.totalValue),
            tax: selectMultipleItems.map(item => item.totalTax),
            tip: selectMultipleItems.map(item => item.totalTip),
            privacy: privacy,
            message: message,
            gft_name: selectedWishValue,
        };

        navigation.navigate('SetPlans', {
            data: obj,
            totalPrice: Number(gftPrice).toFixed(2),
            myFriends: recipientDatas,
            totalTax: Number(value3),
            totalMargin: totalMargin,
            totalFee: totalFee,
            totalTip: Number(value4),
            itemPicture: itemPicture,
            itemName: selectedWishValue,
            willUmount: willUmount,
        });
    };

    const handleContinue = () => {
        if (accStat == "in_complete" || accStat == "pending") {
            navigation.navigate('Profile', {
                screen: 'EditProfile',
            })
            setIsVisible(false)
        }
        else if (accStat == "unverified") {
            navigation.navigate('Profile', {
                screen: 'EditProfile',
            })
            setIsVisible(false);
        }
        else {
            navigation.navigate('MyAccounts');
            setIsVisible(false);
        }

    }

    const StateSetter = (a, b, c, d, e) => {
        setTotalPrice(a ? a : '');
        setProductId(c);
        setItemId(c);
        setItemPicture(e)
    };

    const appVersion = DeviceInfo.getVersion();

    const SessionExpired = async () => {
        await Service.CheckToken(signOut);
        // if (!!apiToken) await Service.ProfileInfo(apiToken, setloading, setUserData,);

    };

    async function appCheck() {
        await Service.CheckAppVersions(appVersion);
    };

    useEffect(() => {
        appCheck();
    }, [appVersion]);

    const selectWish = async () => {
        if (value1 == null) {
            Toast.show({
                type: 'tomatoToast',
                text1: "Attention",
                text2: 'Please select recipient first.',
                autoHide: true,
                position: 'top',
                visibilityTime: 2000,
            });
            return false;
        }
        await navigation.navigate('MyWishlist', {
            userId: value1,
            StateSetter: StateSetter,
            itemId: itemId,
            selectMultipleItems2: selectMultipleItems,
            setSelectMultipleItems2: setSelectMultipleItems,
        })
    };

    const checkForTutorial1 = async () => {
        await AsyncStorage.getItem('@tutorial_one').then(async (result) => {
            if (!!result) {
                setTutorialModal(false);
                await checkForTutorial2();
            }
            if (result == null) {
                setTutorialModal(true);
            }
        })
    };

    const checkForTutorial2 = async () => {
        const checkTutoralFive = await AsyncStorage.getItem('@tutorial_five');
        if (!!checkTutoralFive) {
            const checkTutoralTwo = await AsyncStorage.getItem('@tutorial_two');
            if (!!checkTutoralTwo) {
                setTutorialModal2(false);
                if (!!checkTutoralTwo && isFocused) {
                    await checkForTutorial3();

                }
            }
            if (checkTutoralTwo == null) {
                setTutorialModal2(true);
            }
        }
    };

    const checkForTutorial3 = async () => {
        const checkTutoralThree = await AsyncStorage.getItem('@tutorial_three');
        if (!!checkTutoralThree && isFocused) {
            setTimeout(() => {
                checkTutoralFour();
            }, 500)
        }
    };

    const checkTutoralFour = async () => {
        const checkTutoralFour = await AsyncStorage.getItem('@tutorial_four');
        if (!!checkTutoralFour) {
            setTutorialModal3(false);
        }
        if (checkTutoralFour == null) {
            setTutorialModal3(true);
        }
    };


    useEffect(() => {
        checkForTutorial1();
        checkDetails();
        if (!!apiToken) trackData(apiToken, 'Page Viewed', 'Send GFT');
        setTimeout(() => {
            fetchList();
            getFriendlist();
            getWishlist();
            getBanks();
        }, 1500);

        if (!!apiToken || userDetails == undefined) {
            SessionExpired();
        };

    }, [isFocused]);

    const [query, setQuery] = useState('');
    const [found, setFound] = useState('');

    const handleSearch = text => {
        const formattedQuery = text.toLowerCase();

        const filteredData = filter(fullData, user => {
            return contains(user.user_info, formattedQuery);
        });

        setMyFriends(filteredData);

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

    function calculationOfSubItems() {
        let totalNum = [];

        if (selectMultipleItems.length > 1) {
            selectMultipleItems.forEach(item => {
                // console.log('ForEach Items', item.totalValue)
                totalNum.push(Number(item.totalValue).toFixed(2))
                setSelectedWishValue('Multiple GFTs')
            });

            const sum = totalNum.reduce((partialSum, a) => Number(partialSum) + Number(a), 0);
            setgftPrice(sum);
        }
        else {
            selectMultipleItems.forEach(item => {
                setgftPrice(item.totalValue);
                setSelectedWishValue(item?.product_name);
            });
        }
    }
    function calculationOfSubItemsTax() {
        let totalTax = [];

        if (selectMultipleItems.length > 1) {
            selectMultipleItems.forEach(item => {
                totalTax.push(Number(item.totalTax))
            });
            const sumOfTax = totalTax.reduce((partialSum, a) => Number(partialSum) + Number(a), 0);
            setValue3(sumOfTax)
        }
        else {
            selectMultipleItems.forEach(item => {
                // console.log('For Each For One Item Items', item.totalValue)
                setValue3(item.totalTax)
                // setSelectedWishValue(item?.product_name)
            });
        }
    };

    function calculationOfSubItemsTip() {
        let totalTip = [];
        if (selectMultipleItems.length > 1) {
            selectMultipleItems.forEach(item => {
                // console.log('ForEach Items', item)
                totalTip.push(Number(item.totalTip));
                // setSelectedWishValue('Multiple GFTs')
            });
            const sumOfTip = totalTip.reduce((partialSum, a) => Number(partialSum) + Number(a), 0);
            setValue4(sumOfTip)
        }
        else {
            selectMultipleItems.forEach(item => {
                // console.log('For Each For One Item Items', item.totalValue)
                setValue4(item.totalTip)
                // setSelectedWishValue(item?.product_name)
            });
        }
    };

    function calculationOfSubItemsMargin() {
        let totalMargin = [];
        let totalFee = [];
        if (selectMultipleItems.length > 1) {
            selectMultipleItems.forEach(item => {
                // console.log('ForEach Items', item)
                totalMargin.push(Number(item.margin))
                totalFee.push(Number(item.totalServiceFee))
                // setSelectedWishValue('Multiple GFTs')
            });
            const sumOfMargin = totalMargin.reduce((partialSum, a) => Number(partialSum) + Number(a), 0);
            const sumOfTotalFee = totalFee.reduce((partialSum, a) => Number(partialSum) + Number(a), 0);
            // console.log('sumOfTotalFee', sumOfTotalFee);
            setTotalMargin(sumOfMargin)
            setTotalFee(sumOfTotalFee)

        }
        else {
            selectMultipleItems.forEach(item => {
                // console.log('For Each For One Item Items', item.totalValue)
                setTotalMargin(item.margin)
                setTotalFee(Number(item.totalServiceFee))
                // setSelectedWishValue(item?.product_name)
            });
        }
    };

    useEffect(() => {
        if (!!selectMultipleItems) {
            calculationOfSubItems()
            calculationOfSubItemsTax()
            calculationOfSubItemsTip()
            calculationOfSubItemsMargin()
        }
    }, [selectMultipleItems])

    return (
        <>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={Colors.LightestBlue} />
            {<View style={{ height: Platform.OS == 'android' ? hp(4) : hp(4), backgroundColor: Colors.LightestBlue }} />}
            <AppHeader onPressed={() => navigation.openDrawer()} leftIcon={Icons.humburger} text="SEND GFT" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView style={{ backgroundColor: 'white' }} >
                    <View style={styles.container} >
                        <View style={{ flex: 1, }}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: 'white',
                                    marginTop: 10,
                                    alignSelf: 'center',
                                    width: oreintation == 'LANDSCAPE' ? wp('95%') : wp('90%'),
                                    height: Platform.OS == 'android' ? hp(6) : hp(5.5),
                                    borderRadius: 8,
                                    borderColor: Colors.LightGrey,
                                    shadowOffset: { width: 0, height: 8 },
                                    shadowColor: Colors.Grey,
                                    shadowOpacity: 0.3,
                                    shadowRadius: 10,
                                    elevation: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: "space-between",
                                    paddingHorizontal: 10,
                                    borderWidth: .5,
                                    borderColor: Colors.LightestGrey,
                                }}
                                onPress={() => setIsOpen(!isOpen)}
                            >
                                <Text style={{
                                    color: Colors.Grey,
                                    fontSize: hp(1.6),
                                    fontFamily: 'Poppins-Regular',
                                }}>{isRecipientSelected !== '' ? isRecipientSelected : 'Recipient'}</Text>
                                <Icon name="angle-down" type="font-awesome" size={24} color={Colors.Grey} style={{ marginEnd: 1 }} />
                            </TouchableOpacity>
                            {isOpen && <View
                                style={{
                                    backgroundColor: 'white',
                                    marginTop: 10,
                                    alignSelf: 'center',
                                    width: oreintation == 'LANDSCAPE' ? wp('95%') : wp('90%'),
                                    height: hp(27),
                                    borderRadius: 8,
                                    borderColor: Colors.LightGrey,
                                    shadowOffset: { width: 0, height: 8 },
                                    shadowColor: Colors.Grey,
                                    shadowOpacity: 0.3,
                                    shadowRadius: 10,
                                    elevation: 10,
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: "space-between",
                                    paddingHorizontal: 10,
                                    position: 'absolute',
                                    zIndex: 2,
                                    top: 50,
                                    borderWidth: .5, borderColor: Colors.LightestGrey,
                                }}
                            >
                                <View style={{
                                    backgroundColor: Colors.White, marginTop: 10, alignSelf: 'center', width: oreintation == 'LANDSCAPE' ? wp('92%') : wp('85%'), height: hp(5), borderRadius: 8, borderColor: Colors.LightGrey,
                                    alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 10, borderWidth: 1, borderColor: Colors.LightBlue
                                }}>
                                    <TextInput placeholder="Search..." placeholderTextColor={Colors.Grey} placeholderStyle={{
                                        color: Colors.Grey,
                                        fontFamily: 'Poppins-Regular',
                                        fontSize: hp(1),
                                    }} style={{ color: Colors.Grey, width: wp('80%'), height: Platform.OS == 'android' ? hp(5.5) : hp(4.5), fontFamily: 'Poppins-Regular' }}
                                        onChangeText={text => handleSearch(text)}
                                        value={query}
                                    />
                                </View>
                                {
                                    isRecipientSelected !== '' ? <View
                                        style={{
                                            padding: 10, width: oreintation == 'LANDSCAPE' ? wp('92%') : wp('85%'), alignSelf: 'center', justifyContent: "space-between", flexDirection: 'row',
                                            borderBottomWidth: 1, borderBottomColor: Colors.Blue
                                        }}>
                                        <Text style={{
                                            color: Colors.Black,
                                            fontSize: hp(1.6),
                                            fontFamily: 'Poppins-Regular',
                                        }}>{isRecipientSelected}</Text>
                                        <Icon onPress={() => { setIsRecipientSelected(''), setSelectMultipleItems([]) }} name="close" size={20} color={Colors.Grey} style={{ marginEnd: 1 }} />
                                    </View>
                                        : null
                                }
                                <ScrollView contentContainerStyle={{ marginTop: 5, }}>
                                    {recipientDatas.length > 0
                                        ?
                                        <FlatList
                                            contentContainerStyle={{ marginTop: 5, padding: 10, }}
                                            horizontal={false}
                                            data={recipientDatas}
                                            renderItem={({ item, index }) => {
                                                return (
                                                    <TouchableOpacity
                                                        onPress={async () => {
                                                            setIsOpen(false);
                                                            setIsRecipientSelected(item?.user_info.name)
                                                            setValue1(item?.user_info.id);
                                                            await getWishlist(item?.user_info.id);
                                                            setTotalPrice('');
                                                            setgftPrice('');
                                                            setSelectedWishValue('');
                                                            setSelectMultipleItems([]);
                                                            setItemId('');
                                                            setItemPicture('');
                                                        }} style={{ width: oreintation == 'LANDSCAPE' ? wp('92%') : wp('78%'), marginVertical: 10, alignSelf: 'center' }}>
                                                        <Text
                                                            style={{
                                                                color: Colors.Grey,
                                                                fontSize: hp(1.7),
                                                                fontFamily: 'Poppins-Regular',
                                                            }}
                                                        >{item?.user_info.name}</Text>
                                                    </TouchableOpacity>
                                                )
                                            }}
                                        />
                                        : <View style={{ alignItems: "center", width: wp('90%'), }}>
                                            <Text style={{ textAlign: 'center', color: Colors.Black, fontSize: hp(1.8), fontFamily: 'Poppins-Regular', alignSelf: "center" }}>{found != '' ? found : 'No Friends Yet'}.</Text>
                                        </View>
                                    }
                                </ScrollView>

                            </View>
                            }
                            <TouchableOpacity style={{
                                alignItems: "center",
                                zIndex: Platform.OS != 'android' ? 1000 : 1000,
                                height: Platform.OS == 'android' ? hp(6) : hp(5.5),
                                width: wp('100%'),
                                paddingHorizontal: 10,
                                zIndex: -2,
                                marginTop: 20,
                                marginBottom: 10,
                            }}
                                onPress={selectWish}
                            >
                                <View style={{
                                    backgroundColor: Colors.White,
                                    flexDirection: 'row',
                                    width: oreintation == 'LANDSCAPE' ? wp('95%') : wp('90%'),
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderRadius: 6,
                                    borderWidth: .5, borderColor: Colors.LightestGrey,
                                    height: Platform.OS == 'android' ? hp(6.2) : hp(5.5),
                                    shadowColor: Colors.Grey, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 8 }, shadowRadius: 10, elevation: 10
                                }}
                                >
                                    <View style={{
                                        backgroundColor: Colors.White,
                                        color: Colors.Grey,
                                        fontFamily: 'Lato-Regular',
                                        fontSize: hp(1.6),
                                        width: wp('80%'),
                                        height: Platform.OS == 'android' ? hp(6) : hp(5),
                                        paddingHorizontal: 10,
                                        borderRadius: 8,
                                        alignItems: 'flex-start',
                                        justifyContent: 'center'
                                    }}>
                                        <Text style={{ color: Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(1.6), }}>{selectedWishValue !== '' ? selectedWishValue : selectMultipleItems.length > 1 ? 'Multiple GFTs' : 'Select Wishlist'}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', flexWrap: "wrap", alignSelf: oreintation == 'LANDSCAPE' ? 'flex-start' : 'center', zIndex: -1, marginHorizontal: oreintation == 'LANDSCAPE' ? 30 : 20, }}>
                                {selectMultipleItems.length > 1 && selectMultipleItems.map((item, index) => {
                                    return (
                                        <Chips key={index.toString()} text={item.product_name} price={item.totalValue} onPress={
                                            () => {
                                                const newArr = selectMultipleItems.filter(object => {
                                                    return object.product_name !== item.product_name;
                                                });
                                                setSelectMultipleItems(newArr);
                                                // console.log('newArr', newArr);
                                            }
                                        } />
                                    )
                                })}
                            </View>
                            <View style={{ alignSelf: 'center', zIndex: -1, }}>
                                <AppTextInput dollar value={gftPrice != '' ? "$ " + Number(gftPrice).toFixed(2) : ''} onChangedText={setgftPrice} placeholder="GFT Price" />
                            </View>
                            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                                <>
                                    <View style={{ marginHorizontal: 20, marginVertical: 10, marginLeft: oreintation == 'LANDSCAPE' ? 30 : 20 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={styles.checkLists}>
                                                <RadioButton.Android
                                                    theme={theme}
                                                    uncheckedColor={Colors.Grey}
                                                    value="first"
                                                    status={checked === 'first' ? 'checked' : 'unchecked'}
                                                    onPress={() => { setChecked('first'), setPrivacy(2) }}
                                                    style={{ width: 8, height: 8, }}
                                                />
                                                <Text style={styles.textStyle}>{'Public'}</Text>
                                                <>
                                                    <RadioButton.Android
                                                        theme={theme}
                                                        uncheckedColor={Colors.Grey}
                                                        value="first"
                                                        status={checked === 'second' ? 'checked' : 'unchecked'}
                                                        onPress={() => { setChecked('second'), setPrivacy(1) }}
                                                        style={{ width: 8, height: 8, }}
                                                    />
                                                    <Text style={styles.textStyle}>{'Private'}</Text>
                                                </>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ alignSelf: 'center', zIndex: -1 }}>
                                        <AppTextArea onChangedText={setMessage} value={message} maxLength={80} placeholder="Type your message" />
                                        <Text style={{ textAlign: 'right', color: Colors.Grey, fontFamily: 'Poppins-Regular' }}>{`${message.length}/80`}</Text>
                                    </View>
                                </>
                            </TouchableWithoutFeedback>
                            <View style={{ alignSelf: 'center', marginBottom: 40, flexDirection: 'row', }}>
                                <AppButton onPressed={() => handleSubmit()} loading={buttonLoading} text="SEND GFT" xlarge />
                            </View>
                            <View style={{ flex: 1, height: 30 }} />
                        </View>
                    </View >
                    {/* <Button title="Test Crash" onPress={() => crashlytics().crash()} /> */}
                </ScrollView>
            </KeyboardAvoidingView>
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
                    height: accStat == "in_complete" || accStat == "pending" ? hp(30) : hp(27),
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
                        {/* <Icon type="material" name="close" color={Colors.Grey} onPress={() => { setIsVisible(!isVisible) }} /> */}
                    </View>
                    <View style={{ marginVertical: 30 }}>
                        <View style={{ flexDirection: 'column', marginVertical: 5 }}>
                            <Text style={{ color: Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(2), textAlign: "center" }}>
                                {accStat == "in_complete" || accStat == "pending" ? accMsg : accStat == "unverified" ? accMsg : "Please, connect your Bank Account"}
                            </Text>
                            {/* <Text style={{ textAlign: "right", color: Colors.Grey, fontFamily: 'Lato-Regular', fontSize: hp(1.6), marginRight: 5 }}>{'{${wishlistsValue.length}/20}'}</Text> */}
                        </View>
                    </View>
                    <FilterButtons loading={btnLoading} resetFilter={() => { setIsVisible(!isVisible) }} applyFilter={handleContinue} accMsg={accStat} />
                </TouchableOpacity>
            </Modal>
            {/* {accStat == "in_complete" ? CheckProfileData() : accStat == "unverified" ? checkPending() : null} */}
            {/* <TutorialOne userDetails={userDetails} navigation={navigation} setTutorialCount={setTutorialCount} setTutorialModal={setTutorialModal} tutorialModal={tutorialModal} tutoriaCount={tutoriaCount} />
            <TutorialTwo navigation={navigation} setTap={setTap} setTutorialCount2={setTutorialCount2} setTutorialModal2={setTutorialModal2} tutorialModal2={tutorialModal2} tutoriaCount2={tutoriaCount2} />
            <TutorialThree navigation={navigation} setTutorialCount3={setTutorialCount3} setTutorialModal3={setTutorialModal3} tutorialModal3={tutorialModal3} tutoriaCount3={tutoriaCount3} /> */}
        </>
    );


};

const FilterButtons = ({ resetFilter, applyFilter, loading, accMsg }) => {
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
                            {accMsg == "in_complete" || accMsg == "pending" ? 'Complete Now' : accMsg == "unverified" ? 'Verify Now' : 'Connect Now'}
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
        backgroundColor: Colors.White,
    },
    checkLists: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textStyle: {
        color: Colors.Grey,
        fontSize: hp(1.8),
        fontFamily: 'Poppins-Regular',
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
        borderRadius: 5,
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
});