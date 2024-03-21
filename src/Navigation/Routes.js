import 'react-native-gesture-handler'
import React, { useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, Alert, Platform, ActivityIndicator, useWindowDimensions, Keyboard, StatusBar } from 'react-native';

// Libraries----------------------------------------------------------------
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { createDrawerNavigator, DrawerContentScrollView, useDrawerProgress, useDrawerStatus } from "@react-navigation/drawer";
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { checkUserPermission, oreintation } from '../Helper/NotificationService';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import Share from 'react-native-share';
import Modal from "react-native-modal";
import auth from '@react-native-firebase/auth';

// States----------------------------------------------------------------

import { addsignupdata, clearsignupdata } from '../Redux/SignupReducer';
import { adduserdata, clearuserdetails } from '../Redux/UserReducer';

// Constants----------------------------------------------------------------
import { Icons, Images } from '../Assets';
import { AuthContext } from '../Context';
import { Service } from '../Config/Services'

// Utils----------------------------------------------------------------
import { Colors } from '../Utils';

// Screens----------------------------------------------------------------
import Login from '../Screens/Auth/Login';
import SignUp from '../Screens/Auth/Signup';
import OTP from '../Screens/Auth/OTP';
import Feeds from '../Screens/App/Feeds';
import Wishlist from '../Screens/App/Wishlist';
import Friends from '../Screens/App/Friends';
import Shared from '../Screens/App/Share';
import ChangeNumber from '../Screens/App/ChangeNumber'
import Notifications from '../Screens/App/Notifications';
import Trending from '../Screens/App/Trending';
import MyTransaction from '../Screens/App/MyTransaction';
import AddWish from '../Screens/App/AddWish';
import GetHelp from '../Screens/App/GetHelp';
import TNC from '../Screens/App/TNC';
import ATNC from '../Screens/Auth/ATNC';
import PNP from '../Screens/App/PNP';
import EditWishes from '../Screens/App/EditWishes';
import Profile from '../Screens/App/Profile';
import Splash from '../Screens/onBoard/Splash';
import ProductDetails from '../Screens/App/ProductDetails';
import ForgotPassword from '../Screens/Auth/ForgotPassword';
import ViewFeeds from '../Screens/App/ViewFeeds';
import EditProfile from '../Screens/App/EditProfile';
import MyWishlist from '../Screens/App/MyWishlist';
import AddReviews from '../Screens/App/AddReviews';
import Settings from '../Screens/App/Settings';
import SendGFT from '../Screens/App/SendGift';
import SetPlans from '../Screens/App/SetPlans';
import NotificationReply from '../Screens/App/NotificationReply';
import Transfer from '../Screens/App/Transfer';
import { clearbankaccounts } from '../Redux/MyBankAccountsReducer';
import { clearwishlistdata } from '../Redux/WishlistReducer';
import { clearmyfriendlistdata } from '../Redux/MyFriendlistReducer';
import { clearnotificationsdata } from '../Redux/NotificationsReducer';
import { clearstorelistdata } from '../Redux/StorelistReducer';
import { clearfeedlistdata } from '../Redux/FeedsReducer';
import ManageWishlists from '../Screens/App/ManageWishlists';
import analytics from '@react-native-firebase/analytics';
import OnBoard from '../Screens/onBoard/Welcome';
import Referral from '../Screens/App/Referral';
import Dashboard from '../Screens/Dashboard';
import AwesomeAlert from 'react-native-awesome-alerts';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import MyNetInfo from '../Config/NetInfo';
import SignupStatus from '../Config/SignupStatus';
import { update_signup_status } from '../Redux/SignupStatusReducer';
import SelectSignupOption from '../Screens/Auth/SelectSignupOption';
import { scale } from 'react-native-size-matters';

const Tab = createBottomTabNavigator();
function MyTabBar({ state, descriptors, navigation }) {
    return (
        <View style={{ backgroundColor: "white" }}>
            <View style={styles.container}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;
                    const isFocused = state.index === index;
                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!isFocused && !event.defaultPrevented) {
                            if (route.name === 'Dashboard') navigation.navigate('Dashboard', { screen: 'SendGift' })
                            // navigation.navigate('Dashboard', { screen: 'SendGift' })
                            navigation.navigate({ name: route.name, merge: true });
                        }
                        if (route.name == 'Dashboard') navigation.navigate('Dashboard', { screen: 'SendGift' })
                    };
                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };
                    return (
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={{ flex: 1, alignItems: 'center', }}
                            key={index + 1}
                        >
                            <View style={styles.tabContent}>
                                {label != 'ChangeNumber' && <Image
                                    source={
                                        label == 'Feeds' || label == 'Opportunity'
                                            ? Icons.feedIcon
                                            : label == 'Wishlist'
                                                ? Icons.wishlist
                                                : label == 'Dashboard'
                                                    ? Icons.sendGiftIcon
                                                    : label == "Friends"
                                                        ? Icons.friendIcon
                                                        : label == 'Share'
                                                            ? Icons.shareIcon
                                                            : null
                                    }
                                    style={[{
                                        //  bottom: 5,
                                        width: label == 'Dashboard' ? scale(60) : scale(35),
                                        height: label == 'Dashboard' ? scale(60) : scale(35),
                                        resizeMode: label == 'Dashboard' ? "cover" : "contain",
                                        tintColor: label == 'Dashboard' ? null : isFocused ? Colors.LightestBlue : Colors.Grey
                                    }]}
                                />}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const horizontalAnimation = {
    headerShown: false,
    gestureDirection: 'horizontal',
    cardStyleInterpolator: ({ current, layouts }) => {
        return {
            cardStyle: {
                transform: [
                    {
                        translateX: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.width, 0],
                        }),
                    },
                ],
            },
        };
    },
};

const FeedsStack = createStackNavigator();
const FeedsStackScreens = () => (
    <FeedsStack.Navigator screenOptions={horizontalAnimation}>
        <FeedsStack.Screen initial={true} name="Feeds">
            {props => <Feeds {...props} />}
        </FeedsStack.Screen>
        <FeedsStack.Screen name="ViewFeeds">
            {props => <ViewFeeds {...props} />}
        </FeedsStack.Screen>
    </FeedsStack.Navigator>
);

const ProfileStack = createStackNavigator();
const ProfileStackScreens = () => (
    <ProfileStack.Navigator screenOptions={horizontalAnimation}>
        <ProfileStack.Screen initial={true} name="Friends">
            {props => <Profile {...props} />}
        </ProfileStack.Screen>
        <ProfileStack.Screen name="FindFriend">
            {props => <Friends {...props} />}
        </ProfileStack.Screen>
        <ProfileStack.Screen name="ManageWishlists">
            {props => <ManageWishlists {...props} />}
        </ProfileStack.Screen>
        <ProfileStack.Screen name="GftdToFriends">
            {props => <MyTransaction {...props} />}
        </ProfileStack.Screen>
        <ProfileStack.Screen name="EditProfile">
            {props => <EditProfile {...props} />}
        </ProfileStack.Screen>
        <ProfileStack.Screen name="Settings">
            {props => <Settings {...props} />}
        </ProfileStack.Screen>
        <ProfileStack.Screen name="ChangeNumber">
            {props => <ChangeNumber {...props} />}
        </ProfileStack.Screen>
    </ProfileStack.Navigator>
);



const AddWishStack = createStackNavigator();
const AddWishStackScreens = () => (
    <AddWishStack.Navigator initialRouteName="Wishlist" screenOptions={horizontalAnimation}>
        <AddWishStack.Screen name="Wishlist">
            {props => <Wishlist {...props} />}
        </AddWishStack.Screen>
        <AddWishStack.Screen name="AddWishes">
            {props => <AddWish {...props} />}
        </AddWishStack.Screen>
        <AddWishStack.Screen name="EditWishes">
            {props => <EditWishes {...props} />}
        </AddWishStack.Screen>
    </AddWishStack.Navigator>
);

const ProductsStack = createStackNavigator();
const ProductsStackScreens = () => (
    <ProductsStack.Navigator initialRouteName="ProductDetails" screenOptions={horizontalAnimation}>
        <ProductsStack.Screen name="ProductDetails">
            {props => <ProductDetails {...props} />}
        </ProductsStack.Screen>
        <ProductsStack.Screen name="AddReviews">
            {props => <AddReviews {...props} />}
        </ProductsStack.Screen>
    </ProductsStack.Navigator>
);


const SendGiftStack = createStackNavigator();
const SendfGiftStackScreens = () => (
    <SendGiftStack.Navigator initialRouteName="App" screenOptions={horizontalAnimation}>
        <SendGiftStack.Screen name="App" >
            {props => <Dashboard {...props} />}
        </SendGiftStack.Screen>
        <SendGiftStack.Screen name="SendGift" >
            {props => <SendGFT {...props} />}
        </SendGiftStack.Screen>
        <SendGiftStack.Screen name="MyWishlist" >
            {props => <MyWishlist {...props} />}
        </SendGiftStack.Screen>
        <SendGiftStack.Screen name="SetPlans" >
            {props => <SetPlans {...props} />}
        </SendGiftStack.Screen>
    </SendGiftStack.Navigator>
);

function MyTabs({ navigation }) {
    const isDrawerOpen = useDrawerStatus() === "open";
    const animatedValue = useSharedValue(1);
    const { width } = useWindowDimensions();
    // const { primary } = useTheme().colors;

    useEffect(() => {
        animatedValue.value = withTiming(isDrawerOpen ? 0.7 : 1, {
            duration: 250,
            easing: Easing.ease,
        });
    }, [isDrawerOpen]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: animatedValue.value }],
        borderRadius: interpolate(animatedValue.value, [0.7, 1], [10, 0]),
        padding: interpolate(animatedValue.value, [0.7, 1], [20, 0]),
        overflow: "hidden",
    }));
    return (
        <View style={{ flex: 1, backgroundColor: Colors.LightestBlue }}>
            <Animated.View
                style={[
                    animatedStyle,
                    { flex: 1, width, backgroundColor: "rgba(255,255,255,0.2)" },
                ]}
            >
                <View
                    style={[
                        {
                            flex: 1,
                            borderRadius: isDrawerOpen ? 10 : 0,
                            overflow: "hidden",
                        },
                    ]}
                >
                    <Tab.Navigator screenOptions={horizontalAnimation}
                        tabBar={props => <MyTabBar {...props} />}
                        initialRouteName="Dashboard"
                        backBehavior="initialRoute"
                    >
                        <Tab.Screen name="Feeds" >
                            {props => <FeedsStackScreens {...props} />}
                        </Tab.Screen>
                        <Tab.Screen name="Wishlist" >
                            {props => <AddWishStackScreens {...props} />}
                        </Tab.Screen>
                        <Tab.Screen name="Dashboard" >
                            {props => <SendfGiftStackScreens {...props} />}
                        </Tab.Screen>
                        <Tab.Screen name="Friends"  >
                            {props => <ProfileStackScreens {...props} />}
                        </Tab.Screen>
                        <Tab.Screen name="Share" >
                            {props => <Shared {...props} />}
                        </Tab.Screen>
                    </Tab.Navigator>
                </View>
            </Animated.View>
        </View >
    );
}


const onShare = async (userDetails, referralURL) => {
    const sharedOption = {
        title: 'Share with your friends',
        message: `I just joined GFTD! 🎁 Download so we can get GFTing - any time, anywhere 🎁  \n\nUse my Referral while signing up: ${referralURL}  \n\nDownload Now:`,
        url: 'https://gftdcamp1.enorness.com/device-checker.html',
    };
    try {
        const result = await Share.open(sharedOption);
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
            } else {
                // shared
            }
        } else if (result.action === Share.dismissedAction) {
            // dismissed
        }
    } catch (error) {
        console.log('onShare error', error.message);
    }
};

const CustomDrawerItems = ({ label, apiToken, type, icon, route, logout, navigation, alert, wallet, share, selected, setSelected, referralURL }) => {
    const Notification = useSelector(state => state.NotificationsReducer);
    const userDetails = useSelector(state => state.UserReducer)

    const { signOut, deleteAccount } = useContext(AuthContext);
    const [notificationsLength, setNotificationsLength] = useState('')
    const isDrawerOpen = useDrawerStatus() === 'open';

    useEffect(() => {
        AsyncStorage.getItem('@notifications_length').then((length) => {
            setNotificationsLength(JSON.parse(length));
        })
    }, [isDrawerOpen])

    return (
        <>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                    !!setSelected && setSelected(label);
                    alert ? Alert.alert(
                        "Delete Account",
                        "Do you want to delete your account?",
                        [
                            {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            {
                                text: "OK", onPress: () => deleteAccount(apiToken)
                            }
                        ]
                    ) : share
                        ? onShare(userDetails, referralURL)
                        : logout
                            ? signOut()
                            : navigation.navigate(route)
                                ? route == 'MyTransactions'
                                : navigation.navigate(route, { isProfile: false })
                                    ? navigation.navigate(route)
                                    : route == 'SendGift'
                                        ? navigation.navigate('Dashboard', { screen: 'SendGift' })
                                        : navigation.navigate(route)
                }}
                style={{
                    flexDirection: 'row',
                    height: 40,
                    marginBottom: 8,
                    alignItems: 'center',
                    paddingLeft: 12,
                    borderRadius: 8,
                    ...label == selected ? { backgroundColor: 'white' } : null
                }}
            >
                <View>
                    {
                        route == 'Notifications' && Notification.length !== notificationsLength
                            ?
                            <View style={{ position: 'absolute', top: 0, right: 0, zIndex: 2 }}>
                                <Icon name='circle' size={13} color="red" />
                            </View>
                            :
                            null
                    }
                    <Icon name={icon} type={type} color={label == selected ? Colors.LightestBlue : "#ffffff"} size={22} />
                </View>
                <Text
                    adjustsFontSizeToFit={true}
                    style={{
                        marginLeft: 15,
                        color: label == selected ? Colors.LightestBlue : Colors.White,
                        fontSize: wallet ? hp(1.7) : hp(1.7),
                        fontFamily: 'Poppins-Medium'
                    }}
                >
                    {label}
                </Text>

            </TouchableOpacity >

        </>
    )
};

const ExpandableDrawerItems = ({ isTap, label, icon, type, getWallet, collapse, setCollapse, setOnTrue, onTrue }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
                setCollapse(!collapse);
                onTrue == true && setOnTrue(true)
                // getWallet();
            }}
            style={{
                flexDirection: 'row',
                height: 40,
                marginBottom: 8,
                alignItems: 'center',
                paddingLeft: 12,
                borderRadius: 8,
            }}
        >
            <Icon name={icon} type={type} color="#ffffff" size={21} />
            <Text
                adjustsFontSizeToFit={true}
                style={{
                    marginLeft: 15,
                    marginRight: 10,
                    color: Colors.White,
                    fontSize: hp(1.7),
                    fontFamily: 'Poppins-Regular'
                }}
            >
                {label}
            </Text>
            {collapse ? <Icon name={'angle-up'} type={'font-awesome-5'} color="#ffffff" /> : <Icon name={'angle-down'} type={'font-awesome-5'} color="#ffffff" />}
        </TouchableOpacity>
    )
};

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

const DrawerContent = ({ navigation, }) => {
    const { signOut, deleteAccount } = useContext(AuthContext);
    const userDetails = useSelector(state => state.UserReducer);
    const isTap = useSelector(state => state.ScreenReducer);
    // console.log(isTap.isSettingsTap)
    const isFocused = useIsFocused();
    const apiToken = userDetails.api_token;
    const isDrawerOpen = useDrawerStatus() === 'open';
    const progress = useDrawerProgress();
    const [collapse, setCollapse] = useState(false);
    const [collapse2, setCollapse2] = useState(false);
    const [loading, setloading] = useState(false);
    const [walletAmount, setwalletAmount] = useState({});
    const [filePath, setFilePath] = useState('');
    const [token, setToken] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [recBankData, setRecBankData] = useState([]);
    const [selected, setSelected] = useState('Home')
    const [rewardsPoint, setRewardsPoints] = useState('');
    const [referralURL, setReferralURL] = useState('');
    const [myReferrals, setMyReferrals] = useState([]);

    const fetchReferralData = async () => {
        await Service.GetMyReferrals(apiToken, setReferralURL, setRewardsPoints, setMyReferrals, setloading);
    };


    const GetRecieveBankAccounts = async () => {
        if (!!apiToken) await Service.ShowbankDetails(apiToken, setBankAccounts, setloading);
    };

    const getWallet = async () => {
        if (!!apiToken) await Service.GetWallet(apiToken, setwalletAmount, setloading);
    };


    const redeem = async () => {
        if (!!walletAmount.wallet_available_amount !== 0 && bankAccounts.length !== 0) {
            setVisible(true)
            setCollapse2(false);
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
        await Service.BalancePayout(apiToken, data, setBtnLoading, setVisible);
    }

    const [onTrue, setOnTrue] = useState(false);
    async function check() {
        const tutorial = await AsyncStorage.getItem('@tutorial_three');
        if (!!tutorial) {
            setOnTrue(false)
        }
        if (tutorial == null) {
            setOnTrue(true)
        }
    }

    useEffect(() => {
        if (userDetails.api_token) {
            setTimeout(() => {
                getWallet();
                GetRecieveBankAccounts();
                fetchReferralData();
            }, 1000)
        };
    }, [userDetails])

    useEffect(() => {
        if (!isDrawerOpen == true) {
            setCollapse(false)
        }
        check()

    }, [isDrawerOpen]);

    return (
        <DrawerContentScrollView
            scrolable={true}
            contentContainerStyle={{ flex: 1, backgroundColor: Colors.ThemeColor, }}
        >
            <StatusBar barStyle={'light-content'} backgroundColor={Colors.ThemeColor} />
            <View style={{
                flex: 1,
                marginStart: 10,

            }}>
                <TouchableOpacity
                    activeOpacity={.7}
                    style={{
                        flexDirection: 'row',
                        marginTop: Platform.OS == 'ios' ? 5 : 10,
                        backgroundColor: "white",
                        borderRadius: 12,
                        borderColor: Colors.ThemeColor,
                        borderWidth: 2,
                        padding: 10,
                        // height:hp(14)
                    }}
                    onPress={() => navigation.navigate('Profile')}
                >
                    {
                        <View
                            style={{
                                width: 70,
                                height: 70,
                                borderRadius: 100 / 2,
                                borderWidth: 2,
                                backgroundColor: Colors.White,
                                borderColor: Colors.Blue,
                                alignItems: 'center',
                                justifyContent: 'center',
                                shadowColor: Colors.Grey,
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.3,
                                shadowRadius: 10,
                                elevation: 10,
                            }}
                        >
                            <Image source={userDetails.image !== "" ? { uri: userDetails.image } : Images.userProfile} style={{
                                width: 60,
                                height: 60,
                                borderRadius: 100 / 2,
                                resizeMode: 'cover'
                            }} />
                        </View>
                    }
                    <View
                        style={{
                            marginLeft: 10,
                            flexDirection: 'column',
                            justifyContent: 'space-around',
                            width: wp('40%'),
                            // position:"absolute",
                            // left:80
                        }}
                    >
                        <View style={{ flexDirection: 'column', }}>
                            <Text
                                numberOfLines={2}
                                style={{
                                    color: Colors.ThemeColor,
                                    // flex:.5,
                                    // width:'100%',
                                    fontSize: hp(1.7),
                                    fontFamily: 'Poppins-SemiBold',
                                }}>{`${userDetails.name != undefined ? userDetails?.name : ''}`}</Text>
                            <Text style={{
                                color: Colors.Blue,
                                fontSize: hp(1.5),
                                fontFamily: 'Poppins-Medium',
                            }}>{`@${userDetails.username != undefined ? userDetails?.username : ''}`}</Text>

                        </View>
                        <View
                            style={{
                                height: 1,
                                marginVertical: 2,
                                backgroundColor: Colors.ThemeColor,
                                // paddingHorizontal:20
                                width: 100
                            }}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                            <View>
                                <Text style={{ color: Colors.Blue, fontSize: hp(1.6), fontFamily: 'Poppins-Medium' }}>{'View Profile'}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={{ flex: 1, marginTop: 10, backgroundColor: Colors.LightestBlue }} >
                    {!collapse &&
                        <>
                            <CustomDrawerItems label="Home" icon="home" type="ionicon" navigation={navigation} route="Dashboard" selected={selected} setSelected={setSelected} />
                            <CustomDrawerItems label="Send GFT" icon="gift" type="ionicon" navigation={navigation} route="SendGift" selected={selected} setSelected={setSelected} />
                            <CustomDrawerItems label="Notifications" icon="notifications" type="ionicon" navigation={navigation} route="Notifications" selected={selected} setSelected={setSelected} />
                            <CustomDrawerItems label="Trending" icon="cart" type="ionicon" navigation={navigation} route="Trending" selected={selected} setSelected={setSelected} />
                            <CustomDrawerItems label="GFTD Transactions" icon="card" type="ionicon" navigation={navigation} route="MyTransactions" selected={selected} setSelected={setSelected} />
                            <CustomDrawerItems label="Add Wish" icon="add-circle" type="ionicon" navigation={navigation} route="AddWish" selected={selected} setSelected={setSelected} />
                            <CustomDrawerItems label="Share App" icon="share-social" type="ionicon" navigation={navigation} route="Share App" share selected={selected} setSelected={setSelected} referralURL={referralURL} />
                            <CustomDrawerItems label="Referral & Rewards" icon="ios-people" type="ionicon" navigation={navigation} route="Referral" selected={selected} setSelected={setSelected} />
                        </>
                    }
                    <ExpandableDrawerItems isTap={isTap} label="Preferences" icon="settings" type="ionicon" getWallet={() => { }} collapse={collapse} setCollapse={setCollapse} setOnTrue={setOnTrue} onTrue={onTrue} navigation={navigation} />
                    {!collapse && <CustomDrawerItems label="Get help" icon="mail" type="ionicon" navigation={navigation} route="GetHelp" selected={selected} setSelected={setSelected} />}
                    {/* {!collapse && <CustomDrawerItems label="Account Settings" icon="account-settings" type="material-community" navigation={navigation} route="Settings" />} */}
                    {collapse &&
                        <>
                            <CustomDrawerItems label="Privacy Policy" icon="privacy-tip" type="material" navigation={navigation} route="PNP" selected={selected} setSelected={setSelected} />
                            <CustomDrawerItems label="Terms &amp; Conditions" icon="newspaper" type="ionicon" navigation={navigation} route="TNC" selected={selected} setSelected={setSelected} />
                            <CustomDrawerItems label="Delete User Account" icon="delete" type="material" navigation={navigation} apiToken={apiToken} alert route="delete" selected={selected} setSelected={setSelected} />
                        </>
                    }
                </View>
                {collapse2 == false ? <CustomDrawerItems label="Logout" icon="logout" type="material" navigation={navigation} route="Login" logout /> : null}
            </View>
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
                        {/* <Icon type="material" name="close" color={Colors.Grey} onPress={() => { setIsVisible(!isVisible) }} /> */}
                    </View>
                    <View style={{ marginVertical: 30 }}>
                        <View style={{ flexDirection: 'column', marginVertical: 5 }}>
                            <Text style={{ color: Colors.Grey, fontFamily: 'Poppins-Regular', fontSize: hp(2), textAlign: "center" }}>
                                Please, connect your Bank Account
                            </Text>
                            {/* <Text style={{ textAlign: "right", color: Colors.Grey, fontFamily: 'Lato-Regular', fontSize: hp(1.6), marginRight: 5 }}>{'{${wishlistsValue.length}/20}'}</Text> */}
                        </View>
                    </View>
                    <FilterButtons title="Connect Now" loading={btnLoading} resetFilter={() => { setIsVisible(!isVisible) }} applyFilter={handleContinue} />
                </TouchableOpacity>
            </Modal>
            <Modal animationType="slide"
                isVisible={visible}
                onRequestClose={() => {
                    setVisible(!visible);
                }}>
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
                    <View style={{ marginVertical: 0 }}>
                        <View style={{ flexDirection: 'column', marginVertical: 5 }}>
                            <Text style={{ color: Colors.Grey, fontFamily: 'Poppins-SemiBold', fontSize: hp(2), textAlign: "center" }}>
                                {`Available to pay out: $${walletAmount?.wallet_available_amount} USD\n Available soon: $${walletAmount?.wallet_pending_amount} USD`}
                            </Text>
                            <Text style={{ textAlign: "center", color: Colors.Red, fontFamily: 'Poppins-Regular', fontSize: hp(1.6), }}>{"\nYou can only tranfer available amount!"}</Text>
                            {/* <Text style={{ textAlign: "center", color: Colors.Red, fontFamily: 'Poppins-Regular', fontSize: hp(1.4), }}>{"Note: Minimum Transferable Amount $50"}</Text> */}

                        </View>
                    </View>
                    <View style={styles.section3} >
                        <TouchableOpacity onPress={() => setVisible(!visible)}>
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
                            <View style={[styles.buttonStyle, {
                                backgroundColor: walletAmount.wallet_available_amount > 0 ? Colors.LightestBlue : Colors.Grey
                            }
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
        </DrawerContentScrollView>
    );
};

const Drawer = createDrawerNavigator();
const DrawerNavigator = (props) => {
    return (
        <Drawer.Navigator
            drawerContent={({ navigation }) => {
                return (
                    <DrawerContent
                        navigation={navigation}
                    />
                )
            }}
            screenOptions={{
                headerShown: false,
                drawerType: "slide",
                drawerStyle: { width: 260, backgroundColor: Colors.LightestBlue },
                overlayColor: "transparent",
            }}
        >
            <Drawer.Screen name="Home" >
                {props => <MyTabs {...props} />}
            </Drawer.Screen>
            <Drawer.Screen name="Notifications" >
                {props => <Notifications {...props} />}
            </Drawer.Screen>
            <Drawer.Screen name="Trending" >
                {props => <Trending {...props} />}
            </Drawer.Screen>
            <Drawer.Screen name="PNP" >
                {props => <PNP {...props} />}
            </Drawer.Screen>
            <Drawer.Screen name="TNC" >
                {props => <TNC {...props} />}
            </Drawer.Screen>
            <Drawer.Screen name="Referral" >
                {props => <Referral {...props} />}
            </Drawer.Screen>
            <Drawer.Screen name="MyTransactions" >
                {props => <MyTransaction {...props} />}
            </Drawer.Screen>
            <Drawer.Screen name="AddWish" >
                {props => <AddWish {...props} />}
            </Drawer.Screen>
            <Drawer.Screen name="FindFriend" >
                {props => <Friends {...props} />}
            </Drawer.Screen>
            <Drawer.Screen name="GetHelp" >
                {props => <GetHelp {...props} />}
            </Drawer.Screen>
            <Drawer.Screen name="Profile" >
                {props => <ProfileStackScreens {...props} />}
            </Drawer.Screen>
            <Drawer.Screen name="Products" >
                {props => <ProductsStackScreens {...props} />}
            </Drawer.Screen>
            <Drawer.Screen name="NotificationReply" >
                {props => <NotificationReply {...props} />}
            </Drawer.Screen>
            <Drawer.Screen name="Transfer" >
                {props => <Transfer {...props} />}
            </Drawer.Screen>
        </Drawer.Navigator>
    );
};

// App Stack containers
const AppStack = createStackNavigator();
const AppStackScreens = () => (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
        <AppStack.Screen name="Drawer" component={DrawerNavigator} />
    </AppStack.Navigator>
);

// Auth Stack containers
const AuthStack = createStackNavigator();
const AuthStackScreens = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen initial={true} name="Login" component={Login} />
        <AuthStack.Screen name="SelectSignupOption" component={SelectSignupOption} />
        <AuthStack.Screen name="OTP" component={OTP} />
        <AuthStack.Screen name="SignUp" component={SignUp} />
        <AuthStack.Screen name="ATNC" component={ATNC} />
        <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
    </AuthStack.Navigator>
);

// Root Stack
const RootStack = createStackNavigator();
const RootStackScreens = ({ onboarding, accessToken, inviteFriendsToken }) => {
    let isAuth = false;

    useEffect(() => {
        AsyncStorage.getItem('@accessToken').then((value) => {
            if (value) {
                isAuth = true;
            };
        });
    }, []);
    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {
                // onboarding == null
                //     ? <RootStack.Screen name="OnBoard" component={OnBoard} />
                //     : 
                !!accessToken || isAuth
                    ? <RootStack.Screen name="App" component={AppStackScreens} />
                    :
                    < RootStack.Screen name="Auth" component={AuthStackScreens} />
            }
        </RootStack.Navigator>
    );
};

export default () => {
    const userDetails = useSelector(state => state.UserReducer);
    const [isLoading, setIsLoading] = useState(true);
    const [onboarding, setOnboarding] = useState('');
    const [inviteFriendsToken, setInviteFriendsToken] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const dispatch = useDispatch();
    const clearSignUpData = () => dispatch(clearsignupdata());
    const clearUserDetails = () => dispatch(clearuserdetails());
    const clearbankaccount = () => dispatch(clearbankaccounts());
    const clearwishlist = () => dispatch(clearwishlistdata());
    const clearnotifications = () => dispatch(clearnotificationsdata());
    const clearmyfriendlist = () => dispatch(clearmyfriendlistdata());
    const clearstorelist = () => dispatch(clearstorelistdata());
    const clearfeedlist = () => dispatch(clearfeedlistdata());
    const addSignupData = (data) => dispatch(addsignupdata(data));
    const updateSigninStatus = (data) => dispatch(update_signup_status(data));

    const authContext = useMemo(() => {
        return {
            loading: () => {
                setIsLoading(true);
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
            },
            signIn: (
                obj,
                setloading,
                adduserData,
                navigation
            ) => {
                Service.login(
                    obj,
                    setloading,
                    adduserData,
                    navigation,
                    setAccessToken,
                    addSignupData,
                    // updateSigninStatus
                );
            },
            signUp: async (data, confirm, navigation,) => {
                Service.signup(
                    data,
                    confirm,
                    navigation,
                );
            },
            CheckPhone: async (data, setLoading) => {
                // this retrun keyword is used to get the response generated from this method below
                return Service.CheckPhone(
                    data,
                    setLoading
                );
            },
            OTP: async (data, navigation, setloading, updateSignupData) => {
                Service.OTP(
                    data,
                    navigation,
                    setloading,
                    updateSignupData,
                );
            },
            socialSignup: async (data, setloading, adduserData,) => {
                await Service.SocialSignup(
                    data,
                    setloading,
                    adduserData,
                    setAccessToken,
                );
            },
            NewSignup: async (data, setloading, adduserData) => {
                await Service.NewSignup(
                    data,
                    setloading,
                    adduserData,
                    setAccessToken,
                );
            },

            completeProfile: async (data, device_token, apiToken, navigation, setloading, adduserData, setIsSSNVisible) => {
                Service.CompleteProfile(
                    data,
                    device_token,
                    apiToken,
                    navigation,
                    setloading,
                    adduserData,
                    setIsSSNVisible,
                    setAccessToken,
                    updateSigninStatus,
                );
            },
            updateProfile: async (data, apiToken, navigation, adduserData, setloading, getProfileImage, callAfterTenSeconds) => {
                await Service.UpdateProfile(
                    data,
                    apiToken,
                    navigation,
                    adduserData,
                    setloading,
                    getProfileImage,
                    callAfterTenSeconds,
                    updateSigninStatus,
                );
            },
            forgotPassword: async (data, setloading) => {
                await Service.ForgotPassword(data, setloading,);
            },
            signOut: () => {
                setIsLoading(false);
                clearSignUpData();
                clearUserDetails();
                clearbankaccount();
                clearwishlist();
                clearnotifications();
                clearmyfriendlist();
                clearstorelist();
                clearfeedlist();
                setAccessToken(null);
                AsyncStorage.setItem('@accessToken', '');
                AsyncStorage.removeItem('@user');
                auth().signOut()
            },
            deleteAccount: async (apiToken) => {
                // console.log('apiToken deleteing', apiToken)
                await analytics().logEvent('delete_account', {
                    id: `${userDetails.id}`,
                    name: `${userDetails.name}`,
                    email: `${userDetails.email}`,
                    blockchain_address: `${userDetails.blockchain_address}`,
                    created_at: `${userDetails.created_at}`,
                    deleted_at: `${userDetails.deleted_at}`,
                    dob: `${userDetails.dob}`,
                    doc_kyc: `${userDetails.doc_kyc}`,
                    friend_count: `${userDetails.friend_count}`,
                    gift_count: `${userDetails.gift_count}`,
                    mobile: `${userDetails.mobile}`,
                    created_wishes: `${userDetails.my_wishlist.length}`
                });
                await Service.DeleteAccount(apiToken);
                setIsLoading(false);
                clearSignUpData();
                clearUserDetails();
                clearbankaccount();
                clearwishlist();
                clearnotifications();
                clearmyfriendlist();
                clearstorelist();
                clearfeedlist();
                auth().signOut()
                setAccessToken(null);
                AsyncStorage.setItem('@accessToken', '');
                AsyncStorage.removeItem('@user');
                AsyncStorage.removeItem('@biometric');
                AsyncStorage.removeItem('@tutorial');
            },
            onboard: () => {
                setOnboarding('true');
                AsyncStorage.setItem('@onboarding', 'asdf');
            },
            trackData: async (apiToken, eventName, eventTitle) => {
                const data = {
                    event_name: `${eventName}`,
                    page_title: `${eventTitle}`
                };
                await Service.TrackUser(apiToken, data);
            },
            trackItems: async (apiToken, title, eventName) => {
                const data = {
                    "event_name": "Item Viewed",
                    "page_title": `${title}`,
                    "item_name": `${eventName}`
                };
                await Service.TrackItems(apiToken, data);
            },
        };
    }, []);

    const initializer = async () => {
        await AsyncStorage.getItem('@accessToken').then(async (value) => {
            setIsLoading(true);
            setAccessToken(value);
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        });
    }

    useEffect(() => {
        initializer();
    }, []);

    if (isLoading) {
        return <Splash />;
    };

    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer style={{ backgroundColor: 'white' }}>
                <RootStackScreens onboarding={onboarding} accessToken={accessToken} />
                <MyNetInfo />
                <SignupStatus />
            </NavigationContainer>
        </AuthContext.Provider>

    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: Platform.OS == 'android' ? hp(7) : hp(7),
        width: wp('85%'),
        bottom: 15,
        alignSelf: "center",
        borderRadius: 15,
        alignItems: "center",
        shadowColor: "black",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
    },
    tabContent: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    iconStyle: {
        width: 30,
        height: 30,
        resizeMode: "contain"
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
})